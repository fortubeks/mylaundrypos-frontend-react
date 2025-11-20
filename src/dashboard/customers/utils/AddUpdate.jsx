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
  const [state, setState] = useState(item?.state_id || "");
  const [country, setCountry] = useState(item?.country_id || "");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await RequestService.get("/customers/countries");
        console.log(response);
        setCountries(response.data.data);
        if (item) {
          const countryItem = response.data.data.find(
            (c) => c.id === item.country_id
          );
          setCountry(countryItem);
          const responseStates = await RequestService.get(
            "/customers/states/" + countryItem.id
          );

          const states = responseStates.data.data;
          const stateItem = states.find((s) => s.id === item.state_id);
          setState(stateItem);
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

  const submit = async (e) => {
    e.preventDefault();
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
    <main className="w-full h-full grow flex flex-col bg-white shadow">
      <div className="flex flex-col gap-1 py-2 px-3">
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
          />
          <Input
            placeholder="Last Name"
            type="text"
            selected={lastName}
            setSelected={setLastName}
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
          />
          <Input
            placeholder="Phone"
            type="text"
            selected={phone}
            setSelected={setPhone}
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
          />
        </div>
        <div className="flex flex-col md:grid grid-cols-2 gap-5">
          <SelectDropDownImage
            items={countries}
            selected={country}
            setSelected={setCountry}
            placeholder="Select Country"
          />
          <SelectDropDownImage
            items={states}
            selected={state}
            setSelected={setState}
            placeholder="Select State"
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
