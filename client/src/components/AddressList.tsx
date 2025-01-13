"use client"

import { RootState } from "@/app/redux/store";
import { Address } from "@/types/address";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Trash2 } from 'lucide-react';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tooltip } from "@mui/material";

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
            <h2 className="flex items-center">
                <span className="font-bold text-xl">Saved Addresses</span>
                <button
                    className="bg-custom-teal dark:bg-custom-light-teal rounded-full px-2 flex items-center justify-center"
                    onClick={toggleExpand}
                    style={{ marginLeft: "10px" }}
                >
                    {isExpanded ? (
                        <ExpandLessIcon style={{ fontSize: "16px" }} />
                    ) : (
                        <ExpandMoreIcon style={{ fontSize: "16px" }} />
                    )}
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
                                            <Tooltip title="Delete address" arrow>
                                            <button
                                                className="text-red-500 hover:text-red-600 rounded-full px-3 py-2 flex items-center justify-center"
                                                onClick={() => deleteAddress(index)}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                <Trash2 />
                                            </button>
                                            </Tooltip>
                                            
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
                        <h3 className="font-bold text-lg mb-4">Add New Address</h3>
                        <div>
                            <label className="font-semibold">
                                Name:
                                <input
                                    className="ml-8 rounded px-2 w-[24rem] h-8"
                                    type="text"
                                    name="name"
                                    value={newAddress.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter address name"
                                    required
                                />

                            </label>
                        </div>
                        <br></br>
                        <div>
                            <label className="font-semibold">
                                Address:
                                <input className="ml-4 rounded px-2 w-[36rem] h-8"
                                    type="text"
                                    name="address"
                                    value={newAddress.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter address details"
                                    required
                                />
                            </label>
                        </div>
                        <br></br>
                        <button className="bg-custom-pink rounded-full px-4 py-1 hover:bg-custom-lavender transition duration-300 text-white font-bold" type="submit">Add Address</button>
                    </form>
                </>
            )}
        </div>
    );
}