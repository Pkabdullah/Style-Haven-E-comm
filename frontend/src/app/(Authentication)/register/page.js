"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import VerifiedAnimation from "@/components/others/VerifiedAnimation";

export default function SignupForm() {
  const [registered, setisRegisterd] = useState(false);
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const router = useRouter();
  async function Signup() {
    try {
      let res = await fetch("http://localhost:3000/api/userexist", {
        method: "POST",
        body: JSON.stringify({ Email }),
      });
      const { user } =await res.json();
      if (user) {
        toast.error("user alredy exist");
        return;
      }
      console.log("user exist", user);
      let data = await fetch(`http://localhost:3000/api/registering`, {
        method: "POST",
        body: JSON.stringify({ FullName, Email, Password }),
      });
      data = await data.json();
      console.log("data", data.userId);
      setisRegisterd(true);
      setTimeout(() => {
        router.replace("/login");
      }, 900);
    } catch (error) {
      console.log(error);
    }
    if (!FullName || !Email || !Password) {
      toast.error("All fields are required");
      return;
    }

    console.log("abc", FullName);
  }
  if (registered) {
    return <VerifiedAnimation title={"User Register Succesfully"} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="border-2 border-gray-300 w-[440px] h-[370px] rounded-2xl shadow-2xl border-t-green-400 border-b-red-400">
        <h3 className="font-bold text-2xl font-sans ml-5 mt-3">Register</h3>
        <div className="w-[80%] ml-10 mt-12">
          <Input
            className="bg-gray-100 mt-5 border-gray-100"
            placeholder="Enter FullName"
            onChange={(e) => setFullName(e.target.value)}
            value={FullName}
          />
          <Input
            className="bg-gray-100 mt-5 border-gray-100"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            value={Email}
          />
          <Input
            className="mt-5 border-gray-100 bg-gray-100"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={Password}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => Signup()}
            className="bg-green-500 text-white rounded-xl hover:bg-green-300 w-48"
          >
            Signup
          </Button>
        </div>
        <div className="flex justify-end mt-4 mr-6">
          <h3 className="text-sm">
            Already have an account?
            <Link href={"/login"}>Login</Link>
          </h3>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
