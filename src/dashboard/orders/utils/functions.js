// export const exportAsCsv = (filteredItems) => {
//   const items = filteredItems.map((item) => ({
//     "Tracking Number": item.tracking_number,
//     Carrier: item.carrier_code,
//     Service: item.service_code,
//     Status: item.tracking_status,
//     Origin: `${item?.ship_from?.city_locality} ${item?.ship_from?.state_province},{" "}
//         ${item?.ship_from?.country_code}`,
//     Destination: `${item?.ship_to?.city_locality} ${item?.ship_to?.state_province},{" "}
//         ${item?.ship_to?.country_code}`,
//     "Shipment Date": item.ship_date
//       ? format(new Date(item.ship_date), "dd MMM, yyyy")
//       : "N/A",
//     // "Delivery Date": format(new Date(item.delivery_date), "dd MMM, yyyy"),
//   }));

//   const replacer = (key, value) => (value === null ? "" : value);
//   const header = Object.keys(items[0]);
//   let csv = items.map((row) =>
//     header
//       .map((fieldName) => JSON.stringify(row[fieldName], replacer))
//       .join(",")
//   );
//   csv.unshift(header.join(","));
//   csv = csv.join("\r\n");

//   const blob = new Blob([csv], { type: "text/csv" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.setAttribute("hidden", "");
//   a.setAttribute("href", url);
//   a.setAttribute("download", "shipments.csv");
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// };

export const filterByDate = (items, state) => {
  if (!state[0].startDate || !state[0].endDate) {
    return items;
  }
  return items.filter((item) => {
    const shipmentDate = new Date(item.shipment_date);
    const startDate = state[0].startDate || new Date(0);
    const endDate = state[0].endDate || new Date();

    return shipmentDate >= startDate && shipmentDate <= endDate;
  });
};

export const filterByStatus = (items, statusFilter) => {
  if (statusFilter === "All") {
    return items;
  }
  return items.filter(
    (item) =>
      item?.tracking_status?.toLowerCase() === statusFilter.toLowerCase(),
  );
};

// export const searchItems = (items, search) => {
//   return items.filter(
//     (item) =>
//       item?.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
//       item?.carrier_code?.toLowerCase().includes(search.toLowerCase())
//   );
// };

export const searchItems = (items, search) => {
  return items.filter((item) => {
    const matchesSearch = search
      ? item?.name?.toLowerCase().includes(search.toLowerCase())
      : item;

    // const itemDate = new Date(item.created_at);
    // const startDate = dates[0].startDate;
    // const endDate = dates[0].endDate;

    // // Create new date objects to avoid mutation
    // const start = startDate
    //   ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
    //   : null;
    // const end = endDate
    //   ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
    //   : null;

    // const matchesDateRange =
    //   (!start || itemDate >= start) && (!end || itemDate <= end);

    return matchesSearch;
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateSubtotal = ({ quantity, weight, price }) => {
  const base = quantity || weight || 1;
  return (Number(base) || 0) * (Number(price) || 0);
};

const calculateTotal = (items) =>
  items.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);

const getInitialForm = (item = null) => ({
  customer: item?.customer
    ? {
        ...item.customer,
        name: `${item.customer.first_name} ${item.customer.last_name ?? ""}`,
      }
    : null,
  total_amount: item?.total_amount || 0,
  order_date: item?.order_date || new Date().toISOString().split("T")[0],
  due_date: item?.due_date || new Date().toISOString().split("T")[0],
  status: item?.status
    ? { name: item.status.charAt(0).toUpperCase() + item.status.slice(1) }
    : { name: "Pending" },
  items:
    item?.items?.map((i) => ({
      id: i.id || "",
      service_item: i.service_item || "",
      quantity: i.quantity || "",
      weight: i.weight || "",
      price: i.price || "",
      subtotal: i.subtotal || 0,
    })) || [],
});

export { formatDate, calculateSubtotal, calculateTotal, getInitialForm };