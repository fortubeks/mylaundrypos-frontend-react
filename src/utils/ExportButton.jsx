import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RiDownloadLine } from "react-icons/ri";
import { RequestService } from "../services";
import toast from "./Toast";

/**
 * Converts an array of objects to a CSV string.
 * @param {Object[]} data
 * @param {string[]} columns – keys to include (in order)
 * @param {Object} headers – { key: "Display Header" }
 */
function toCSV(data, columns, headers) {
  const headerRow = columns.map((c) => headers[c] ?? c).join(",");
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c] ?? "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        // Escape double-quotes and wrap in quotes if needed
        const escaped = str.replace(/"/g, '""');
        return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
      })
      .join(","),
  );
  return [headerRow, ...rows].join("\n");
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * ExportButton
 *
 * Props:
 *  - currentData: array of items currently displayed
 *  - columns: string[] – object keys to export
 *  - headers: { key: "Label" } – column display names
 *  - filename: base filename (without .csv)
 *  - fetchAllEndpoint: "/endpoint" – used for "Export All"
 *  - fetchAllParams: optional extra query params for the all-export request
 */
export default function ExportButton({
  currentData = [],
  columns,
  headers,
  filename = "export",
  fetchAllEndpoint,
  fetchAllParams = {},
}) {
  const subscription = useSelector((state) => state.user.subscription);
  const isSubscribed = subscription?.is_active;

  const [open, setOpen] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const containerRef = useRef(null);

  if (!isSubscribed) return null;

  const exportCurrent = () => {
    if (!currentData.length) {
      toast("No data to export", "error");
      return;
    }
    const csv = toCSV(currentData, columns, headers);
    downloadCSV(csv, `${filename}-current.csv`);
    setOpen(false);
  };

  const exportAll = async () => {
    setLoadingAll(true);
    setOpen(false);
    try {
      const response = await RequestService.getParam(fetchAllEndpoint, {
        ...fetchAllParams,
        per_page: 100000,
        page: 1,
      });
      // Support both { data: { data: [] } } and { data: [] }
      const rawData = response.data?.data?.data ?? response.data?.data ?? [];
      if (!rawData.length) {
        toast("No data to export", "error");
        return;
      }
      const csv = toCSV(rawData, columns, headers);
      downloadCSV(csv, `${filename}-all.csv`);
    } catch (err) {
      console.error(err);
      toast("Export failed. Please try again.", "error");
    } finally {
      setLoadingAll(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loadingAll}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <RiDownloadLine className="w-4 h-4" />
        {loadingAll ? "Exporting…" : "Export"}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <button
              onClick={exportCurrent}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Export current list
            </button>
            {fetchAllEndpoint && (
              <button
                onClick={exportAll}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
              >
                Export all
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
