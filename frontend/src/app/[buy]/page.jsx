"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/slice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Details = () => {
  const selectedProduct = useSelector((state) => state.cart.selectedProduct);
  console.log(selectedProduct);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  if (!selectedProduct) {
    return <p>No product selected.</p>;
  }

  const handleAddToCart = async () => {
    dispatch(addToCart(selectedProduct));

    const cartItem = {
      productName: selectedProduct.attributes.Name,
      price: selectedProduct.attributes.Price,
      imageUrl: selectedProduct.imageUrl,
      userId: session.user.id, // Assuming the user ID is stored in session.user.id
    };

    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        toast.success(`${selectedProduct.attributes.Name} added to cart!`);
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      toast.error("An error occurred while adding item to cart");
    }
  };

  return (
    <>
      <div className="mt-32">
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900">
          <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
              <div className="shrink-0 max-w-md lg:max-w-lg mx-auto -mt-24">
                <Image
                  src={`/${selectedProduct.imageUrl}`}
                  alt={selectedProduct.attributes.Name}
                  width={1000}
                  height={100}
                />
              </div>

              <div className="mt-6 sm:mt-8 lg:mt-0">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                  {selectedProduct.attributes.Name}
                </h1>
                <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                  <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                    Rs.{selectedProduct.attributes.Price}
                  </p>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {/* Rating Section */}
                    {/* ... */}
                  </div>
                </div>

                <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                  {
                    session?.user?.id?(
                      <>
                        <button
                          onClick={handleAddToCart}
                          className="text-white mt-4 sm:mt-0 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                        >
                          Add to cart
                        </button>
                      </>
                    ):(
                      <div>No Shopping </div>
                    )
                  }
                </div>

                <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

                <p className="mb-6 text-gray-500 dark:text-gray-400">
                  {selectedProduct.attributes.Description}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ToastContainer />
    </>
  );
};

export default Details;


