
"use client"; 
import Navbar from "@/components/others/Navbar";
import Footer from "@/components/others/Footer";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  const noLayoutRoutes = ["/login", "/register"];
  const isNoLayout = noLayoutRoutes.includes(pathname);
  return (
    <div>
        {!isNoLayout && <Navbar />}
          <main>{children}</main>
          {!isNoLayout && <Footer />}
    </div>
  );
}
