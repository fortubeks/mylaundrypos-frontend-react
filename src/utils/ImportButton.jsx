import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RiUploadLine } from "react-icons/ri";
import { RiInformationLine } from "react-icons/ri";
import { RequestService } from "../services";
import toast from "./Toast";

const REQUIRED_COLUMNS = ["first_name"];
const OPTIONAL_COLUMNS = [
  "name (→ first + last)",
  "last_name",
  "email",
  "phone",
  "phone_code",
  "other_phone",
  "other_names",
  "address",
  "title",
];

// Canonical column keys (no display suffix) for matching against CSV headers
const OPTIONAL_KEYS = [
  "name",
  "last_name",
  "email",
  "phone",
  "phone_code",
  "other_phone",
  "other_names",
  "address",
  "title",
];

/**
 * Parses a CSV string into { headers, rows }.
 * Handles quoted fields with embedded commas/newlines.
 */
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };

  const splitLine = (line) => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = splitLine(lines[0]);
  const rows = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const vals = splitLine(line);
      const obj = {};
      headers.forEach((h, i) => (obj[h] = vals[i] ?? ""));
      return obj;
    });

  return { headers, rows };
}

const PREVIEW_LIMIT = 5;

/**
 * ImportButton — CSV import for subscribed users.
 *
 * Props:
 *  - endpoint: string  – POST endpoint for import (e.g. "/customers/import")
 *  - onSuccess: fn()   – called after a successful import to refresh the list
 *  - templateHeaders: string[] – ordered column names for the downloadable template
 */
