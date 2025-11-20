import { GetCity } from "react-country-state-city";
import { dataStates } from "../utils/dataStates";
import { dataCountries } from "../utils/dataCountries";
// import { dataCities } from "../utils/dataCities";

export function getStates(countryId) {
  const country = dataStates.find((c) => c.id === countryId);
  return country ? country.states : [];
}

export async function getCities(countryId, stateId) {
  const result = await GetCity(parseInt(countryId), parseInt(stateId));
  return result || [];
}

export function getCountryByIso2(iso2) {
  return dataCountries.find((c) => c.iso2 === iso2) || null;
}

export function getStateByCode(countryId, stateCode) {
  const countryStates = dataStates.find((c) => c.id === countryId);
  if (!countryStates) return null;

  return countryStates.states.find((s) => s.state_code === stateCode) || null;
}

export async function getCityByName(countryId, stateId, cityName) {
  const cities = await getCities(countryId, stateId);
  return (
    cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase()) ||
    null
  );
}

export async function getPhoneCodeByExt(phoneExt) {
  const country = dataCountries.find((c) => `+${c.phone_code}` === phoneExt);
  return country || null;
}
