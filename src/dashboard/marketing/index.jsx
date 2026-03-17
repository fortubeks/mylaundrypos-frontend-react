import TabHead from "../../utils/TabHead";
import { useState } from "react";
import toast from "../../utils/Toast";
import { Input } from "../../utils/Input";
import { ButtonPrimary } from "../../utils/Button";
import { RequestService } from "../../services";
import { useSelector } from "react-redux";
import { EMAIL_TEMPLATES } from "./utils/templates";
import TemplatePreview from "./utils/TemplatePreview";
import CustomerSelect from "./utils/CustomerSelect";

/* ── Step indicator ── */
function StepBadge({ step, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
          ${done ? "bg-secondary text-white" : active ? "bg-primary text-white" : "bg-[#EFEFEF] text-[#999]"}`}
      >
        {done ? "✓" : step}
      </div>
      <span
        className={`text-sm font-medium hidden md:block ${active ? "text-primary" : done ? "text-secondary" : "text-[#999]"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepDivider({ done }) {
  return (
    <div
      className={`flex-1 h-0.5 mx-2 rounded transition-colors ${done ? "bg-secondary" : "bg-[#EFEFEF]"}`}
    />
  );
}

/* ────────────────────────────────────────────────
   STEP 1 — Choose a template
   ──────────────────────────────────────────────── */
function StepChooseTemplate({
  selectedTemplate,
  setSelectedTemplate,
  businessName,
  onNext,
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="font-semibold text-base mb-1">Choose a Template</h4>
        <p className="text-sm text-[#959595]">
          Select an email template to start with. You can customise it in the
          next step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMAIL_TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate?.id === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`text-left rounded-2xl border-2 transition-all overflow-hidden
                ${isSelected ? "border-primary shadow-md" : "border-[#EFEFEF] hover:border-[#c8d8ff]"}`}
            >
              {/* Thumbnail */}
              <div
                className="bg-[#F6F6F6] flex items-center justify-center overflow-hidden"
                style={{ height: 160 }}
              >
                <TemplatePreview
                  templateId={tpl.id}
                  content={tpl.defaults}
                  businessName={businessName}
                  thumbnail
                />
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{tpl.icon}</span>
                  <span className="font-semibold text-sm text-[#201B1D]">
                    {tpl.name}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-medium">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#959595] leading-snug">
                  {tpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <ButtonPrimary
          name="Continue"
          onClick={onNext}
          disabled={!selectedTemplate}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   STEP 2 — Edit content + live preview
   ──────────────────────────────────────────────── */
function StepEditContent({
  template,
  content,
  setContent,
  businessName,
  onBack,
  onNext,
}) {
  const handleChange = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const activeColor = content.accentColor ?? template.accentColor;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="font-semibold text-base mb-1">Edit Your Message</h4>
        <p className="text-sm text-[#959595]">
          Customise the content below. The preview on the right updates as you
          type.
        </p>
      </div>

      <div className="flex flex-col xl:grid grid-cols-2 gap-6">
        {/* Left — fields */}
        <div className="flex flex-col gap-4">
          {template.fields.map((field) => (
            <label key={field.key} className="flex flex-col gap-1">
              <span className="text-sm font-medium">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  value={content[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={4}
                  className="w-full bg-[#F6F6F6] rounded-xl outline-none p-3 text-sm resize-none"
                />
              ) : field.type === "color" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={content[field.key] ?? "#008aff"}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-[#EFEFEF] bg-transparent p-0.5"
                  />
                  <span className="text-sm font-mono text-[#555]">
                    {content[field.key] ?? "#008aff"}
                  </span>
                </div>
              ) : (
                <Input
                  selected={content[field.key] ?? ""}
                  setSelected={(v) => handleChange(field.key, v)}
                />
              )}
            </label>
          ))}
        </div>

        {/* Right — live preview */}
        <div className="border border-[#EFEFEF] rounded-2xl overflow-hidden bg-[#F6F6F6]">
          <div className="px-4 py-2.5 border-b border-[#EFEFEF] bg-white flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#959595]">
              Live Preview
            </span>
            <span
              className="w-2 h-2 rounded-full ml-auto"
              style={{ backgroundColor: activeColor }}
            />
          </div>
          <div className="overflow-auto p-3" style={{ maxHeight: 480 }}>
            <div
              style={{
                transform: "scale(0.62)",
                transformOrigin: "top left",
                width: 520,
                pointerEvents: "none",
              }}
            >
              <TemplatePreview
                templateId={template.id}
                content={content}
                businessName={businessName}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="text-sm text-[#959595] hover:text-black underline underline-offset-2"
        >
          ← Back
        </button>
        <ButtonPrimary name="Continue" onClick={onNext} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   WhatsApp bubble preview
   ──────────────────────────────────────────────── */
function WhatsAppBubble({ content, businessName }) {
  const parts = [
    content.title && `*${content.title}*`,
    content.message,
    content.buttonText && `— ${content.buttonText}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="bg-[#ECE5DD] rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {(businessName || "L")[0].toUpperCase()}
        </div>
        <span className="text-xs font-semibold text-[#075E54]">
          {businessName || "Your Laundry"}
        </span>
      </div>
      <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 max-w-xs shadow-sm">
        <p className="text-sm text-[#111] whitespace-pre-wrap leading-snug">
          {parts || "Your message will appear here…"}
        </p>
        <span className="text-[10px] text-[#999] float-right mt-1">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Channel selector pill tabs
   ──────────────────────────────────────────────── */
const CHANNELS = [
  { id: "email", label: "Email", icon: "📧" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "both", label: "Both", icon: "📧💬" },
];

function ChannelSelector({ channel, setChannel, onChannelChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Send via</span>
      <div className="flex gap-2">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => onChannelChange(ch.id)}
            // disabled={ch.id !== "email"}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all
              disabled:cursor-not-allowed disabled:bg-[#F6F6F6] disabled:border-[#E0E0E0] disabled:text-[#999]
              ${
                channel === ch.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-[#555] border-[#E0E0E0] hover:border-primary"
              }`}
          >
            <span>{ch.icon}</span>
            <span>{ch.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   STEP 3 — Select recipients & send
   ──────────────────────────────────────────────── */
function StepSendEmail({
  template,
  content,
  businessName,
  channel,
  onChannelChange,
  selectedIds,
  setSelectedIds,
  onBack,
  onSend,
  sending,
}) {
  const sendLabel =
    channel === "email"
      ? "Send Email"
      : channel === "whatsapp"
        ? "Send WhatsApp"
        : "Send Email & WhatsApp";

  const readyMsg =
    channel === "email"
      ? `📬\u00a0Sending email to`
      : channel === "whatsapp"
        ? `💬\u00a0Sending WhatsApp to`
        : `📧💬\u00a0Sending to`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="font-semibold text-base mb-1">
          Select Recipients & Send
        </h4>
        <p className="text-sm text-[#959595]">
          Choose a delivery channel and which customers should receive this
          message.
        </p>
      </div>

      {/* Channel selector */}
      <ChannelSelector channel={channel} onChannelChange={onChannelChange} />

      <div className="flex flex-col xl:grid grid-cols-2 gap-6">
        {/* Left — customer picker */}
        <div className="flex flex-col gap-3">
          <CustomerSelect
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            channel={channel}
          />

          {selectedIds.length > 0 && (
            <div className="rounded-xl bg-[#F0F7FF] border border-[#d0e8ff] p-3 text-sm text-primary">
              {readyMsg} <strong>{selectedIds.length}</strong> customer
              {selectedIds.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Right — summary + preview */}
        <div className="flex flex-col gap-3">
          <div className="border border-[#EFEFEF] rounded-2xl p-4 bg-white flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{template.icon}</span>
              <span className="font-semibold text-sm">{template.name}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm text-[#555]">
              {channel !== "whatsapp" && (
                <div className="flex gap-2">
                  <span className="text-[#959595] w-16 shrink-0">Subject</span>
                  <span className="truncate font-medium">
                    {content.subject || "—"}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-[#959595] w-16 shrink-0">Headline</span>
                <span className="truncate">{content.title || "—"}</span>
              </div>
            </div>
          </div>

          {/* Email thumbnail — hidden for whatsapp-only */}
          {channel !== "whatsapp" && (
            <div className="border border-[#EFEFEF] rounded-2xl overflow-hidden bg-[#F6F6F6] hidden xl:block">
              <div className="overflow-hidden" style={{ height: 220 }}>
                <div
                  style={{
                    transform: "scale(0.42)",
                    transformOrigin: "top left",
                    width: 520,
                    pointerEvents: "none",
                  }}
                >
                  <TemplatePreview
                    templateId={template.id}
                    content={content}
                    businessName={businessName}
                  />
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp bubble — shown for whatsapp or both */}
          {channel !== "email" && (
            <WhatsAppBubble content={content} businessName={businessName} />
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="text-sm text-[#959595] hover:text-black underline underline-offset-2"
        >
          ← Back
        </button>
        <ButtonPrimary
          name={sending ? "Sending…" : sendLabel}
          onClick={onSend}
          disabled={selectedIds.length === 0 || sending}
          loading={sending}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Main page
   ──────────────────────────────────────────────── */
export default function Index() {
  const user = useSelector((state) => state.user.user);
  const businessName =
    user?.app_settings?.business_name || user?.name || "Your Laundry";

  const [step, setStep] = useState(1); // 1 | 2 | 3

  /* Template selection */
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  /* Editable content (populated from template defaults on selection) */
  const [content, setContent] = useState({});

  /* Customer selection */
  const [selectedIds, setSelectedIds] = useState([]);

  const [sending, setSending] = useState(false);
  const [channel, setChannel] = useState("email"); // 'email' | 'whatsapp' | 'both'

  /* Clear selection when channel changes (different customers might be eligible) */
  const handleChannelChange = (ch) => {
    setChannel(ch);
    setSelectedIds([]);
  };

  /* When a template is selected, prefill content with its defaults */
  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setContent({ ...tpl.defaults });
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one customer.");
      return;
    }
    setSending(true);
    try {
      await RequestService.post("/marketing/send", {
        template_id: selectedTemplate.id,
        content,
        customer_ids: selectedIds,
        channel,
      });
      const channelLabel =
        channel === "email"
          ? "email"
          : channel === "whatsapp"
            ? "WhatsApp"
            : "email & WhatsApp";
      toast.success(
        `${channelLabel.charAt(0).toUpperCase() + channelLabel.slice(1)} sent to ${selectedIds.length} customer${
          selectedIds.length > 1 ? "s" : ""
        }!`,
      );
      /* Reset */
      setStep(1);
      setSelectedTemplate(null);
      setContent({});
      setSelectedIds([]);
      setChannel("email");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to send email. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const STEPS = [
    { label: "Choose Template" },
    { label: "Edit Content" },
    { label: "Send" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-[20px] overflow-hidden">
      <TabHead name="Email Marketing" size="14px" />

      {/* Step indicator */}
      <div className="px-5 py-4 border-b border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="flex items-center max-w-md">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <StepBadge
                step={i + 1}
                label={s.label}
                active={step === i + 1}
                done={step > i + 1}
              />
              {i < STEPS.length - 1 && <StepDivider done={step > i + 1} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {step === 1 && (
          <StepChooseTemplate
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={handleSelectTemplate}
            businessName={businessName}
            onNext={() => {
              if (!selectedTemplate) {
                toast.error("Please choose a template first.");
                return;
              }
              setStep(2);
            }}
          />
        )}

        {step === 2 && selectedTemplate && (
          <StepEditContent
            template={selectedTemplate}
            content={content}
            setContent={setContent}
            businessName={businessName}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && selectedTemplate && (
          <StepSendEmail
            template={selectedTemplate}
            content={content}
            businessName={businessName}
            channel={channel}
            onChannelChange={handleChannelChange}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onBack={() => setStep(2)}
            onSend={handleSend}
            sending={sending}
          />
        )}
      </div>
    </div>
  );
}
