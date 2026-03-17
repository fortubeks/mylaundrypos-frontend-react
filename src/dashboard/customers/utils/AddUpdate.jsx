import { useEffect, useState } from "react";
import cancel from "../../../assets/icons/close.svg";
import { Button } from "../../../utils/Button";
import { Input } from "../../../utils/Input";
import toast from "../../../utils/Toast";
import { SelectDropDownImage } from "../../../utils/SelectDropdownImage";
import DropDown from "../../../utils/SelectDropdown";
import { cleanUpErr, RequestService } from "../../../services";

export default function AddUpdate({ setShowCreate, item, fetch }) {
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
          (c) => c.name.toLowerCase() === "nigeria"
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
          "/customers/states/" + country.id
        );
        console.log(response);
        setStates(response.data.data);
      } catch (error) {
        console.log(error);
        toast("Error fetching states", "error");
      }
    };
    fetchStates();
  }, [country]);

  const [errors, setErrors] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const fields = {
      title: "Title",
      firstName: "First Name",
      // lastName: "Last Name",
      // email: "Email",
      phone: "Phone",
      // address: "Address",
      state: "State",
      country: "Country",
    };
    const errors = {};
    Object.entries(fields).forEach(([key, label]) => {
      if (
        !eval(key) ||
        (typeof eval(key) === "string" && eval(key).trim() === "")
      ) {
        errors[key] = `${label} is required`;
      }
    });

    setShowErrors(false);
    setErrors(errors);
    setIsFormComplete(Object.keys(errors).length === 0);
  }, [title, firstName, lastName, email, phone, address, state, country]);

  const submit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) {
      setShowErrors(true);
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
      // phone_code: phoneCode,
      phone,
      other_phone: otherPhone,
      address,
      state_id: state?.id || null,
      country_id: country?.id || null,
    };
    try {
      let response;
      if (item) {
        response = await RequestService.put(`/customers/${item.id}`, payload);
      } else {
        response = await RequestService.post("/customers", payload);
      }
      console.log(response);
      fetch();
      toast.success(`Customer ${item ? "updated" : "added"} successfully`);
      setShowCreate(false);
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-full grow flex flex-col bg-white shadow overflow-y-auto">
      <div className="flex flex-col gap-1 py-2 px-3 sticky top-0 z-10 bg-white border-b">
        <h4 className="flex items-center relative font-extrabold text-xl gap-2 border-b pb-1">
          {item ? "Update Customer" : "Add Customer"}
          <img
            src={cancel}
            alt=""
            className="absolute right-1 cursor-pointer"
            onClick={() => setShowCreate(false)}
          />
        </h4>
        <p className="text-sm text-muted-foreground">
          {item
            ? "Update the details of this customer"
            : "Fill the form to add a new customer"}
        </p>
      </div>
      <form className="flex flex-col w-full gap-5 grow px-3 mt-5">
        <div className="flex flex-col md:grid grid-cols-2 gap-5">
          <DropDown
            items={["Mr", "Mrs", "Miss", "Ms"]}
            selected={title}
            setSelected={setTitle}
            placeholder="Select Title"
          />
          <Input
            placeholder="First Name"
            type="text"
            selected={firstName}
            setSelected={setFirstName}
            error={errors.firstName}
            showErrors={showErrors}
          />
          <Input
            placeholder="Last Name"
            type="text"
            selected={lastName}
            setSelected={setLastName}
            error={errors.lastName}
            showErrors={showErrors}
          />
          <Input
            placeholder="Other Names"
            type="text"
            selected={otherNames}
            setSelected={setOtherNames}
          />
          <Input
            placeholder="Email"
            type="email"
            selected={email}
            setSelected={setEmail}
            error={errors.email}
            showErrors={showErrors}
          />
          <Input
            placeholder="Phone"
            type="text"
            selected={phone}
            setSelected={setPhone}
            error={errors.phone}
            showErrors={showErrors}
          />
          <Input
            placeholder="Other Phone"
            type="text"
            selected={otherPhone}
            setSelected={setOtherPhone}
          />
          <Input
            placeholder="Address"
            type="text"
            selected={address}
            setSelected={setAddress}
            error={errors.address}
            showErrors={showErrors}
          />
        </div>
        <div className="flex flex-col md:grid grid-cols-2 gap-5">
          <SelectDropDownImage
            items={countries}
            selected={country}
            setSelected={setCountry}
            placeholder="Select Country"
            error={errors.country}
            showErrors={showErrors}
          />
          <SelectDropDownImage
            items={states}
            selected={state}
            setSelected={setState}
            placeholder="Select State"
            error={errors.state}
            showErrors={showErrors}
          />
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center mt-auto mb-4">
          <Button
            name={item ? "Update Customer" : "Add Customer"}
            width="100%"
            onClick={submit}
            loading={loading}
          />
        </div>
      </form>
    </main>
  );
}
