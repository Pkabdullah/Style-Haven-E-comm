"use client"
import Sliders from "@/components/Sliders/Slider";
import Collection from "@/components/Banners/Collection"
import Accessories from "@/components/Banners/Accessories";
import ContactUs from "@/components/others/ContactUs";
import Loader from "@/components/others/loadingAnimation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader/>;
  }

  return (
    <main className=" relative ">
    
      <Sliders />
      <Collection />
      <Accessories />
      <ContactUs />
    
    </main>
  );
}
