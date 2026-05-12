import { useCallback, useEffect, useState } from "react";
import { RequestService } from "../../../services";
import { BarLoader } from "../../../utils/Loader";
import Search from "../../../utils/Search";
import { BUILTIN_GROUPS, applyBuiltinFilter } from "./groups";
import { RiAddLine, RiCheckLine, RiDeleteBinLine } from "react-icons/ri";

/* channel = 'email' | 'whatsapp' | 'both' */
export default function CustomerSelect({ selectedIds, setSelectedIds, channel = "email" }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* Groups state */
  const [customGroups, setCustomGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [savingGroup, setSavingGroup] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await RequestService.getParam("/customers", { per_page: 500 });
      setCustomers(res.data.data.data || []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await RequestService.get("/marketing/groups");
      setCustomGroups(res.data.data || []);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchGroups();
  }, [fetchCustomers, fetchGroups]);

  const eligible =
    channel === "email"
      ? customers.filter((c) => c.email)
      : channel === "whatsapp"
        ? customers.filter((c) => c.phone)
        : customers.filter((c) => c.email || c.phone);

  const ineligibleCount = customers.length - eligible.length;
  const allGroups = [...BUILTIN_GROUPS, ...customGroups];

  const getGroupMembers = useCallback(
    (groupId) => {
      if (!groupId || groupId === "all") return eligible;
      const isBuiltin = BUILTIN_GROUPS.some((g) => g.id === groupId);
      if (isBuiltin) return applyBuiltinFilter(groupId, eligible);
      const cg = customGroups.find((g) => g.id === groupId);
      return cg
        ? eligible.filter((c) => (cg.customer_ids ?? cg.customerIds ?? []).includes(c.id))
        : eligible;
    },
    [eligible, customGroups],
  );

  const groupFiltered = getGroupMembers(activeGroupId);
  const displayList = search
    ? groupFiltered.filter((c) =>
        `${c.title ?? ""} ${c.first_name ?? ""} ${c.last_name ?? ""} ${c.email ?? ""} ${c.phone ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : groupFiltered;

  const allSelected =
    displayList.length > 0 && displayList.every((c) => selectedIds.includes(c.id));

  const toggleCustomer = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSelectAll = () => {
    const ids = displayList.map((c) => c.id);
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const handleGroupClick = (groupId) => {
    if (activeGroupId === groupId) {
      setActiveGroupId(null);
      setSelectedIds([]);
      return;
    }
    setActiveGroupId(groupId);
    setShowSaveInput(false);
    setSelectedIds(getGroupMembers(groupId).map((c) => c.id));
  };

  const handleSaveGroup = async () => {
    if (!newGroupName.trim()) return;
    setSavingGroup(true);
    try {
      const res = await RequestService.post("/marketing/groups", {
        name: newGroupName.trim(),
        customer_ids: selectedIds,
      });
      const created = res.data.data;
      setCustomGroups((prev) => [...prev, created]);
      setNewGroupName("");
      setShowSaveInput(false);
    } catch {
      /* silent */
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await RequestService.delete(`/marketing/groups/${id}`);
      setCustomGroups((prev) => prev.filter((g) => g.id !== id));
      if (activeGroupId === id) setActiveGroupId(null);
      setConfirmDeleteId(null);
    } catch {
      /* silent */
    }
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
      {/* Audience groups */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#201B1D]">Audience Groups</span>
          {selectedIds.length > 0 && !showSaveInput && (
            <button
              onClick={() => setShowSaveInput(true)}
              className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
            >
              <RiAddLine />
              Save as group
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allGroups.map((g) => {
            const isBuiltin = BUILTIN_GROUPS.some((b) => b.id === g.id);
            const isActive = activeGroupId === g.id;
            const count = getGroupMembers(g.id).length;
            return (
              <div key={g.id} className="flex items-center">
                <button
                  onClick={() => handleGroupClick(g.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all
                    ${isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-[#555] border-[#E0E0E0] hover:border-primary hover:text-primary"
                    }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                  <span className={`ml-0.5 ${isActive ? "text-white/70" : "text-[#bbb]"}`}>
                    ({count})
                  </span>
                </button>
                {!isBuiltin && (
                  <button
                    onClick={() =>
                      confirmDeleteId === g.id
                        ? handleDeleteGroup(g.id)
                        : setConfirmDeleteId(g.id)
                    }
                    onBlur={() => setTimeout(() => setConfirmDeleteId(null), 150)}
                    title={confirmDeleteId === g.id ? "Click to confirm" : "Delete group"}
                    className={`ml-0.5 w-5 h-5 flex items-center justify-center rounded-full text-[11px] transition-colors
                      ${confirmDeleteId === g.id
                        ? "bg-red-500 text-white"
                        : "text-[#ccc] hover:text-red-400 hover:bg-red-50"
                      }`}
                  >
                    {confirmDeleteId === g.id ? "✕" : <RiDeleteBinLine />}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showSaveInput && (
          <div className="flex items-center gap-2 p-3 bg-[#F0F7FF] rounded-xl border border-[#d0e8ff]">
            <span className="text-xs text-[#555] shrink-0">Group name:</span>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveGroup()}
              placeholder="e.g. Inactive Customers"
              autoFocus
              className="flex-1 min-w-0 bg-white border border-[#d0e8ff] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={handleSaveGroup}
              disabled={!newGroupName.trim() || savingGroup}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg disabled:bg-[#E4E4E4] disabled:text-[#999]"
            >
              <RiCheckLine />
              {savingGroup ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setShowSaveInput(false); setNewGroupName(""); }}
              className="text-xs text-[#999] hover:text-[#555]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Select-all row */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary cursor-pointer"
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <span className="text-sm font-medium">
            {activeGroupId
              ? `Select all in "${allGroups.find((g) => g.id === activeGroupId)?.name ?? activeGroupId}"`
              : "Select all customers"}
          </span>
        </label>
        {selectedIds.length > 0 && (
          <span className="text-xs text-primary font-semibold">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Search */}
      <Search value={search} setValue={setSearch} placeholder="Search customer…" width="100%" />

      {/* Customer list */}
      <div className="max-h-64 overflow-y-auto border border-[#EFEFEF] rounded-xl bg-[#F9F9F9]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <BarLoader />
          </div>
        ) : displayList.length === 0 ? (
          <p className="text-center text-[#B0B0B0] py-6 text-sm">
            {search ? "No customers match your search" : emptyMsg}
          </p>
        ) : (
          <div className="divide-y divide-[#EFEFEF]">
            {displayList.map((c) => (
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
          {ineligibleCount} customer{ineligibleCount > 1 ? "s" : ""} {excludedMsg}
        </p>
      )}
    </div>
  );
}
