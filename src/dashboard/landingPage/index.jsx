import { useEffect, useState, useRef } from "react";
import { BookingService, cleanUpErr } from "../../services";
import { BarLoader } from "../../utils/Loader";
import toast from "../../utils/Toast";
import { FiExternalLink, FiCopy, FiUpload, FiCheck } from "react-icons/fi";
import { FRONTEND_BASE_URL as BASE, IMAGE_BASE_URL as IMG } from "../../config/env";

export default function LandingPageEditor() {
  const [laundry, setLaundry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [copiedLanding, setCopiedLanding] = useState(false);
  const [copiedBooking, setCopiedBooking] = useState(false);
  const [form, setForm] = useState({});
  const coverRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await BookingService.getLandingPage();
        setLaundry(data);
        setForm({
          name: data.name || "",
          tagline: data.tagline || "",
          description: data.description || "",
          bank_name: data.bank_name || "",
          account_number: data.account_number || "",
          account_name: data.account_name || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          whatsapp: data.whatsapp || "",
          pickup_enabled: !!data.pickup_enabled,
          dropoff_enabled: !!data.dropoff_enabled,
          landing_page_enabled: !!data.landing_page_enabled,
        });
      } catch (err) {
        cleanUpErr(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const publicUrl = laundry?.slug ? `${BASE}/${laundry.slug}` : null;
  const bookingUrl = laundry?.slug ? `${BASE}/${laundry.slug}/booking` : null;

  function copyLandingUrl() {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLanding(true);
    setTimeout(() => setCopiedLanding(false), 2000);
  }

  function copyBookingUrl() {
    if (!bookingUrl) return;
    navigator.clipboard.writeText(bookingUrl);
    setCopiedBooking(true);
    setTimeout(() => setCopiedBooking(false), 2000);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await BookingService.updateLandingPage(form);
      toast.success("Landing page updated!");
    } catch (err) {
      cleanUpErr(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const updated = await BookingService.uploadCoverImage(file);
      setLaundry((prev) => ({ ...prev, cover_image: updated.cover_image }));
      toast.success("Cover image updated!");
    } catch (err) {
      cleanUpErr(err);
    } finally {
      setCoverUploading(false);
      e.target.value = "";
    }
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const updated = await BookingService.uploadLogo(file);
      setLaundry((prev) => ({ ...prev, logo: updated.logo }));
      toast.success("Logo updated!");
    } catch (err) {
      cleanUpErr(err);
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <main className="h-full grow flex items-center justify-center">
        <BarLoader />
      </main>
    );
  }

  const coverSrc = laundry?.cover_image
    ? `${IMG}covers/${laundry.cover_image}`
    : null;
  const logoSrc = laundry?.logo ? `${IMG}logos/${laundry.logo}` : null;

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <form
        onSubmit={handleSave}
        className="p-5 w-full flex flex-col gap-5 max-w-2xl"
      >
        {/* Public links */}
        {publicUrl && (
          <div className="flex flex-col gap-3">
            <LinkCopyRow
              label="Landing Page"
              url={publicUrl}
              copied={copiedLanding}
              onCopy={copyLandingUrl}
            />
            <LinkCopyRow
              label="Booking Page"
              url={bookingUrl}
              copied={copiedBooking}
              onCopy={copyBookingUrl}
              accent="secondary"
            />
          </div>
        )}

        {/* Enable/disable */}
        <Section title="Visibility">
          <Toggle
            label="Enable landing page"
            desc="Make your landing page publicly accessible"
            checked={form.landing_page_enabled}
            onChange={(v) => setForm({ ...form, landing_page_enabled: v })}
          />
        </Section>

        {/* Logo */}
        <Section title="Business Logo">
          <div className="flex items-center gap-4">
            <div
              className="relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 hover:border-primary bg-gray-50 flex items-center justify-center shrink-0 transition-colors"
              onClick={() => logoRef.current?.click()}
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUpload className="text-gray-400" size={20} />
              )}
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded-2xl">
                <FiUpload className="text-white" size={16} />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p className="font-medium text-gray-700 mb-0.5">
                {logoUploading ? "Uploading…" : "Click logo to change"}
              </p>
              <p className="text-xs">
                Shown as a circle on your landing page. PNG/JPG, max 5MB.
              </p>
            </div>
          </div>
          <input
            type="file"
            ref={logoRef}
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </Section>

        {/* Cover image */}
        <Section title="Cover Image">
          <div
            className="relative h-40 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 hover:border-primary transition-colors"
            onClick={() => coverRef.current?.click()}
          >
            {coverSrc ? (
              <img
                src={coverSrc}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FiUpload size={24} className="mb-2" />
                <p className="text-sm">Click to upload cover image</p>
                <p className="text-xs mt-1">Recommended: 1200×400px</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
              <span className="text-white text-sm font-semibold flex items-center gap-2">
                {coverUploading ? (
                  "Uploading…"
                ) : (
                  <>
                    <FiUpload /> Change Cover
                  </>
                )}
              </span>
            </div>
          </div>
          <input
            type="file"
            ref={coverRef}
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
        </Section>

        {/* Business info */}
        <Section title="Business Info">
          <Field
            label="Business Name"
            placeholder="e.g. Sparkle Laundry"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            max={120}
          />
          <Field
            label="Tagline"
            placeholder="e.g. Fresh & Clean, Every Time"
            value={form.tagline}
            onChange={(v) => setForm({ ...form, tagline: v })}
            max={100}
          />
          <Field
            label="Description"
            placeholder="Tell customers about your laundry service…"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            multiline
          />
        </Section>

        {/* Service types */}
        <Section title="Service Options">
          <Toggle
            label="Offer Pickup"
            desc="You collect laundry from customers"
            checked={form.pickup_enabled}
            onChange={(v) => setForm({ ...form, pickup_enabled: v })}
          />
          <Toggle
            label="Offer Drop-off"
            desc="Customers bring items to your store"
            checked={form.dropoff_enabled}
            onChange={(v) => setForm({ ...form, dropoff_enabled: v })}
          />
        </Section>

        {/* Bank details */}
        <Section title="Payment Details">
          <p className="text-xs text-gray-500 -mt-1 mb-1">
            Customers will see these details after booking to transfer payment.
          </p>
          <Field
            label="Bank Name"
            placeholder="e.g. First Bank"
            value={form.bank_name}
            onChange={(v) => setForm({ ...form, bank_name: v })}
          />
          <Field
            label="Account Number"
            placeholder="0123456789"
            value={form.account_number}
            onChange={(v) => setForm({ ...form, account_number: v })}
          />
          <Field
            label="Account Name"
            placeholder="e.g. Demo Laundry Services"
            value={form.account_name}
            onChange={(v) => setForm({ ...form, account_name: v })}
          />
        </Section>

        {/* Social links */}
        <Section title="Social & Contact Links">
          <Field
            label="Instagram"
            placeholder="https://instagram.com/yourlaundry"
            value={form.instagram}
            onChange={(v) => setForm({ ...form, instagram: v })}
          />
          <Field
            label="Facebook"
            placeholder="https://facebook.com/yourlaundry"
            value={form.facebook}
            onChange={(v) => setForm({ ...form, facebook: v })}
          />
          <Field
            label="WhatsApp Number"
            placeholder="e.g. 08012345678"
            value={form.whatsapp}
            onChange={(v) => setForm({ ...form, whatsapp: v })}
          />
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <h2 className="font-bold text-gray-700 text-sm mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline, max }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={max}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
      )}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-primary" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function LinkCopyRow({ label, url, copied, onCopy, accent = "primary" }) {
  const accentCls =
    accent === "secondary"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-blue-50 border-blue-200 text-blue-800";
  const labelCls = accent === "secondary" ? "text-green-600" : "text-blue-600";
  const btnCls =
    accent === "secondary"
      ? "border-green-200 text-green-700 hover:bg-green-100"
      : "border-blue-200 text-blue-700 hover:bg-blue-100";
  const previewCls =
    accent === "secondary"
      ? "bg-secondary hover:bg-green-700"
      : "bg-primary hover:bg-blue-600";

  return (
    <div
      className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${accentCls}`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold mb-0.5 ${labelCls}`}>{label}</p>
        <p className="text-sm font-mono truncate">{url}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={onCopy}
          className={`flex items-center gap-1.5 text-xs bg-white border rounded-lg px-3 py-2 transition-colors ${btnCls}`}
        >
          {copied ? <FiCheck /> : <FiCopy />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 text-xs text-white rounded-lg px-3 py-2 transition-colors ${previewCls}`}
        >
          <FiExternalLink /> Open
        </a>
      </div>
    </div>
  );
}
