'use client'

import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import apiClient from "@/utils/axiosInstance";
import AddressList from "@/components/AddressList";
import OrderHistory from "@/components/OrderHistory";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {

    const userEmail = useSelector((data: RootState) => data.userState.userEmail);
    const token = useSelector((data: RootState) => data.userState.token);
    const [user, setUser] = useState<User>({} as User);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get(`/user/getUserDetails/${userEmail}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    const data = response.data.data;
                    const userDetails = {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        loyaltyPoints: data.loyaltyPoints
                    }
                    setUser(userDetails);
                    console.log(userDetails);
                } else {
                    console.error('Failed to fetch user details:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching user details:', err);
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            { user ? (
                <div>
                    <Navbar/>
                    <h1 className="text-5xl font-bold mb-8 mt-8 text-center text-black">Your Profile</h1>
                    <div className="bg-custom-light-teal p-8 rounded-lg shadow-md mb-6 w-full max-w-3xl mx-auto mt-24 flex flex-col items-center">
                    <h1 className="font-bold text-xl">{user.name}</h1>
                    <p className="text-xl"><span className="font-bold">Email:</span> <span>{user.email}</span></p>
                    <p className="text-xl"><span className="font-bold">Loyalty Points:</span> <span>{user.loyaltyPoints}</span></p>
                    <br></br>
                    <div className="text-left"><AddressList/></div>
                    <br></br>
                    <div><OrderHistory/></div>
                    </div>
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    )
}