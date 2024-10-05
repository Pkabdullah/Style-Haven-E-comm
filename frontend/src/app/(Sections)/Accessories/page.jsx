"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedProduct } from "../../features/slice";
import { useRouter } from "next/navigation";
import AccessoriesSlider from "@/components/Sliders/AccessoriesSlider";
import Image from "next/image";

const MenSection = () => {
  const [filter, setFilter] = useState([]);
  const [record, setRecord] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const handleProductClick = (product) => {
    dispatch(setSelectedProduct(product));
    const categoryName = product.attributes.Name;
    router.push(`/${categoryName}?Details`);
  };

  useEffect(() => {
    async function getSearch() {
      try {
        const response = await fetch(
          `http://localhost:1337/api/accessorie-sections?populate[categories][populate][products][populate][image]=*
`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_Banner_TOKEN}`,
            },
          }
        );
        const data = await response.json();
        const allProducts = data.data.flatMap((section) =>
          section.attributes.categories.data.flatMap((category) =>
            category.attributes.products.data.map((product) => ({
              ...product,
              imageUrl: product.attributes.image?.data?.attributes?.name,
            }))
          )
        );
        setFilter(allProducts);
        setRecord(allProducts); // Display all products initially
        console.log("Clothing data:", allProducts);
      } catch (error) {
        console.error("Error fetching men clothing data:", error);
      }
    }
    getSearch();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === "") {
      setRecord(filter);
    } else {
      const filteredRecords = filter.filter((product) =>
        product.attributes.Name.toLowerCase().includes(searchTerm)
      );
      setRecord(filteredRecords);
    }
  };

  return (
    <div className="overflow-hidden">
     
      <div className="text-5xl  font-bold mt-36 flex justify-center">
        <h1>Mens Accessories</h1>
      </div>
      <div className="mt-24">
        <AccessoriesSlider />
      </div>
      {record.map((a) => {
        <div>{a.attributes.Name}</div>;
      })}

      <form onSubmit={handleSearch} className="w-[50%] mx-auto mt-12">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only ">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onChange={handleSearch}
            type="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-400 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Accessories"
            required
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-20 p-6 mt-10">
        {record.map((product, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
          >
            <div className="rounded-lg border border-gray-200  p-6 shadow-sm">
            
                <div className="h-56 w-full mb-4"  
                onClick={()=>{handleProductClick(product)}}
                >
                  <Image
                    src={"/"+product.imageUrl}
                    alt={product.attributes.Name}
                    width={200}
                    height={0}
                    className="h-full w-full object-contain rounded-lg"
                  />
                </div>
            
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                    Up to 35% off
                  </span>
                </div>
                <a
                  href="#"
                  className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                >
                  {product.attributes.Name}
                </a>
                <ul className="mt-2 flex items-center gap-4">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fast Delivery
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Best Price
                    </p>
                  </li>
                </ul>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                    Rs.{product.attributes.Price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenSection;
