// "use client";

// import { useState } from "react";
// import apiClient from "@/utils/axiosInstance";

// interface RegisterFormProps {
//   onSuccess?: (data: any) => void; // Callback after successful registration
// }

// export default function RegisterForm() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError(""); // Reset previous error
//     try {
//       const response = await apiClient.post("/auth/register", {
//         username,
//         email,
//         password,
//       });
//       console.log("Registration successful:", response.data);

//       // if (onSuccess) onSuccess(response.data);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Registration failed. Please try again.");
//       console.error("Registration error:", err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//       <div>
//         <label htmlFor="username" className="block mb-1">
//           Username
//         </label>
//         <input
//           id="username"
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Enter username"
//           className="w-full border px-3 py-2 rounded-md"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="email" className="block mb-1">
//           Email
//         </label>
//         <input
//           id="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter email"
//           className="w-full border px-3 py-2 rounded-md"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="password" className="block mb-1">
//           Password
//         </label>
//         <input
//           id="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Enter password"
//           className="w-full border px-3 py-2 rounded-md"
//           required
//         />
//       </div>
//       <button
//         type="submit"
//         className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//       >
//         Register
//       </button>
//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import apiClient from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/redux/features/userSlice";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<string[]>([""]); // Array for multiple addresses
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Reset previous error
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        phone,
        addresses,
      });

      console.log("Registration successful:", response.data);
      const { token, user } = response.data;
      dispatch(setUser({ userEmail: user?.email, token: token }));
      alert("Registration successful!");
      router.push("/"); // Redirect to home page
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  const handleAddressChange = (index: number, value: string) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = value;
    setAddresses(updatedAddresses);
  };

  const addAddressField = () => {
    setAddresses([...addresses, ""]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block mb-1">
          Phone
        </label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1">Addresses</label>
        {addresses.map((address, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              placeholder={`Address ${index + 1}`}
              className="w-full border px-3 py-2 rounded-md"
            />
            {index === addresses.length - 1 && (
              <button
                type="button"
                onClick={addAddressField}
                className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Register
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
