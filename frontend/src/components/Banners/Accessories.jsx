"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Collection = () => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    async function getCollection() {
      try {
        let response = await fetch(
          `http://localhost:1337/api/accessories?populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_Banner_TOKEN}`,
            },
          }
        );
        let data = await response.json();
        setCollection(data.data);
        console.log("collection:", data.data);
      } catch (error) {
        console.error("Error fetching collection data:", error);
      }
    }
    getCollection();
  }, []);

  return (
    <div>
      <div className="text-5xl mt-24 font-bold flex justify-center">
        <h1>Accessories</h1>
      </div>
      <>
        <Link href="/Accessories">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 px-6">
            {collection.map((collect, index) => (
              <div key={index} className="relative group">
                <Image
                  src={
                    "/" + collect.attributes.image.data &&
                    "/" + collect.attributes.image.data.attributes.name
                  }
                  alt={collect.attributes.Title || "Collection Image"}
                  width={800}
                  height={0}
                  className="object-fill w-screen h-screen transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button className="text-white">Shop Now</Button>
                </div>
              </div>
            ))}
          </div>
        </Link>
      </>
    </div>
  );
};

export default Collection;
