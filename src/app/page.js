"use client"
import Sliders from "@/components/Sliders/Slider";
import Collection from "@/components/Banners/Collection"
import Accessories from "@/components/Banners/Accessories";
import ContactUs from "@/components/others/ContactUs";

export default function Home() {
  
  return (
    <main className=" relative ">
    
      <Sliders />
      <Collection />
      <Accessories />
      <ContactUs />
    
    </main>
  );
}
