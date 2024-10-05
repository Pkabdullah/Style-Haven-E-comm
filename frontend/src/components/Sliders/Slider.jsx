"use client";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

const Sliders = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000, 
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    async function getBanner() {
      try {
        let response = await fetch(
          `http://localhost:1337/api/banners?populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_Banner_TOKEN}`,
            },
          }
        );
        let data = await response.json();
        setBanners(data.data);
        console.log("Banners:", data.data);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    }

    getBanner();
  }, []);

  return (
    <div className=" -mt-20 w-screen h-screen ">
      <Slider {...settings} className="absolute top-0 left-0 w-full h-full z-0">
        {banners.map((banner) => (
          <div key={banner.id} className="relative h-full w-full">
            <Image
              src={
              "/"+  banner.attributes.image.data &&
               "/"+ banner.attributes.image.data.attributes.name
              } 
              width={1440}
              height={0}
              alt={banner.attributes.Title || "Banner Image"}
              className="object-fill w-full h-screen" 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Sliders;
