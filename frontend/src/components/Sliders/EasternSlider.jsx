"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import Image from "next/image";

const EasterSlider = () => {
  const [menbanners, setMenBanners] = useState([]);

  useEffect(() => {
    async function getBanner() {
      try {
        let response = await fetch(
          `http://localhost:1337/api/eastern-sliders?populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_Banner_TOKEN}`,
            },
          }
        );
        let data = await response.json();
        setMenBanners(data.data);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    }

    getBanner();
  }, []);

  // Slider settings with responsive breakpoints
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative w-full h-screen">
      <Slider {...settings} className="w-full h-full">
        {menbanners.map((banner) => (
          <div key={banner.attributes.Title} className="relative h-full w-full">
            <Image
              src={
             "/"+   banner.attributes.image.data &&
               "/"+ banner.attributes.image.data.attributes.name
              }
              width={800}
              height={0}

              alt={banner.attributes.Title || "Banner Image"}
              className="object-cover w-[250px] h-[382px] rounded-xl border-4 border-transparent  transition-transform transform hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-4 to-transparent w-full">
              <h3 className="text-white text-xl font-serif">{banner.attributes.Title}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EasterSlider;
