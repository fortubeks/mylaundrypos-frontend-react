import { FiArrowLeft, FiCheck, FiX, FiShoppingBag } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function BookingDetail({
  booking: b,
  onBack,
  onConfirm,
  onCancel,
  onConvert,
}) {
  const items = Array.isArray(b.items) ? b.items : [];

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <div className="p-5 w-full flex flex-col gap-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary text-gray-600 hover:text-primary transition-colors"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">
              Booking #{b.booking_code}
            </h1>
            <p className="text-xs text-gray-500">
              {new Date(b.created_at).toLocaleString()}
            </p>
          </div>
          <div className="ml-auto">
            <span
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold capitalize ${
                STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {b.status}
            </span>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-700 text-sm mb-3">Customer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <InfoRow label="Name" value={b.customer_name} />
            <InfoRow label="Phone" value={b.customer_phone} />
            {b.customer_email && (
              <InfoRow label="Email" value={b.customer_email} />
            )}
            <InfoRow
              label="Service Type"
              value={
                <span className="capitalize bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {b.service_type}
                </span>
              }
            />
            {b.pickup_address && (
              <InfoRow label="Pickup Address" value={b.pickup_address} />
            )}
            {b.preferred_date && (
              <InfoRow label="Preferred Date" value={b.preferred_date} />
            )}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-bold text-gray-700 text-sm mb-3">
            Services Booked
          </h2>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.quantity} × ₦{Number(item.price).toLocaleString()}
                  </p>
                </div>
                <span className="font-bold text-gray-800 text-sm">
                  ₦
                  {Number(
                    item.subtotal || item.price * item.quantity,
                  ).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-bold text-base">
              <span>Total</span>
              <span className="text-primary">
                ₦{Number(b.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {b.notes && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Notes: </span>
            {b.notes}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {b.status === "pending" && (
            <>
              <button
                onClick={() => onConfirm(b.id)}
                className="flex-1 bg-primary text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                <FiCheck /> Confirm Payment Received
              </button>
              <button
                onClick={() => onCancel(b.id)}
                className="flex-1 border border-red-200 text-red-600 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
              >
                <FiX /> Cancel Booking
              </button>
            </>
          )}

          {b.status === "confirmed" && !b.order_id && (
            <button
              onClick={() => onConvert(b.id)}
              className="flex-1 bg-secondary text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <FiShoppingBag /> Convert to Order
            </button>
          )}

          {b.order_id && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 text-center">
              ✅ Converted to Order #{b.order_id}
            </div>
          )}

          {b.status === "confirmed" && (
            <button
              onClick={() => onCancel(b.id)}
              className="flex-1 border border-red-200 text-red-600 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
              <FiX /> Cancel Booking
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <span className="text-xs text-gray-400 block">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
