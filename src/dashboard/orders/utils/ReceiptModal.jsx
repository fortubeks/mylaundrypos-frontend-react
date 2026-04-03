import { formatDate } from "./functions";

export default function ReceiptModal({
  order,
  customer,
  businessName = "LAUNDRY POS",
  onClose,
}) {
  const handlePrint = () => {
    const receiptWindow = window.open("", "", "height=600,width=800");
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - Order #${order.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', Arial, sans-serif;
              padding: 20px;
              background: white;
            }
            .receipt {
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .header p {
              font-size: 12px;
              color: #666;
            }
            .order-info {
              margin-bottom: 20px;
              font-size: 13px;
            }
            .order-info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .order-info-label {
              font-weight: bold;
            }
            .customer-info {
              margin-bottom: 20px;
              font-size: 13px;
            }
            .customer-info-label {
              font-weight: bold;
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            table thead {
              background-color: #f5f5f5;
            }
            table th {
              padding: 8px 5px;
              text-align: left;
              border-bottom: 2px solid #333;
              font-weight: bold;
            }
            table td {
              padding: 8px 5px;
              border-bottom: 1px solid #ddd;
            }
            .text-right {
              text-align: right;
            }
            .summary {
              margin-bottom: 20px;
              font-size: 13px;
              border-top: 2px solid #333;
              border-bottom: 2px solid #333;
              padding: 10px 0;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .summary-row.total {
              font-weight: bold;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              color: #666;
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt {
                border: none;
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>${businessName}</h1>
              <p>${new Date().toLocaleString()}</p>
            </div>

            <div class="order-info">
              <div class="order-info-row">
                <span class="order-info-label">Order ID:</span>
                <span>#${order.id}</span>
              </div>
              <div class="order-info-row">
                <span class="order-info-label">Order Date:</span>
                <span>${formatDate(order.order_date)}</span>
              </div>
              <div class="order-info-row">
                <span class="order-info-label">Due Date:</span>
                <span>${formatDate(order.due_date)}</span>
              </div>
              <div class="order-info-row">
                <span class="order-info-label">Status:</span>
                <span style="text-transform: capitalize;">${order.status}</span>
              </div>
            </div>

            <div class="customer-info">
              <div class="customer-info-label">CUSTOMER INFORMATION</div>
              <div style="margin-bottom: 8px;">
                <strong>${customer.first_name} ${customer.last_name || ""}</strong>
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Phone:</strong> ${customer.phone || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> ${customer.email || "N/A"}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Service Item</th>
                  <th class="text-right">Qty/Wgt</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.service_item?.name || "N/A"}</td>
                    <td class="text-right">${
                      item.service_item?.unit_type === "per_item"
                        ? item.quantity
                        : item.weight + " kg"
                    }</td>
                    <td class="text-right">₦${item.price.toLocaleString("en-NG")}</td>
                    <td class="text-right">₦${item.subtotal.toLocaleString("en-NG")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₦${(order.total_amount || 0).toLocaleString("en-NG")}</span>
              </div>
              <div class="summary-row total">
                <span>TOTAL AMOUNT:</span>
                <span>₦${(order.total_amount || 0).toLocaleString("en-NG")}</span>
              </div>
            </div>

            ${
              order.payments && order.payments.length > 0
                ? `
              <div style="margin-bottom: 20px; font-size: 12px;">
                <div style="font-weight: bold; margin-bottom: 8px;">PAYMENT SUMMARY</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span>Total Paid:</span>
                  <span>₦${order.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString("en-NG")}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Outstanding:</span>
                  <span>₦${Math.max(0, order.total_amount - order.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)).toLocaleString("en-NG")}</span>
                </div>
              </div>
            `
                : ""
            }

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>For inquiries, please contact us</p>
            </div>
          </div>

          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 10px;">
              Print Receipt
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
              Close
            </button>
          </div>
        </body>
      </html>
    `;
    receiptWindow.document.write(html);
    receiptWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Receipt Content */}
        <div className="p-6 border-b border-gray-200 light">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{businessName}</h2>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p>
                <strong>Order ID:</strong> #{order.id}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(order.order_date)}
              </p>
            </div>
            <div className="text-right">
              <p>
                <strong>Due Date:</strong> {formatDate(order.due_date)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-bold text-sm mb-2">CUSTOMER INFORMATION</h3>
            <p className="text-sm">
              <strong>
                {customer.first_name} {customer.last_name || ""}
              </strong>
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {customer.phone || "N/A"}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {customer.email || "N/A"}
            </p>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="text-left py-2">Service Item</th>
                  <th className="text-center py-2">Qty/Wgt</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2">{item.service_item?.name || "N/A"}</td>
                    <td className="text-center py-2">
                      {item.service_item?.unit_type === "per_item"
                        ? item.quantity
                        : `${item.weight} kg`}
                    </td>
                    <td className="text-right py-2">
                      ₦{item.price.toLocaleString("en-NG")}
                    </td>
                    <td className="text-right py-2 font-semibold">
                      ₦{item.subtotal.toLocaleString("en-NG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal:</span>
              <span>₦{(order.total_amount || 0).toLocaleString("en-NG")}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL AMOUNT:</span>
              <span>₦{(order.total_amount || 0).toLocaleString("en-NG")}</span>
            </div>
          </div>

          {/* Payments Info */}
          {order.payments && order.payments.length > 0 && (
            <div className="mb-6 text-sm">
              <h3 className="font-bold mb-2">PAYMENT SUMMARY</h3>
              <div className="flex justify-between mb-2">
                <span>Total Paid:</span>
                <span>
                  ₦
                  {order.payments
                    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                    .toLocaleString("en-NG")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Outstanding:</span>
                <span>
                  ₦
                  {Math.max(
                    0,
                    order.total_amount -
                      order.payments.reduce(
                        (sum, p) => sum + parseFloat(p.amount),
                        0,
                      ),
                  ).toLocaleString("en-NG")}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 border-t border-gray-200 pt-4">
            <p>Thank you for your business!</p>
            <p>For inquiries, please contact us</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
