"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Tasklist } from "./components/tasklist/page";
import { withAuth } from "@/lib/withAuth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        setUserName(user.displayName);
      }
    });

    return () => unsubscribe();
  }, []);
  
  return (
    <section>
      <div className="relative bg-[#50C2C9] h-80">
        <div className="absolute top-0">
          <Image src={"/shapetwo.png"} width={200} height={200} alt="" />
        </div>
        <div className="absolute left-1/2 top-50 -translate-x-1/2 -translate-y-1/2">
          <Image src={"/Ellipse.png"} width={100} height={100} alt="Ellipse" />
        </div>
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-bold text-lg text-white">
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

        <Tasklist />
      </div>
    </section>
  );
};

export default withAuth(Dashboard);
