'use client';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RootState } from "@/app/redux/store";
import { clearUser } from "@/app/redux/features/userSlice";
import NotificationsButton from "@/components/NotificationButton";
import { toggleDarkMode } from "@/app/redux/features/themeSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.themeState.darkMode);
    const router = useRouter();
    const user = useSelector((data: RootState) => data.userState.userEmail) || '';

    const handleLogout = () => {
        dispatch(clearUser());
        router.push("/login"); 
    };

    return (
        <nav className="bg-custom-light-teal p-6 flex items-center justify-between">
          <div className="text-3xl font-bold text-custom-purple">SwiftShop</div>
          <div className="flex items-center space-x-6">
          <button
      onClick={() => dispatch(toggleDarkMode())}
      className="p-2 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
    >
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
            <Link
              href="/"
              className="text-lg font-semibold text-gray-800 hover:text-gray-500 hover:font-bold transition duration-300"
            >
              Home
            </Link>
            <Link 
              href="/profile" 
              className="text-lg font-semibold text-gray-800 hover:text-gray-500 hover:font-bold transition duration-300"
            >
              Profile
            </Link>
            <Link
              href="/cart"
              className="text-lg font-semibold text-gray-800 hover:text-gray-500 hover:font-bold transition duration-300"
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
          </div>
        </nav>
      );
}
