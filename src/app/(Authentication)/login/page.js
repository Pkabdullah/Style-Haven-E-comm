"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { ArrowBigLeft } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import VerifiedAnimation from "@/components/others/VerifiedAnimation";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { data: session, status } = useSession();

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    try {
      const res = await signIn("credentials", {
        email, 
        password,
        redirect: false,
      });
      if (res.error) {
        toast.error("Invalid credentials");
        setIsSubmitting(false); 
        return;
      }

      if (res.ok) {
        toast.success("Login successful");
        setTimeout(() => { 
          router.replace("/");
        }, 1500); 
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsSubmitting(false); 
    }
  };

 
  if (status === "authenticated") {
    return <VerifiedAnimation title={"User Verified"}/>;
  }

  return (
    <div>
      <Link href={"/"}>
        <div className="flex">
          <ArrowBigLeft />
          <h3 className="text-red-600">Back</h3>
        </div>
      </Link>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 bg-white border-2 border-gray-300 rounded-2xl shadow-2xl border-t-green-400 border-b-red-400"
        >
          <h3 className="font-bold text-2xl mb-6">Enter Details</h3>
          <div className="mb-6">
            <Input
              className="bg-gray-100 w-full mb-4 border-gray-100"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
            />
            <Input
              className="bg-gray-100 w-full mb-6 border-gray-100"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
            />
          </div>
          <div className="flex justify-center mb-4">
            <Button
              className="bg-green-500 text-white rounded-xl hover:bg-green-300 w-48"
              disabled={isSubmitting} // Disable button during submission
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="text-center">
            <h3 className="text-sm">
              Don’t have an account?
              <Link href="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </h3>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}




// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {  useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useRouter } from "next/navigation";
// import { ArrowBigLeft } from "lucide-react";
// import { signIn, useSession } from "next-auth/react";
// import VerifiedAnimation from "@/components/others/VerifiedAnimation";

// export default function Login() {
//   const [Email, setEmail] = useState("");
//   const [Password, setPassword] = useState("");
//   const [isVerified, setIsVerified] = useState(false);
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const Login = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await signIn("credentials", {
//         Email,
//         Password,
//         redirect: false,
//       });
//       console.log(res);

//       if (res.error) {
//         toast.error("invlaid credentials");
//         return;
//       }

//       setIsVerified(true);
//       setTimeout(() => {
//         router.replace("/");
//       }, 1500);

//     } catch (error) {
//       toast.error("Login failed");
//     }

//   };

//   if (isVerified) {
//     return <VerifiedAnimation />;
//   }

//   return (
//     <div>
//       <Link href={"/"}>
//         <div className="flex">
//           <ArrowBigLeft />
//           <h3 className="text-red-600">Back</h3>

//         </div>
//       </Link>
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <form
//           onSubmit={Login}
//           className="w-full max-w-md p-8 bg-white border-2 border-gray-300 rounded-2xl shadow-2xl border-t-green-400 border-b-red-400"
//         >
//           <h3 className="font-bold text-2xl mb-6">Enter Details</h3>
//           <div className="mb-6">
//             <Input
//               className="bg-gray-100 w-full mb-4 border-gray-100"
//               placeholder="Enter Email"
//               onChange={(e) => setEmail(e.target.value)}
//               value={Email}
//             />
//             <Input
//               className="bg-gray-100 w-full mb-6 border-gray-100"
//               placeholder="Enter password"
//               onChange={(e) => setPassword(e.target.value)}
//               value={Password}
//               type="password"
//             />
//           </div>
//           <div className="flex justify-center mb-4">
//             <Button className="bg-green-500 text-white rounded-xl hover:bg-green-300 w-48">
//               Login
//             </Button>
//           </div>
//           <div className="text-center">
//             <h3 className="text-sm">
//               Don t have an account?
//               <Link href="/register" className="text-blue-500 hover:underline">
//                 Register
//               </Link>
//             </h3>
//           </div>
//         </form>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// }