export default function ImportButton({ endpoint, onSuccess, templateHeaders }) {
  const subscription = useSelector((state) => state.user.subscription);
  const isSubscribed = subscription?.is_active;

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null); // { headers, rows, file }
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (!isSubscribed) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so the same file can be re-selected after closing
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = (evt) => {
      let { headers, rows } = parseCSV(evt.target.result);
      if (headers.length === 0 || rows.length === 0) {
        toast.error("The CSV file appears to be empty or invalid.");
        return;
      }
      // If CSV has a 'name' column but no 'first_name', split it
      const nameIdx = headers.findIndex(
        (h) => h.toLowerCase().trim() === "name",
      );
      if (nameIdx !== -1) {
        const newHeaders = [
          ...headers.slice(0, nameIdx),
          "first_name",
          "last_name",
          ...headers.slice(nameIdx + 1),
        ];
        rows = rows.map((row) => {
          const parts = (row[headers[nameIdx]] || "").trim().split(/\s+/);
          const newRow = { ...row };
          delete newRow[headers[nameIdx]];
          newRow["first_name"] = parts[0] || "";
          newRow["last_name"] = parts.slice(1).join(" ") || "";
          return newRow;
        });
        headers = newHeaders;
      }
      setPreview({ headers, rows, file });
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!preview?.file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", preview.file);
    try {
      const response = await RequestService.postForm(endpoint, formData);
      const { imported, errors } = response.data.data;
      if (errors?.length > 0) {
        toast.error(
          `${imported} imported, ${errors.length} row(s) had errors.`,
        );
      } else {
        toast.success(`${imported} customer(s) imported successfully.`);
      }
      setPreview(null);
      onSuccess?.();
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Import failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    if (!templateHeaders?.length) return;
    const csv = templateHeaders.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative flex items-center gap-1">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 h-10 rounded-xl border border-[#E4E4E4] bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
        >
          <RiUploadLine className="text-base" />
          Import CSV
        </button>
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          title="CSV format instructions"
        >
          <RiInformationLine className="text-lg" />
        </button>
        {showInfo && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50 text-sm">
            <div
              className="fixed inset-0 z-[-1]"
              onClick={() => setShowInfo(false)}
            />
            <p className="font-semibold text-gray-800 mb-2">
              CSV Format Instructions
            </p>
            <p className="text-gray-500 text-xs mb-3">
              The first row must be the column headers. Headers are
              case-insensitive and can use spaces or underscores.
            </p>
            <div className="mb-2">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
                Required column
              </p>
              <div className="flex flex-wrap gap-1">
                {REQUIRED_COLUMNS.map((col) => (
                  <span
                    key={col}
                    className="inline-block bg-red-50 text-red-600 text-xs font-mono px-2 py-0.5 rounded"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Optional columns
              </p>
              <div className="flex flex-wrap gap-1">
                {OPTIONAL_COLUMNS.map((col) => (
                  <span
                    key={col}
                    className="inline-block bg-gray-100 text-gray-600 text-xs font-mono px-2 py-0.5 rounded"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
            {templateHeaders?.length > 0 && (
              <button
                onClick={() => {
                  downloadTemplate();
                  setShowInfo(false);
                }}
                className="mt-3 text-xs text-primary underline"
              >
                Download a template CSV
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !loading && setPreview(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Import Customers</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {preview.rows.length} row
                  {preview.rows.length !== 1 ? "s" : ""} found in{" "}
                  <span className="font-medium">{preview.file.name}</span>
                </p>
              </div>
              {templateHeaders?.length > 0 && (
                <button
                  onClick={downloadTemplate}
                  className="text-xs text-primary underline whitespace-nowrap mt-1"
                >
                  Download template
                </button>
              )}
            </div>

            {/* Column guide */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs flex flex-col gap-1.5">
              <p className="font-semibold text-gray-600">Expected columns</p>
              <div className="flex flex-wrap gap-1.5 items-center">
                {REQUIRED_COLUMNS.map((col) => {
                  const found = preview.headers
                    .map((h) => h.toLowerCase().replace(/\s+/g, "_"))
                    .includes(col);
                  return (
                    <span
                      key={col}
                      title="Required"
                      className={`font-mono px-2 py-0.5 rounded border text-xs ${
                        found
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {col}
                      <span className="ml-1 font-sans font-bold">*</span>
                    </span>
                  );
                })}
                {OPTIONAL_COLUMNS.map((col, i) => {
                  const key = OPTIONAL_KEYS[i];
                  const found = preview.headers
                    .map((h) => h.toLowerCase().replace(/\s+/g, "_"))
                    .includes(key);
                  return (
                    <span
                      key={col}
                      title="Optional"
                      className={`font-mono px-2 py-0.5 rounded border text-xs ${
                        found
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-400 border-transparent"
                      }`}
                    >
                      {col}
                    </span>
                  );
                })}
              </div>
              <p className="text-gray-400 mt-0.5">
                <span className="text-red-500 font-bold">*</span> Required
                &nbsp;·&nbsp;
                <span className="inline-block w-3 h-3 rounded bg-green-50 border border-green-200 align-middle" />{" "}
                Found in file &nbsp;·&nbsp;
                <span className="inline-block w-3 h-3 rounded bg-gray-100 border border-transparent align-middle" />{" "}
                Not in file (will be blank)
              </p>
            </div>

            {/* Missing required columns warning */}
            {REQUIRED_COLUMNS.some(
              (col) =>
                !preview.headers
                  .map((h) => h.toLowerCase().replace(/\s+/g, "_"))
                  .includes(col),
            ) && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                <span className="font-semibold">
                  Missing required column(s).
                </span>{" "}
                Rows without <code className="font-mono">first_name</code> will
                be skipped during import.
              </div>
            )}

            {/* Preview table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {preview.headers.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-500 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, PREVIEW_LIMIT).map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      {preview.headers.map((h) => (
                        <td
                          key={h}
                          className="px-3 py-2 text-gray-700 whitespace-nowrap max-w-[160px] truncate"
                        >
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {preview.rows.length > PREVIEW_LIMIT && (
              <p className="text-xs text-gray-400 -mt-2">
                Showing first {PREVIEW_LIMIT} of {preview.rows.length} rows. All
                rows will be imported.
              </p>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setPreview(null)}
                disabled={loading}
                className="px-4 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="px-5 h-10 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 disabled:bg-[#E4E4E4] flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Importing…
                  </>
                ) : (
                  `Import ${preview.rows.length} row${preview.rows.length !== 1 ? "s" : ""}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
