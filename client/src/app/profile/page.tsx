'use client'

import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import apiClient from "@/utils/axiosInstance";
import AddressList from "@/components/AddressList";

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
                    <h1>{user.name}</h1>
                    <p>Email: {user.email}</p>
                    <p>Loyalty Points: {user.loyaltyPoints}</p>
                    <AddressList />
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    )
}