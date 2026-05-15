import {
  FiArrowLeft,
  FiCheck,
  FiX,
  FiShoppingBag,
  FiPrinter,
  FiDownload,
} from "react-icons/fi";

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

function buildBookingHtml(b, items, autoPrint = false) {
  const total = Number(b.total_amount).toLocaleString("en-NG");
  const rows = items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td class="text-right">${item.quantity}</td>
        <td class="text-right">₦${Number(item.price).toLocaleString("en-NG")}</td>
        <td class="text-right">₦${Number(item.subtotal || item.price * item.quantity).toLocaleString("en-NG")}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Booking #${b.booking_code}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', Arial, sans-serif; padding: 20px; background: white; }
    .receipt { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 24px; }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 12px; }
    .header h1 { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
    .header p { font-size: 12px; color: #666; }
    .section { margin-bottom: 18px; font-size: 13px; }
    .section-title { font-weight: bold; text-transform: uppercase; margin-bottom: 8px; font-size: 11px; letter-spacing: 0.05em; color: #444; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
    thead { background: #f5f5f5; }
    th { padding: 8px 5px; text-align: left; border-bottom: 2px solid #333; font-weight: bold; }
    td { padding: 8px 5px; border-bottom: 1px solid #ddd; }
    .text-right { text-align: right; }
    .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 15px; border-top: 2px solid #333; padding-top: 10px; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; background: #f0f0f0; text-transform: capitalize; }
    .footer { text-align: center; font-size: 11px; color: #666; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; }
    .no-print { text-align: center; margin-top: 20px; }
    @media print { .no-print { display: none; } .receipt { border: none; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Booking Receipt</h1>
      <p>Booking #${b.booking_code}</p>
      <p>${new Date().toLocaleString()}</p>
    </div>

    <div class="section">
      <div class="section-title">Booking Details</div>
      <div class="row"><span>Status:</span><span class="badge">${b.status}</span></div>
      <div class="row"><span>Service Type:</span><span style="text-transform:capitalize">${b.service_type}</span></div>
      ${b.preferred_date ? `<div class="row"><span>Preferred Date:</span><span>${b.preferred_date}</span></div>` : ""}
      ${b.pickup_address ? `<div class="row"><span>Pickup Address:</span><span>${b.pickup_address}</span></div>` : ""}
      <div class="row"><span>Created:</span><span>${new Date(b.created_at).toLocaleString()}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Customer Information</div>
      <div class="row"><span>Name:</span><span>${b.customer_name}</span></div>
      <div class="row"><span>Phone:</span><span>${b.customer_phone || "N/A"}</span></div>
      ${b.customer_email ? `<div class="row"><span>Email:</span><span>${b.customer_email}</span></div>` : ""}
    </div>

    ${
      items.length > 0
        ? `<div class="section">
      <div class="section-title">Services Booked</div>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Price</th>
            <th class="text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="total-row">
        <span>TOTAL:</span>
        <span>₦${total}</span>
      </div>
    </div>`
        : ""
    }

    ${b.notes ? `<div class="section"><div class="section-title">Notes</div><p>${b.notes}</p></div>` : ""}

    <div class="footer">
      <p>Thank you for your booking!</p>
    </div>
  </div>
  <div class="no-print">
    <button onclick="window.print()" style="padding:10px 20px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;margin-right:10px;">Print / Save as PDF</button>
    <button onclick="window.close()" style="padding:10px 20px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">Close</button>
  </div>
  ${autoPrint ? "<script>window.onload = () => window.print();<\/script>" : ""}
</body>
</html>`;
}

function openBookingWindow(html) {
  const win = window.open("", "", "height=700,width=850");
  win.document.write(html);
  win.document.close();
}

export default function BookingDetail({
  booking: b,
  onBack,
  onConfirm,
  onCancel,
  onConvert,
}) {
  const items = Array.isArray(b.items) ? b.items : [];

  const handlePrint = () => {
    openBookingWindow(buildBookingHtml(b, items, true));
  };

  const handleDownloadPdf = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    // Build a self-contained HTML string with inline styles so html2pdf renders it correctly
    const htmlString = buildBookingHtml(b, items, false);
    const container = document.createElement("div");
    container.innerHTML = htmlString;
    // html2pdf needs a real DOM node; we use the .receipt div inside the generated HTML
    const receiptEl = container.querySelector(".receipt") || container;
    document.body.appendChild(container);
    container.style.cssText =
      "position:fixed;left:-9999px;top:0;width:600px;background:white";
    await html2pdf()
      .set({
        margin: 10,
        filename: `booking-${b.booking_code}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(receiptEl)
      .save();
    document.body.removeChild(container);
  };

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
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print booking"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-xs font-medium transition-colors"
            >
              <FiPrinter className="text-sm" /> Print
            </button>
            <button
              onClick={handleDownloadPdf}
              title="Download as PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-xs font-medium transition-colors"
            >
              <FiDownload className="text-sm" /> PDF
            </button>
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
