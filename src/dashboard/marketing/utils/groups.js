/* ── Built-in group definitions ─────────────────────────────────────────── */
export const BUILTIN_GROUPS = [
  {
    id: "all",
    name: "All",
    icon: "👥",
    description: "Every eligible customer",
  },
  {
    id: "has_email",
    name: "Has Email",
    icon: "📧",
    description: "Customers with an email address",
  },
  {
    id: "has_phone",
    name: "Has Phone",
    icon: "📱",
    description: "Customers with a phone number",
  },
  {
    id: "has_both",
    name: "Email + Phone",
    icon: "✅",
    description: "Customers with both email and phone",
  },
];

/** Return the subset of `customers` matched by a built-in group id. */
export function applyBuiltinFilter(groupId, customers) {
  switch (groupId) {
    case "all":
      return customers;
    case "has_email":
      return customers.filter((c) => c.email);
    case "has_phone":
      return customers.filter((c) => c.phone);
    case "has_both":
      return customers.filter((c) => c.email && c.phone);
    default:
      return customers;
  }
}
