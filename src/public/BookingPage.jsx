import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PublicService } from "../services";
import { BarLoader } from "../utils/Loader";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiMinus,
  FiPlus,
  FiCopy,
} from "react-icons/fi";

const STEPS = ["Select Services", "Your Details", "Confirm & Pay"];

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [laundry, setLaundry] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [step, setStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});
  const [serviceType, setServiceType] = useState("dropoff");
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    pickup_address: "",
    preferred_date: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [l, s] = await Promise.all([
          PublicService.getLaundry(slug),
          PublicService.getServices(slug),
        ]);
        setLaundry(l);
        setServices(s);
        if (l.pickup_enabled && !l.dropoff_enabled) setServiceType("pickup");
        if (!l.pickup_enabled && l.dropoff_enabled) setServiceType("dropoff");
      } catch (err) {
        setError(
          err?.response?.data?.message || "This booking page is not available.",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f9ff]">
        <BarLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f9ff] text-center px-6">
        <div className="text-5xl mb-4">🧺</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unavailable</h1>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button
          onClick={() => navigate(`/${slug}`)}
          className="mt-6 text-primary hover:underline flex items-center gap-1"
        >
          <FiArrowLeft /> Back to page
        </button>
      </div>
    );
  }

  // Group services by category
  const grouped = services.reduce((acc, s) => {
    const cat = s.category?.name || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const cartItems = Object.entries(selectedItems)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const s = services.find((x) => x.id === Number(id));
      return { ...s, quantity: qty, subtotal: s.price * qty };
    });

  const total = cartItems.reduce((sum, i) => sum + i.subtotal, 0);

  function updateQty(id, delta) {
    setSelectedItems((prev) => {
      const cur = prev[id] || 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [id]: next };
    });
  }

  function canGoNext() {
    if (step === 0) return true; // services are optional
    if (step === 1) {
      const { customer_name, customer_phone, pickup_address } = form;
      if (!customer_name || !customer_phone) return false;
      if (serviceType === "pickup" && !pickup_address) return false;
      return true;
    }
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || undefined,
        service_type: serviceType,
        pickup_address:
          serviceType === "pickup" ? form.pickup_address : undefined,
        preferred_date: form.preferred_date || undefined,
        notes: form.notes || undefined,
        items: cartItems.map((i) => ({
          service_item_id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      };
      const result = await PublicService.createBooking(slug, payload);
      setBookingResult(result);
      setStep(3); // success step
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(bookingResult.booking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={
        step === 0
          ? "h-screen flex flex-col bg-[#f6f9ff] overflow-hidden"
          : "min-h-screen bg-[#f6f9ff]"
      }
    >
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 shrink-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          {step < 3 ? (
            <button
              onClick={() =>
                step > 0 ? setStep(step - 1) : navigate(`/${slug}`)
              }
              className="flex items-center gap-2 text-gray-600 hover:text-primary text-sm font-medium"
            >
              <FiArrowLeft /> {step === 0 ? laundry?.name : "Back"}
            </button>
          ) : (
            <div className="w-16" />
          )}
          <span className="text-sm font-semibold text-gray-700">
            Book Service
          </span>
          <div className="w-16" />
        </div>
      </div>

      {/* STEP 0: full-height split layout */}
      {step === 0 && (
        <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 overflow-hidden px-4">
          {/* Step indicators */}
          <div className="flex items-center justify-center py-5 gap-2 shrink-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-secondary text-white"
                      : i === step
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < step ? <FiCheck /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i === step ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 transition-all ${
                      i < step ? "bg-secondary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Scrollable services area */}
          <div className="flex-1 overflow-y-auto pb-2">
            {/* Service type selector */}
            {laundry.pickup_enabled && laundry.dropoff_enabled && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  How would you like your laundry handled?
                </p>
                <div className="flex gap-3">
                  {[
                    {
                      val: "dropoff",
                      label: "Drop-off",
                      icon: "🏪",
                      desc: "Bring to our store",
                    },
                    {
                      val: "pickup",
                      label: "Pickup",
                      icon: "🚗",
                      desc: "We collect from you",
                    },
                  ].map((o) => (
                    <button
                      key={o.val}
                      onClick={() => setServiceType(o.val)}
                      className={`flex-1 border-2 rounded-xl p-3 text-left transition-all ${
                        serviceType === o.val
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{o.icon}</div>
                      <div className="font-semibold text-sm text-gray-800">
                        {o.label}
                      </div>
                      <div className="text-xs text-gray-500">{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Services list */}
            {Object.entries(grouped).map(([cat, items]) => (
              <div
                key={cat}
                className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
              >
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700 text-sm">{cat}</h3>
                </div>
                <div>
                  {items.map((s, idx) => {
                    const qty = selectedItems[s.id] || 0;
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center justify-between px-5 py-4 ${
                          idx < items.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="font-medium text-gray-800 text-sm truncate">
                            {s.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            ₦{Number(s.price).toLocaleString()} /{" "}
                            {s.unit_type === "per_kg" ? "kg" : "item"}
                            {s.turnaround_time
                              ? ` · ${s.turnaround_time}h`
                              : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {qty > 0 ? (
                            <>
                              <button
                                onClick={() => updateQty(s.id, -1)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
                              >
                                <FiMinus size={13} />
                              </button>
                              <span className="w-5 text-center text-sm font-bold text-gray-800">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQty(s.id, 1)}
                                className="w-7 h-7 rounded-full border border-primary bg-primary text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                              >
                                <FiPlus size={13} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => updateQty(s.id, 1)}
                              className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors"
                            >
                              <FiPlus size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sticky footer: summary + continue button */}
          <div className="shrink-0 pt-3 pb-6 bg-[#f6f9ff]">
            {cartItems.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
                  Selected ({cartItems.length} service
                  {cartItems.length > 1 ? "s" : ""})
                </p>
                <div className="space-y-1 mb-3">
                  {cartItems.map((i) => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {i.name} × {i.quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        ₦{Number(i.subtotal).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="text-primary">
                    ₦{Number(total).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            {cartItems.length === 0 && serviceType === "pickup" && (
              <p className="text-xs text-center text-gray-400 mb-3">
                No services added — items will be confirmed on pickup
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/${slug}`)}
                className="flex-none px-5 bg-white border border-gray-200 text-gray-600 rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:border-gray-300 transition-colors"
              >
                <FiArrowLeft />
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-primary text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                Continue <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps 1, 2, 3 */}
      {step > 0 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Step indicators */}
          {step < 3 && (
            <div className="flex items-center justify-center mb-8 gap-2">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < step
                        ? "bg-secondary text-white"
                        : i === step
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < step ? <FiCheck /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      i === step ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {s}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-8 transition-all ${
                        i < step ? "bg-secondary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 1: Customer Details */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Your Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({ ...form, customer_name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.customer_phone}
                  onChange={(e) =>
                    setForm({ ...form, customer_phone: e.target.value })
                  }
                  placeholder="08012345678"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) =>
                    setForm({ ...form, customer_email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home / Pickup Address
                  {serviceType === "pickup" && (
                    <span className="text-red-500"> *</span>
                  )}
                  {serviceType !== "pickup" && (
                    <span className="text-gray-400 text-xs"> (optional)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={form.pickup_address}
                  onChange={(e) =>
                    setForm({ ...form, pickup_address: e.target.value })
                  }
                  placeholder={
                    serviceType === "pickup"
                      ? "Enter your address for pickup"
                      : "Your home address"
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date &amp; Time{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.preferred_date}
                  min={new Date(
                    new Date().getTime() -
                      new Date().getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    setForm({ ...form, preferred_date: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="Any special instructions..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Review & Confirm */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-800 text-base mb-4">
                  Order Summary
                </h2>
                {cartItems.length > 0 ? (
                  <div className="space-y-3">
                    {cartItems.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {i.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {i.quantity} × ₦{Number(i.price).toLocaleString()}
                          </div>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">
                          ₦{Number(i.subtotal).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-extrabold text-primary text-lg">
                        ₦{Number(total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No services selected — items will be confirmed on{" "}
                    {serviceType === "pickup" ? "pickup" : "drop-off"}.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-800 text-base mb-3">
                  Your Info
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {form.customer_name}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {form.customer_phone}
                  </div>
                  {form.customer_email && (
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {form.customer_email}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Service:</span>{" "}
                    {serviceType === "pickup" ? "Pickup" : "Drop-off"}
                  </div>
                  {form.pickup_address && (
                    <div>
                      <span className="font-medium">
                        {serviceType === "pickup" ? "Pickup" : "Home"} Address:
                      </span>{" "}
                      {form.pickup_address}
                    </div>
                  )}
                  {form.preferred_date && (
                    <div>
                      <span className="font-medium">Date &amp; Time:</span>{" "}
                      {new Date(form.preferred_date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
                <p className="font-semibold mb-1">
                  📌 Next Steps After Booking
                </p>
                <p>
                  After confirming, you will receive a{" "}
                  <strong>booking code</strong>. Transfer the total amount to{" "}
                  {laundry.name}'s bank account and show the code when they
                  collect your items.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && bookingResult && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-600 text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Your booking has been received. Show the code below to
                  confirm.
                </p>

                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 mb-6">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                    Your Booking Code
                  </p>
                  <div className="text-4xl font-extrabold text-primary tracking-widest mb-3">
                    {bookingResult.booking_code}
                  </div>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mx-auto transition-colors"
                  >
                    {copied ? (
                      <FiCheck className="text-green-500" />
                    ) : (
                      <FiCopy />
                    )}
                    {copied ? "Copied!" : "Copy code"}
                  </button>
                </div>

                {Number(bookingResult.total_amount) > 0 && (
                  <>
                    <div className="text-2xl font-extrabold text-gray-900 mb-1">
                      ₦{Number(bookingResult.total_amount).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Transfer this amount
                    </p>
                  </>
                )}

                {Number(bookingResult.total_amount) > 0 &&
                  (bookingResult.bank_name || bookingResult.account_number) && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left text-sm space-y-2">
                      <p className="font-bold text-gray-800 text-center mb-3">
                        Bank Transfer Details
                      </p>
                      {bookingResult.bank_name && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bank</span>
                          <span className="font-semibold text-gray-800">
                            {bookingResult.bank_name}
                          </span>
                        </div>
                      )}
                      {bookingResult.account_number && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Account No.</span>
                          <span className="font-semibold text-gray-800 font-mono">
                            {bookingResult.account_number}
                          </span>
                        </div>
                      )}
                      {bookingResult.account_name && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Account Name</span>
                          <span className="font-semibold text-gray-800">
                            {bookingResult.account_name}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-blue-100 pt-2 mt-2">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-extrabold text-primary">
                          ₦{Number(bookingResult.total_amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-1">
                  What happens next?
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-500">
                  <li>Transfer the amount to the account above</li>
                  <li>
                    Show your booking code{" "}
                    <strong>{bookingResult.booking_code}</strong> to the laundry
                    staff
                  </li>
                  <li>They will confirm your booking and collect your items</li>
                </ol>
              </div>

              <button
                onClick={() => navigate(`/${slug}`)}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}

          {/* Continue / Confirm button for steps 1–2 */}
          {step < 3 && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(step - 1)}
                className="flex-none px-5 bg-white border border-gray-200 text-gray-600 rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:border-gray-300 transition-colors"
              >
                <FiArrowLeft />
              </button>
              <button
                disabled={!canGoNext() || submitting}
                onClick={() => {
                  if (step === 2) {
                    handleSubmit();
                  } else {
                    setStep(step + 1);
                  }
                }}
                className="flex-1 bg-primary text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-600 transition-colors"
              >
                {submitting ? (
                  "Processing..."
                ) : step === 2 ? (
                  "Confirm Booking"
                ) : (
                  <>
                    Continue <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
