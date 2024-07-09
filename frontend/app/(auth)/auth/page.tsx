"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { GoXCircleFill } from "react-icons/go";
import { ClipLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const router = useRouter();
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      router.push("/");
    }
    if (!action) {
      router.push("?action=login");
    }
  }, [router, action]);

  async function resetForm() {
    setError("");
    setLoading(false);
    setUsername("");
    setPassword("");
  }

  async function tryRegister() {
    try {
      setLoading(true);
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
          case "invalid_username":
            throw "Invalid username: it should be between 3 and 16 characters long, only the _ and . special characters are allowed";
          case "invalid_password":
            throw "Invalid password: it must be at least 8 characters long, it must have one lowercase and uppercase letter, it must contain 1 digit and 1 special character (@$!%*?&)";
          case "username_taken":
            throw "Username is taken, please use another one";
          default:
            throw "Uh oh... something went wrong";
        }
      }
      resetForm();
      router.push("?action=login");
    } catch (err: any) {
      setError(err.toString());
      setTimeout(() => {
        setError("");
      }, 7000);
    }
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }

  async function tryLogin() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/auth/login", {
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
          case "failed_login":
            throw "Invalid credentials, check them again and try again...";
          default:
            throw "Uh oh... something went wrong";
        }
      }
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.toString());
      setTimeout(() => {
        setError("");
      }, 7000);
    }
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }
  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="top-0 left-0 right-0 bottom-0 w-full blur-[300px] -z-10 absolute">
        <div className="h-[450px] w-1/2 bg-purple-500" />
        <div className="h-[450px] absolute bottom-0 right-0 w-[300px] bg-yellow-500" />
      </div>
      <div className="min-h-[450px] flex flex-col items-center justify-between w-[450px] p-4 bg-white border-2 bg-opacity-85 border-neutral-200 rounded-3xl shadow-lg">
        <div className="text-center min-h-[186px] flex-[1.3] flex justify-center items-center flex-col w-full">
          <Image
            src={"/assets/logo.png"}
            className="rounded-full mb-2.5 shadow"
            height={60}
            width={60}
            alt="hello"
          ></Image>
          <p className="font-semibold text-2xl">
            Welcome{action === "login" && " back"}!
          </p>
          <p className="">
            {action === "login"
              ? "It's good to see you again :)"
              : "Please register..."}
          </p>
        </div>
        <div className={`w-full pt-4 flex-col flex justify-end items-end`}>
          <div className="w-full flex flex-col gap-3">
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
              {error && (
                <span className="w-full flex gap-1 mt-2 text-sm text-red-500">
                  <GoXCircleFill className="mt-0.5 shrink-0" size={17} />
                  {error}
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex items-center flex-col gap-4 mt-8">
            {action === "register" ? (
              <button
                onClick={() => tryRegister()}
                className="bg-neutral-900 flex items-center justify-center gap-3 text-white w-full py-2 rounded-full text-md shadow hover:bg-neutral-800 transition-all"
              >
                Register
                <ClipLoader loading={loading} color="white" size={14} />
              </button>
            ) : (
              <button
                onClick={() => tryLogin()}
                className="bg-neutral-900 flex items-center justify-center gap-3 text-white w-full py-2 rounded-full text-md shadow hover:bg-neutral-800 transition-all"
              >
                Sign In
                <ClipLoader loading={loading} color="white" size={14} />
              </button>
            )}
            {action === "login" ? (
              <span className="text-sm opacity-75 text-center w-full">
                Not a member yet?{" "}
                <Link
                  className="underline"
                  href={"?action=register"}
                  onClick={() => resetForm()}
                >
                  Register
                </Link>
              </span>
            ) : (
              <span className="text-sm opacity-75 text-center w-full">
                Already registered?{" "}
                <Link
                  className="underline"
                  href={"?action=login"}
                  onClick={() => resetForm()}
                >
                  Sign In
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
