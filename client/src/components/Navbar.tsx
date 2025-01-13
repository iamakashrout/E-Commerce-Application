'use client';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RootState } from "@/app/redux/store";
import { clearUser } from "@/app/redux/features/userSlice";
import NotificationsButton from "@/components/NotificationButton";

export default function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((data: RootState) => data.userState.userEmail) || '';

    const handleLogout = () => {
        dispatch(clearUser());
        router.push("/login"); // Redirect to login page after logout
    };

    return (
        <nav className="bg-custom-light-teal p-6 flex justify-evenly items-center">
            <Link
                href="/"
                className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition duration-300"
            >
                Home
            </Link>
            <Link 
                href="/profile" 
                className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition duration-300" 
                >
                    Profile
                </Link>
            <Link
                href="/cart"
                className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition duration-300"
            >
                Go to Cart
            </Link>
            <div className="flex items-center">
                <NotificationsButton userId={user} />
            </div>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
                Logout
            </button>
        </nav>
    );


}
