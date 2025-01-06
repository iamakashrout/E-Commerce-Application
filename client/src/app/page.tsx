'use client'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearUser } from "./redux/features/userSlice";
import ProductsList from "@/components/ProductsList";
import RecommendList from "@/components/RecommendList";
import Link from "next/link";
import HelpChat from "@/components/HelpChat";
import HelpButton from "@/components/HelpButton";
import NotificationsButton from "@/components/NotificationButton";

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
    <main>
       <h1>Welcome to the Home Page!</h1>
<<<<<<< HEAD
       <NotificationsButton userId={user} />
       <ProductsList />
=======
       {/* <ProductsList /> */}
       <RecommendList />
>>>>>>> recommendations
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