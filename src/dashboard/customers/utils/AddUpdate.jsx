import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../utils/Button";
import toast from "../../../utils/Toast";
import { SelectDropDownImage } from "../../../utils/SelectDropdownImage";
import { cleanUpErr, RequestService } from "../../../services";
import { FiX, FiUser, FiPhone, FiMapPin, FiChevronDown } from "react-icons/fi";

/** Clean text input — no floating label, visible focus border */
const FormInput = ({ type = "text", placeholder, value, onChange, onBlur }) => (
  <input
    type={type}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    placeholder={placeholder}
    className="w-full h-10 rounded-xl bg-[#F6F6F6] border border-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
  />
);

/** Styled native <select> — consistent with FormInput */
const FormSelect = ({ value, onChange, options, placeholder }) => (
  <div className="relative w-full">
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-10 rounded-xl bg-[#F6F6F6] border border-transparent px-4 pr-9 text-sm appearance-none focus:outline-none focus:border-blue-400 focus:bg-white transition-all cursor-pointer ${
        value ? "text-gray-800" : "text-gray-400"
      }`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
  </div>
);

/** Section with icon, title, horizontal rule, and 2-col grid children */
const Section = ({ icon: Icon, title, children }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <Icon className="text-primary text-sm" />
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
    <div className="flex flex-col md:grid grid-cols-2 gap-4">{children}</div>
  </div>
);

/** Field wrapper with label, required asterisk, and inline error on touch */
const Field = ({ label, required, error, touched, fullWidth, children }) => (
  <div className={`flex flex-col gap-1${fullWidth ? " col-span-2" : ""}`}>
    <span className="text-xs font-medium text-gray-600">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </span>
    {children}
    {touched && error && (
      <span className="text-xs text-red-500 mt-0.5">{error}</span>
    )}
  </div>
);

/**
 * Format a phone number on blur.
 * Accepts 11-digit local (08012345678) → "0801 234 5678"
 * Accepts 14-char international (+2348012345678) → "+234 801 234 5678"
 * Accepts 13-digit without + (2348012345678) → "+234 801 234 5678"
 */
function formatPhone(raw) {
  const stripped = raw.replace(/[\s\-()]/g, "");
  // International with +
  if (/^\+234\d{10}$/.test(stripped)) {
    const d = stripped.slice(4);
    return `+234 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  // International without +
  if (/^234\d{10}$/.test(stripped)) {
    const d = stripped.slice(3);
    return `+234 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  // Local 11-digit
  if (/^0\d{10}$/.test(stripped)) {
    return `${stripped.slice(0, 4)} ${stripped.slice(4, 7)} ${stripped.slice(7)}`;
  }
  return raw; // unchanged if format not recognised
}

const REQUIRED_KEYS = ["title", "firstName", "phone", "country", "state"];

function validate({ title, firstName, phone, country, state }) {
  const errs = {};
  if (!title) errs.title = "Title is required";
  if (!firstName?.trim()) errs.firstName = "First name is required";
  if (!phone?.trim()) {
    errs.phone = "Phone number is required";
  } else {
    const stripped = phone.replace(/[\s\-()]/g, "");
    const valid = /^0\d{10}$/.test(stripped) || /^\+?234\d{10}$/.test(stripped);
    if (!valid)
      errs.phone =
        "Enter an 11-digit local (080…) or +234 international number";
  }
  if (!country) errs.country = "Country is required";
  if (!state) errs.state = "State is required";
  return errs;
}

export default function AddUpdate({ setShowCreate, item, fetch }) {
  const user = useSelector((state) => state.user.user);
  const laundry = user?.laundry;

  const [title, setTitle] = useState(item?.title || "");
  const [firstName, setFirstName] = useState(item?.first_name || "");
  const [lastName, setLastName] = useState(item?.last_name || "");
  const [otherNames, setOtherNames] = useState(item?.other_names || "");
  const [email, setEmail] = useState(item?.email || "");
  // const [phoneCode, setPhoneCode] = useState(item?.phone_code || "");
  const [phone, setPhone] = useState(item?.phone || "");
  const [otherPhone, setOtherPhone] = useState(item?.other_phone || "");
  const [address, setAddress] = useState(item?.address || "");
  const [state, setState] = useState(item?.state || "");
  const [country, setCountry] = useState(item?.country || "");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await RequestService.get("/customers/countries");
        console.log(response);
        setCountries(response.data.data);
        const nigeria = response.data.data.find(
          (c) => c.name.toLowerCase() === "nigeria",
        );
        if (nigeria) {
          setCountry(nigeria);
        }
      } catch (error) {
        console.log(error);
        toast("Error fetching countries", "error");
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!country) return;
    const fetchStates = async () => {
      try {
        const response = await RequestService.get(
          "/customers/states/" + country.id,
        );
        console.log(response);
        const loadedStates = response.data.data;
        setStates(loadedStates);
        // For new customers (not editing), default to the laundry's state
        if (!item && !state && laundry?.state_id) {
          const defaultState = loadedStates.find(
            (s) => s.id === laundry.state_id,
          );
          if (defaultState) setState(defaultState);
        }
      } catch (error) {
        console.log(error);
        toast("Error fetching states", "error");
      }
    };
    fetchStates();
  }, [country]); // eslint-disable-line react-hooks/exhaustive-deps

  // Per-field touched tracking for inline validation
  const [touched, setTouched] = useState({});
  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  // Format phone on blur and mark touched
  const handlePhoneBlur = () => {
    touch("phone");
    if (phone) setPhone(formatPhone(phone));
  };

  const errors = validate({ title, firstName, phone, country, state });
  const isFormComplete = Object.keys(errors).length === 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) {
      setTouched(Object.fromEntries(REQUIRED_KEYS.map((k) => [k, true])));
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    const payload = {
      title,
      first_name: firstName,
      last_name: lastName,
      other_names: otherNames,
      email,
      phone,
      other_phone: otherPhone,
      address,
      state_id: state?.id || null,
      country_id: country?.id || null,
    };
    try {
      if (item) {
        await RequestService.put(`/customers/${item.id}`, payload);
      } else {
        await RequestService.post("/customers", payload);
      }
      fetch();
      toast.success(`Customer ${item ? "updated" : "created"} successfully`);
      setShowCreate(false);
    } catch (error) {
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-full grow flex flex-col bg-white shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <div>
          <h4 className="font-bold text-lg text-gray-800">
            {item ? "Update Customer" : "New Customer"}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {item
              ? "Edit the customer's details below"
              : "Fill in the details to add a new customer"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(false)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FiX className="text-lg" />
        </button>
      </div>

      {/* Required legend */}
      <p className="text-xs text-gray-400 px-4 pt-3 pb-0">
        Fields marked <span className="text-red-500 font-semibold">*</span> are
        required
      </p>

      {/* Scrollable form body */}
      <form
        className="flex flex-col gap-6 px-4 py-4 overflow-y-auto flex-1"
        onSubmit={submit}
      >
        {/* Personal Information */}
        <Section icon={FiUser} title="Personal Information">
          <Field
            label="Title"
            required
            error={errors.title}
            touched={touched.title}
          >
            <FormSelect
              value={title}
              onChange={(v) => {
                setTitle(v);
                touch("title");
              }}
              options={["Mr", "Mrs", "Miss", "Ms"]}
              placeholder="Select title"
            />
          </Field>

          <Field
            label="First Name"
            required
            error={errors.firstName}
            touched={touched.firstName}
          >
            <FormInput
              placeholder="First name"
              value={firstName}
              onChange={(v) => {
                setFirstName(v);
                touch("firstName");
              }}
            />
          </Field>

          <Field label="Last Name">
            <FormInput
              placeholder="Last name"
              value={lastName}
              onChange={setLastName}
            />
          </Field>

          <Field label="Other Names">
            <FormInput
              placeholder="Middle / other names"
              value={otherNames}
              onChange={setOtherNames}
            />
          </Field>
        </Section>

        {/* Contact Details */}
        <Section icon={FiPhone} title="Contact Details">
          <Field
            label="Phone Number"
            required
            error={errors.phone}
            touched={touched.phone}
          >
            <FormInput
              type="tel"
              placeholder="e.g. 08012345678 or +2348012345678"
              value={phone}
              onChange={(v) => {
                setPhone(v);
                touch("phone");
              }}
              onBlur={handlePhoneBlur}
            />
          </Field>

          <Field label="Alternate Phone">
            <FormInput
              type="tel"
              placeholder="e.g. 07098765432"
              value={otherPhone}
              onChange={setOtherPhone}
            />
          </Field>

          <Field label="Email Address" fullWidth>
            <FormInput
              type="email"
              placeholder="e.g. customer@email.com"
              value={email}
              onChange={setEmail}
            />
          </Field>
        </Section>

        {/* Location */}
        <Section icon={FiMapPin} title="Location">
          <Field label="Street Address" fullWidth>
            <FormInput
              placeholder="House no., street, area"
              value={address}
              onChange={setAddress}
            />
          </Field>

          <Field
            label="Country"
            required
            error={errors.country}
            touched={touched.country}
          >
            <SelectDropDownImage
              slide={false}
              items={countries}
              selected={country}
              setSelected={(v) => {
                setCountry(v);
                setState("");
                touch("country");
              }}
              placeholder="Select country"
            />
          </Field>

          <Field
            label="State / Province"
            required
            error={errors.state}
            touched={touched.state}
          >
            <SelectDropDownImage
              slide={false}
              items={states}
              selected={state}
              setSelected={(v) => {
                setState(v);
                touch("state");
              }}
              placeholder={country ? "Select state" : "Select country first"}
              empty="No states found"
            />
          </Field>
        </Section>
      </form>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3">
        <button
          type="button"
          onClick={() => setShowCreate(false)}
          className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="flex-1">
          <Button
            name={item ? "Save Changes" : "Add Customer"}
            width="100%"
            onClick={submit}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
}
