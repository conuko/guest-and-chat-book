import { trpc } from "../utils/trpc";
import { useState } from "react";

const Address = () => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const utils = trpc.useContext();

  const addUserAddress = trpc.user.addUserAddress.useMutation({
    // refetch messages after a message is added
    async onSuccess() {
      await utils.user.getUserAddress.invalidate();
    },
  });

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        addUserAddress.mutate({
          street,
          city,
          zip,
          country,
          phone,
        });
        setStreet("");
        setCity("");
        setZip("");
        setCountry("");
        setPhone("");
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            value={street}
            placeholder="Street"
            minLength={2}
            maxLength={100}
            onChange={(event) => setStreet(event.target.value)}
            className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="city">City</label>
          <input
            type="text"
            value={city}
            placeholder="City"
            minLength={2}
            maxLength={100}
            onChange={(event) => setCity(event.target.value)}
            className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="zip">Zip</label>
          <input
            type="text"
            value={zip}
            placeholder="Zip"
            minLength={2}
            maxLength={100}
            onChange={(event) => setZip(event.target.value)}
            className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            value={country}
            placeholder="Country"
            minLength={2}
            maxLength={100}
            onChange={(event) => setCountry(event.target.value)}
            className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            value={phone}
            placeholder="Phone"
            minLength={2}
            maxLength={100}
            onChange={(event) => setPhone(event.target.value)}
            className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 opacity-50 focus:opacity-100 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
          disabled={
            street.length < 2 ||
            city.length < 2 ||
            zip.length < 2 ||
            country.length < 2 ||
            phone.length < 2 ||
            addUserAddress.isLoading
          }
        >
          Submit Address
        </button>
      </div>
    </form>
  );
};

export default Address;
