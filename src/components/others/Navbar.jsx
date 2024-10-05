"use client";
import React, { useState, useEffect } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { Button } from "../ui/button";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoShirtSharp } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import Link from "next/link";
import { useSelector } from "react-redux";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingBar from "react-top-loading-bar";
import Router from "next/router";
import Loader from "./loadingAnimation";

const Navbar = () => {
  const { data: session ,status} = useSession();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [navbarBg, setNavbarBg] = useState(false);
  const [progress, setProgress] = useState(0);
  const cart = useSelector((state) => state.cart.cart);
  const order = useSelector((state) => state.cart.orders);
console.log("orders",order)
  console.log(session);
 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setNavbarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setNavbarBg(true);
      } else {
        setNavbarBg(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleLinkClick = () => {
    setNavbarOpen(false);
  };
  useEffect(() => {
    Router.events.on("hashChangeStart", () => {
      setProgress(10);
    });
  });
  return (
    <>
      <LoadingBar
        progress={progress}
        waitingTime={800}
        onLoaderFinished={() => setProgress(0)}
        className="bg-gradient-to-r from-red-500 via-black to-red-500 shadow-[0_0_10px_rgba(255,0,0,0.7),_0_0_20px_rgba(255,0,0,0.5)]"
      />
      <div className="sticky top-0 left-0 w-full z-50">
        <nav
          className={`w-full h-[75px] flex items-center justify-between px-6 py-4 transition-colors duration-700 ${
            navbarBg || navbarOpen
              ? "bg-gray-100"
              : "bg-opacity-60 hover:bg-white"
          }`}
        >
          {/* Logo and Hamburger */}

          <div className="flex items-center justify-between w-full lg:w-auto">
            <button
              className="lg:hidden p-2"
              onClick={() => setNavbarOpen(true)}
            >
              <AiOutlineMenu className="text-2xl text-gray-600" />
            </button>
            <Link href={"/"} onClick={() => setProgress(progress + 100)}>
              <div className="mt-2 flex flex-col lg:flex-row lg:items-center lg:justify-center lg:space-x-4 w-full">
                <IoShirtSharp className="text-3xl text-yellow-400" />
                <h1 className="text-xl text-gray-500 font-cursive lg:mr-4">
                  Style Haven
                </h1>
                <h2 className="text-red-700 font-bold lg:inline hidden">
                  Sale - FLAT 50% OFF
                </h2>
              </div>
            </Link>
          </div>

          {/* Menu Items (Desktop) */}
          <div className="hidden lg:flex lg:items-center lg:gap-8 text-gray-600 text-[14px] ml-24">
            <ul className="flex flex-row gap-8">
              <Link
                href={"/MenSection"}
                onClick={() => setProgress(progress + 100)}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 text-gray-400 hover:bg-white hover:text-black px-2 py-1">
                  Mens
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-black transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
              <Link
                href={"/EasternWear"}
                onClick={() => setProgress(progress + 100)}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 text-gray-400 hover:bg-white hover:text-black px-2 py-1">
                  Eastern Wear
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-black transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
              <Link
                href={"/Accessories"}
                onClick={() => setProgress(progress + 100)}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 text-gray-400 hover:bg-white hover:text-black px-2 py-1">
                  Accessories
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-black transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
              <Link
                href={"/Footwear"}
                onClick={() => setProgress(progress + 100)}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 text-gray-400 hover:bg-white hover:text-black px-2 py-1">
                  FootWear
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-black transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
            </ul>
          </div>

          {/* Cart Icon and Login (Desktop) */}

          <div className="hidden lg:flex lg:items-center lg:gap-4 ml-auto">
            {session?.user ? (
              <>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <h2 className="">{session.user.name}</h2>
                <Button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-red-800 rounded-xl text-white hover:bg-red-500"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href={"/login"}>
                <Button className="bg-blue-800 rounded-xl text-white hover:bg-blue-500">
                  Log in
                </Button>
              </Link>
            )}

            <Link href={"/Order-Tracking"} className="relative inline-flex items-center">
              <TbTruckDelivery className="text-3xl text-yellow-400" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -mr-4">
               {order.length}
              </span>
            </Link>
            <Link href="/Cart" className="relative inline-flex items-center">
              <FiShoppingBag className="text-2xl text-gray-600 hover:text-black transition-colors duration-300 ml-4" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -mr-4">
                {cart.length}
              </span>
            </Link>
          </div>
        </nav>

        {/* Fullscreen Menu (Mobile) */}
        {navbarOpen && (
          <div className="fixed top-0 right-0 w-full h-full bg-white text-gray-800 z-40 flex flex-col items-center justify-center">
            <button
              className="absolute top-4 right-4 p-2"
              onClick={() => setNavbarOpen(false)}
            >
              <AiOutlineClose className="text-2xl text-gray-800" />
            </button>
            <ul className="flex flex-col items-center gap-8">
              <Link
                href={"/MenSection"}
                onClick={() => {
                  handleLinkClick();
                  setProgress(progress + 100);
                }}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 hover:text-gray-600">
                  Mens
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-gray-800 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
              <Link
                href={"/EasternWear"}
                onClick={() => {
                  handleLinkClick();
                  setProgress(progress + 100);
                }}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 hover:text-gray-600">
                  Eastern Wear
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-gray-800 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
              <Link
                href={"/Accessories"}
                onClick={() => {
                  handleLinkClick();
                  setProgress(progress + 100);
                }}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 hover:text-gray-600">
                  Accessories
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-gray-800 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
              <Link
                href={"/Footwear"}
                onClick={() => {
                  handleLinkClick();
                  setProgress(progress + 100);
                }}
              >
                <li className="relative group cursor-pointer transition-colors duration-300 hover:text-gray-600">
                  FootWear
                  <span className="absolute left-0 bottom-[-5px] w-full h-0.5 bg-gray-800 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                </li>
              </Link>
              <li className="text-red-700 font-bold">Sale - FLAT 50% OFF</li>
            </ul>

            <Link
              href="/Cart"
              className="relative inline-flex items-center mt-4"
              onClick={handleLinkClick}
            >
                <Link href={"/Order-Tracking"} className="relative inline-flex items-center">
              <TbTruckDelivery className="text-3xl text-yellow-400" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -mr-4">
               {order.length}
              </span>
            </Link>
              <FiShoppingBag className="text-2xl text-gray-600 hover:text-black transition-colors duration-300 ml-4" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -mr-4">
                {cart.length}
              </span>
            </Link>
            <div>
              {session?.user ? (
                <>
                  <div className="flex mt-6 gap-4 ">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <h2 className="">{session.user.name}</h2>
                  </div>

                  <Button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="bg-red-800 rounded-xl text-white hover:bg-red-500 mt-10 ml-8"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href={"/login"}>
                  <Button className="bg-blue-800 rounded-xl text-white hover:bg-blue-500 mt-10 ml-8">
                    Log in
                  </Button>
                </Link>
              )}{" "}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
