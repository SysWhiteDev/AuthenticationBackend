/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaDoorOpen } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";

type UserData = {
  id: string;
  name: string;
};

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState<boolean>();

  React.useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/auth?action=login");
    }
  }, [router]);

  async function getUserData() {
    await fetch("http://localhost:3001/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (response) => {
      const data = await response.json();
      if (!data.user) {
        localStorage.removeItem("token");
        router.push("/auth?action=login");
        return;
      }
      setUser(data.user);
    });
  }

  async function logOut() {
    setLoading(true);
    await fetch("http://localhost:3001/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    localStorage.removeItem("token");
    router.push("/auth?action=login");
    setLoading(false);
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <div className="top-1/2 left-0 right-0 bottom-0 w-full blur-[300px] -z-10 absolute">
        <div className="h-[450px] w-1/2 bg-teal-500" />
        <div className="h-[450px] absolute top-0 right-0 w-[300px] bg-green-500" />
      </div>
      {user && (
        <div className="flex gap-4 flex-col">
          <div className="flex pr-4 gap-3 items-center justify-between px-3 py-2.5 bg-white border-2 bg-opacity-85 border-neutral-200 rounded-2xl shadow-lg">
            <div className="h-[64px] font-bold shadow w-[64px] overflow-hidden rounded-full bg-gradient-to-tr from-purple-700 to-yellow-600 flex items-center justify-center text-white text-xl">
              <span>
                {user.name[0].toUpperCase()}
                {user.name[Math.floor(user.name.length / 2)].toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl mr-2">{user.name}</span>
              <span className="opacity-45">ID: {user.id}</span>
            </div>
          </div>
          <button
            onClick={() => logOut()}
            className="w-full relative bg-red-700 hover:bg-red-800 transition-all bg-opacity-70 justify-center gap-1.5 px-3 py-2.5 flex items-center text-sm text-red-200 rounded-xl"
          >
            {loading ? (
              <ClipLoader
                className="absolute left-3"
                loading={loading}
                color="white"
                size={14}
              />
            ) : (
              <FaDoorOpen className="absolute left-3" size={16} />
            )}
            <p>Log Out</p>
          </button>
        </div>
      )}
    </div>
  );
}
