import { useState } from "react";
import { RiArrowGoBackLine, RiDeleteBin6Line } from "react-icons/ri";
import { BarLoader } from "../../../utils/Loader";

const CHANNEL_META = {
  email: {
    label: "Email",
    icon: "📧",
    bg: "bg-[#EEF4FF]",
    color: "text-primary",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: "💬",
    bg: "bg-[#EDFDF5]",
    color: "text-secondary",
  },
  both: {
    label: "Email + WhatsApp",
    icon: "📧💬",
    bg: "bg-[#FFF8EE]",
    color: "text-orange-500",
  },
};

function fmt(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

/* ── Shared confirm-delete actions ─────────────────────────────────── */
function DeleteAction({ id, confirmId, setConfirmId, onDelete }) {
  const isConfirming = confirmId === id;
  if (isConfirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            onDelete(id);
            setConfirmId(null);
          }}
          className="px-3 py-2 text-xs font-medium bg-red-500 text-white rounded-xl"
        >
          Delete
        </button>
        <button
          onClick={() => setConfirmId(null)}
          className="px-2 py-2 text-xs text-[#999] hover:text-[#555]"
        >
          Cancel
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => setConfirmId(id)}
      className="w-9 h-9 flex items-center justify-center text-[#ccc] hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
      title="Delete campaign"
    >
      <RiDeleteBin6Line className="text-lg" />
    </button>
  );
}

export default function PastCampaigns({
  campaigns,
  loading,
  viewMode = "list",
  onReuse,
  onDelete,
}) {
  const [confirmId, setConfirmId] = useState(null);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <BarLoader />
      </div>
    );
  }

  if (!campaigns.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="text-5xl">📭</div>
        <h4 className="font-semibold text-[#201B1D]">No past campaigns yet</h4>
        <p className="text-sm text-[#959595] max-w-xs leading-relaxed">
          Once you send your first campaign it will appear here — you can reuse
          it with a single click.
        </p>
      </div>
    );
  }

  /* ── Grid view ───────────────────────────────────────────────────── */
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {campaigns.map((c) => {
          const ch = CHANNEL_META[c.channel] ?? CHANNEL_META.email;
          return (
            <div
              key={c.id}
              className="border border-[#EFEFEF] rounded-2xl p-4 bg-white flex flex-col gap-3 hover:border-[#d0e8ff] transition-colors"
            >
              {/* Icon + channel badge */}
              <div className="flex items-start justify-between">
                <div className="text-4xl leading-none">
                  {c.template_icon || "📧"}
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ch.bg} ${ch.color}`}
                >
                  {ch.icon} {ch.label}
                </span>
              </div>

              {/* Name + subject */}
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="font-semibold text-sm text-[#201B1D] line-clamp-2 leading-snug">
                  {c.name || c.template_name}
                </span>
                {c.content?.subject && (
                  <p className="text-xs text-[#777] truncate">
                    {c.content.subject}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-0.5 text-[11px] text-[#959595]">
                <span>📅 {fmt(c.sent_at ?? c.sentAt)}</span>
                <span>
                  👥 {c.recipient_count} recipient
                  {c.recipient_count !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#F3F3F3]">
                <button
                  onClick={() => onReuse(c)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  <RiArrowGoBackLine />
                  Reuse
                </button>
                <DeleteAction
                  id={c.id}
                  confirmId={confirmId}
                  setConfirmId={setConfirmId}
                  onDelete={onDelete}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ── List view (default) ─────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-3">
      {campaigns.map((c) => {
        const ch = CHANNEL_META[c.channel] ?? CHANNEL_META.email;

        return (
          <div
            key={c.id}
            className="border border-[#EFEFEF] rounded-2xl p-4 bg-white flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[#d0e8ff] transition-colors"
          >
            {/* Template icon + info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="text-3xl shrink-0 leading-none mt-0.5">
                {c.template_icon || "📧"}
              </div>
              <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[#201B1D]">
                    {c.name || c.template_name}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ch.bg} ${ch.color}`}
                  >
                    {ch.icon} {ch.label}
                  </span>
                </div>
                {c.content?.subject && (
                  <p className="text-xs text-[#555] truncate">
                    Subject: {c.content.subject}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-[#959595] flex-wrap mt-0.5">
                  <span>📅 {fmt(c.sent_at ?? c.sentAt)}</span>
                  <span>
                    👥 {c.recipient_count} recipient
                    {c.recipient_count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onReuse(c)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
              >
                <RiArrowGoBackLine />
                Reuse
              </button>
              <DeleteAction
                id={c.id}
                confirmId={confirmId}
                setConfirmId={setConfirmId}
                onDelete={onDelete}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
