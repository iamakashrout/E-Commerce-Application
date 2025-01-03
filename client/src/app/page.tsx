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
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const router = useRouter();
  const isAuth = useSelector((data: RootState) => data.userState.isAuthenticated);

  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [isAuth, router]);

  if (!isAuth) {
    return null; // Prevent rendering while redirecting
  }
  
  return (
    <main>
       <h1>Welcome to the Home Page!</h1>
       <SearchBar />
       <ProductsList />
       <Link href="/cart">Go to Cart</Link>
       <br/>
       <Link href="/profile">Profile</Link>
       <br/>
       <button onClick={()=>dispatch(clearUser())}>LOG OUT</button>
      {/* Helpline Popup */}
      {showPopup ? (<HelpChat onClose={() => setShowPopup(false)} />):  <HelpButton onClick={() => setShowPopup(true)} />}
    </main>
  );
}