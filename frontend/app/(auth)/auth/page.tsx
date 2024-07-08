"use client";
import Image from "next/image";
import React from "react";
import { GoXCircleFill } from "react-icons/go";

export default function Home() {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  async function tryLogin() {
    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.status === "error") {
        switch (data.message) {
          case "missing_parameters":
            throw "Make sure to fill all the parameters first.";
        }
      }
    } catch (err: any) {
      setError(err.toString());
    }
  }
  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="top-0 left-0 right-0 bottom-0 w-full blur-[300px] -z-10 absolute">
        <div className="h-[450px] w-1/2 bg-purple-500" />
        <div className="h-[450px] absolute bottom-0 right-0 w-[300px] bg-yellow-500" />
      </div>
      <div className="h-[450px] flex flex-col items-center justify-between w-[450px] p-4 bg-white border-2 bg-opacity-85 border-neutral-200 rounded-3xl shadow-lg">
        <div className="text-center flex-[1.3] flex justify-center items-center flex-col w-full">
          <Image
            src={"/assets/logo.png"}
            className="rounded-full mb-2.5 shadow"
            height={60}
            width={60}
            alt="hello"
          ></Image>
          <p className="font-semibold text-2xl">Welcome!</p>
          <p className="">Please register...</p>
        </div>
        <div
          className={`w-full ${
            error ? "gap-8" : "gap-10"
          } pt-4 flex-col flex justify-end items-end`}
        >
          <div className="w-full flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold mb-1">Username</p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-full border bg-transparent border-neutral-400 py-2 px-4"
              />
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border bg-transparent border-neutral-400 py-2 px-4"
              />
              <span className="w-full flex items-center gap-1 mt-2 pt-0.5 text-sm text-red-500">
                <GoXCircleFill size={17} />
                {error}
              </span>
            </div>
          </div>
          <div className="w-full">
            <button
              onClick={() => tryLogin()}
              className="bg-neutral-900 text-white w-full py-2 rounded-full text-md shadow hover:bg-neutral-800 transition-all"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
