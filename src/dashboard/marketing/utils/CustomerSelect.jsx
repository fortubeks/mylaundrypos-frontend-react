import { useCallback, useEffect, useState } from "react";
import { RequestService } from "../../../services";
import { BarLoader } from "../../../utils/Loader";
import Search from "../../../utils/Search";

/* channel = 'email' | 'whatsapp' | 'both' */
export default function CustomerSelect({
  selectedIds,
  setSelectedIds,
  channel = "email",
}) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await RequestService.getParam("/customers", {
        per_page: 200,
        search,
      });
      setCustomers(res.data.data.data || []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /* eligible = customers reachable via the selected channel */
  const eligible =
    channel === "email"
      ? customers.filter((c) => c.email)
      : channel === "whatsapp"
        ? customers.filter((c) => c.phone)
        : customers.filter((c) => c.email || c.phone);

  const ineligibleCount = customers.length - eligible.length;

  /* sync selectAll */
  useEffect(() => {
    if (eligible.length === 0) return;
    setSelectAll(eligible.every((c) => selectedIds.includes(c.id)));
  }, [eligible, selectedIds]);

  const toggleCustomer = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(eligible.map((c) => c.id));
    }
    setSelectAll(!selectAll);
  };

  const emptyMsg =
    channel === "email"
      ? "No customers with an email address found"
      : channel === "whatsapp"
        ? "No customers with a phone number found"
        : "No customers found";

  const excludedMsg =
    channel === "email"
      ? "excluded (no email on file)"
      : channel === "whatsapp"
        ? "excluded (no phone on file)"
        : "excluded (no contact info on file)";

  return (
    <div className="flex flex-col gap-3">
      {/* Select-all row */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary cursor-pointer"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span className="text-sm font-medium">Select all customers</span>
        </label>
        {selectedIds.length > 0 && (
          <span className="text-xs text-primary font-semibold">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Search */}
      <Search
        value={search}
        setValue={setSearch}
        placeholder="Search customer…"
        width="100%"
      />

      {/* List */}
      <div className="max-h-64 overflow-y-auto border border-[#EFEFEF] rounded-xl bg-[#F9F9F9]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <BarLoader />
          </div>
        ) : eligible.length === 0 ? (
          <p className="text-center text-[#B0B0B0] py-6 text-sm">{emptyMsg}</p>
        ) : (
          <div className="divide-y divide-[#EFEFEF]">
            {eligible.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => toggleCustomer(c.id)}
                />
                <span className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-[#201B1D] truncate">
                    {c.title} {c.first_name} {c.last_name}
                  </span>
                  <span className="text-xs text-[#959595] truncate">
                    {channel === "whatsapp"
                      ? c.phone
                      : channel === "both"
                        ? [c.email, c.phone].filter(Boolean).join(" · ")
                        : c.email}
                  </span>
                </span>
                {/* channel availability badges for 'both' mode */}
                {channel === "both" && (
                  <span className="flex gap-1 shrink-0">
                    {c.email && (
                      <span className="text-[10px] bg-[#EEF4FF] text-primary px-1.5 py-0.5 rounded-full">
                        📧
                      </span>
                    )}
                    {c.phone && (
                      <span className="text-[10px] bg-[#EDFDF5] text-secondary px-1.5 py-0.5 rounded-full">
                        💬
                      </span>
                    )}
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {ineligibleCount > 0 && (
        <p className="text-xs text-[#B0B0B0]">
          {ineligibleCount} customer{ineligibleCount > 1 ? "s" : ""}{" "}
          {excludedMsg}
        </p>
      )}
    </div>
  );
}
