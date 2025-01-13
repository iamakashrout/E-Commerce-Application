"use client"

import { RootState } from "@/app/redux/store";
import { Address } from "@/types/address";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Trash2 } from 'lucide-react';

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
        <div className="text-left">
            <h2>
                <span className="font-bold text-xl">Saved Addresses</span>
                <button
                    className="bg-custom-lavender rounded-full px-4 py-1"
                    onClick={toggleExpand}
                    style={{ marginLeft: "10px" }}
                >
                    {isExpanded ? "Hide" : "Show"}
                </button>
            </h2>
            <br></br>
            {isExpanded && (
                <>
                    <div>
                        {addresses.length > 0 ? (
                            <div>
                                {addresses.map((add, index) => (
                                    <div key={index} className="flex flex-col mb-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="flex items-center">
                                                <span>{index + 1}.</span>
                                                <span className="font-bold ml-2">{add.name}</span>
                                            </h3>
                                            <button
                                                className="bg-red-500 rounded-full px-2 py-1 flex items-center justify-center"
                                                onClick={() => deleteAddress(index)}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                <Trash2 />
                                            </button>
                                        </div>
                                        <p className="mt-1 ml-6">{add.address}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No saved addresses</p>
                        )}
                    </div>
                    <br></br>
                    <form onSubmit={addAddress}>
                        <h3 className="font-bold text-lg">Add New Address</h3>
                        <div>
                            <label>
                                Name:
                                <input
                                    className="ml-8 rounded-full px-2"
                                    type="text"
                                    name="name"
                                    value={newAddress.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter address name"
                                    required
                                    style={{ width: '200px', height: '40px' }}
                                />

                            </label>
                        </div>
                        <br></br>
                        <div>
                            <label>
                                Address:
                                <input className="ml-4 rounded-full px-2"
                                    type="text"
                                    name="address"
                                    value={newAddress.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter address"
                                    required
                                    style={{ width: '200px', height: '40px' }}
                                />
                            </label>
                        </div>
                        <br></br>
                        <button className="bg-custom-light-pink rounded-full px-4 py-1 ml-16" type="submit">Add Address</button>
                    </form>
                </>
            )}
        </div>
    );
}