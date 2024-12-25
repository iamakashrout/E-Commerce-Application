"use client"

import { RootState } from "@/app/redux/store";
import { Address } from "@/types/address";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AddressList() {
    const user = useSelector((data: RootState) => data.userState.userEmail);
    const token = useSelector((data: RootState) => data.userState.token);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [newAddress, setNewAddress] = useState<Address>({ name: "", address: "" });

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await apiClient.get(`/address/getAddresses/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setAddresses(response.data.data.addresses || []);
                } else {
                    console.error('Failed to fetch addresses:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching addresses:', err);
            }
        };

        fetchAddresses();
    }, []);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const addAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (newAddress.name && newAddress.address) {
                const response = await apiClient.post('/address/addAddress', {
                    user,
                    name: newAddress.name,
                    address: newAddress.address
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setAddresses([...addresses, newAddress]);
                    setNewAddress({ name: "", address: "" });
                    console.log(response.data.data.addresses);
                } else {
                    console.error('Failed to add address:', response.data.error);
                }
            }
        } catch (err: any) {
            console.error('Error adding address:', err);
        }
        
    };

    const deleteAddress = async (index: number) => {
        try {
            const addressName = addresses[index].name;
            const response = await apiClient.post('/address/removeAddress', {
                user,
                name: addressName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.data.success) {
                setAddresses((prev) => prev.filter((_, i) => i !== index));
                console.log(response.data.data.addresses);
            } else {
                console.error('Failed to remove address:', response.data.error);
            }

        } catch (err: any) {
            console.error('Error removing address:', err);
        }
    };
    

    return (
        <div>
            <h2>
                Saved Addresses
                <button onClick={toggleExpand} style={{ marginLeft: "10px" }}>
                    {isExpanded ? "Hide" : "Show"}
                </button>
            </h2>
            {isExpanded && (
                <>
                <div>
                    {addresses.length > 0 ? (
                        <div>
                                {addresses.map((add, index) => (
                                    <div key={index}>
                                        <h3>
                                            {index + 1} {add.name}
                                            <button onClick={() => deleteAddress(index)} style={{ marginLeft: "10px" }}>
                                                Delete
                                            </button>
                                        </h3>
                                        <p>{add.address}</p>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p>No saved addresses</p>
                    )}
                </div>
                <form onSubmit={addAddress}>
                <h3>Add New Address</h3>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={newAddress.name}
                            onChange={handleInputChange}
                            placeholder="Enter address name"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={newAddress.address}
                            onChange={handleInputChange}
                            placeholder="Enter address"
                            required
                        />
                    </label>
                </div>
                <button type="submit">Add Address</button>
            </form>
                </>
            )}
        </div>
    );
}