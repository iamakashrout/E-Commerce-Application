'use client'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearUser } from "./redux/features/userSlice";
import ProductsList from "@/components/ProductsList";
import Link from "next/link";
import HelpChat from "@/components/HelpChat";
import HelpButton from "@/components/HelpButton";
import NotificationsButton from "@/components/NotificationButton";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  const isAuth = useSelector((data: RootState) => data.userState.isAuthenticated);
  const user = useSelector((data: RootState) => data.userState.userEmail);
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [isAuth, router]);

  if (!isAuth || !user) {
    return null; // Prevent rendering while redirecting
  }
  
  return (
    <main className="dark:bg-black min-h-screen overflow-hidden">
       <Navbar/>
       <ProductsList />
       <br/>
      {/* Helpline Popup */}
      {showPopup ? (<HelpChat onClose={() => setShowPopup(false)} />):  <HelpButton onClick={() => setShowPopup(true)} />}
    </main>
  );
}