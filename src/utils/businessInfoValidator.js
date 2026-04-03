/**
 * Check if business information is complete
 * @param {Object} settings - The user settings object
 * @returns {boolean} - True if business info is complete
 */
export const isBusinessInfoComplete = (settings) => {
  if (!settings || !settings.setting) {
    return false;
  }

  const requiredFields = [
    "business_name",
    "business_phone",
    "business_address",
    "business_currency",
  ];

  return requiredFields.every(
    (field) => settings.setting[field] && settings.setting[field].trim() !== "",
  );
};

/**
 * Get missing required fields
 * @param {Object} settings - The user settings object
 * @returns {Array} - Array of missing field names
 */
export const getMissingFields = (settings) => {
  if (!settings || !settings.setting) {
    return [
      "business_name",
      "business_phone",
      "business_address",
      "business_currency",
    ];
  }

  const requiredFields = [
    "business_name",
    "business_phone",
    "business_address",
    "business_currency",
  ];

  return requiredFields.filter(
    (field) =>
      !settings.setting[field] || settings.setting[field].trim() === "",
  );
};
