"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import TaskList from "./components/tasklist/page";
import { withAuth } from "@/lib/withAuth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.displayName) {
        setUserName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <section>
      <div className="relative bg-[#50C2C9] h-80">
        <div className="absolute top-0">
          <Image src={"/shapetwo.png"} width={200} height={200} alt="" />
        </div>

        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="bg-white text-[#d63434] px-4 py-1 text-sm font-semibold rounded shadow"
          >
            Logout
          </button>
        </div>

        <div className="absolute left-1/2 top-50 -translate-x-1/2 -translate-y-1/2">
          <Image src={"/Ellipse.png"} width={100} height={100} alt="Ellipse" />
        </div>

        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-bold text-lg text-white w-full pl-4">
          {userName ? `Welcome ${userName}` : "Welcome!"}
        </p>
      </div>

      <div className="container mx-auto px-5 my-5 max-w-md">
        <div className="flex w-full justify-end">
          <p className="font-semibold text-xs">Good Afternoon</p>
        </div>

        <div className="flex justify-center items-center my-5">
          <Image src={"/clock.png"} width={100} height={100} alt="clock" />
        </div>

        <h2 className="text-sm font-semibold">Task list</h2>
        <TaskList />
      </div>
    </section>
  );
};

export default withAuth(Dashboard);
