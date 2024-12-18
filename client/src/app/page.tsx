'use client'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearUser } from "./redux/features/userSlice";

export default function Home() {
  const router = useRouter();
  const isAuth = useSelector((data: RootState) => data.userState.isAuthenticated);

  const dispatch = useDispatch();
  
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
       <button onClick={()=>dispatch(clearUser())}>LOG OUT</button>
    </main>
  );
}