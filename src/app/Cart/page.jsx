"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { setCart } from "../features/slice";
import { useRouter } from "next/navigation";
import Loader from "@/components/others/loadingAnimation";

const Cart = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);

      // Check if session is still loading or if the user is not authenticated
      if (status === "loading") return (
        <Loader/>
  ); // Optionally show a loading spinner if needed
      if (!session?.user?.id) {
        // Redirect to login page if not authenticated
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/cart?userId=${session.user.id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch cart items");

        const data = await response.json();
        setCartItems(data.cartItems);
        dispatch(setCart(data.cartItems));
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to fetch cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [session?.user?.id, dispatch, status, router]);

  const handleRemoveFromCart = async (item) => {
    try {
      const itemId = item._id;

      const response = await fetch(
        `http://localhost:3000/api/cart?userId=${session.user.id}&itemId=${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove item from cart");

      const updatedCartItems = cartItems.filter(
        (cartItem) => cartItem._id !== itemId
      );
      setCartItems(updatedCartItems);
      dispatch(setCart(updatedCartItems));

      toast.success(`${item.productName} removed from cart!`);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  if (loading) {
    return <Loader title={"Your cart is being loaded..."} />;
  }

  return (
    <div>
      <div className="mt-20 ml-14">
        <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
          <li className="after:border-1 flex items-center text-blue-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Cart
            </span>
          </li>
          <Link href={"/CheckOut"}>
            <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Checkout
              </span>
            </li>
          </Link>
          <li className="flex shrink-0 items-center">
            <svg
              className="me-2 h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Payment
          </li>
        </ol>
      </div>
      <section className="bg-white py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 mt-10">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Shopping Cart
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                    >
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        <Image
                          className="h-20 w-20 object-contain"
                          src={"/" + item.imageUrl}
                          alt={item.productName}
                          width={800}
                          height={0}
                        />
                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                          <a
                            href="#"
                            className="text-base font-medium text-gray-900 hover:underline"
                          >
                            {item.productName}
                          </a>
                          <div className="flex items-center justify-between">
                            <div className="text-base font-bold text-gray-900">
                              Rs. {item.price}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <button
                            onClick={() => handleRemoveFromCart(item)}
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          >
                            <svg
                              className="me-1.5 h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18 17.94 6M18 18 6.06 6"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {cartItems.length > 0 ? (
                  <Link
                    href="/CheckOut"
                    className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Proceed to CheckOut
                  </Link>
                ) : (
                  <div className="flex justify-center">
                    <Image src="/cart.png" width={200} height={100} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default Cart;


// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useDispatch } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { setCart } from "../features/slice";
// import { useRouter } from "next/navigation";
// import Loader from "@/components/others/loadingAnimation";

// const Cart = () => {
//   const { data: session, status } = useSession();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       setLoading(true);
//       if (!session?.user?.id) return;

//       try {
//         const response = await fetch(
//           `http://localhost:3000/api/cart?userId=${session.user.id}`,
//           {
//             method: "GET",
//           }
//         );

//         if (!response.ok) throw new Error("Failed to fetch cart items");

//         const data = await response.json();
//         setCartItems(data.cartItems);
//         dispatch(setCart(data.cartItems));
//         const cartItemIds = data.cartItems.map((item) => item._id);
//         console.log("Cart Item IDs:", cartItemIds);
//         console.log("abc", data);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//         toast.error("Failed to fetch cart items");
//       }
//       setLoading(false);
//     };
//     if (session || status === "loading") {
//       fetchCartItems();
//     }
//   }, [session?.user?.id, dispatch]);

//   if (loading) {
//     return <Loader title={"your cart is being"} />;
//   }
//   const handleRemoveFromCart = async (item) => {
//     try {
//       const itemId = item._id;

//       const response = await fetch(
//         `http://localhost:3000/api/cart?userId=${session.user.id}&itemId=${itemId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) throw new Error("Failed to remove item from cart");

//       const updatedCartItems = cartItems.filter(
//         (cartItem) => cartItem._id !== itemId
//       );
//       setCartItems(updatedCartItems);
//       dispatch(setCart(updatedCartItems));

//       toast.error(`${item.productName} removed from cart!`);
//     } catch (error) {
//       console.error("Error removing item from cart:", error);
//       toast.error("Failed to remove item from cart");
//     }
//   };

//   return (
//     <div>
//       <div className="mt-20 ml-14">
//         <ol class="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
//           <li class="after:border-1 flex items-center text-blue-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
//             <span class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
//               <svg
//                 class="me-2 h-4 w-4 sm:h-5 sm:w-5"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   stroke-width="2"
//                   d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                 />
//               </svg>
//               Cart
//             </span>
//           </li>
//           <Link href={"/CheckOut"}>
//             <li class="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
//               <span class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
//                 <svg
//                   class="me-2 h-4 w-4 sm:h-5 sm:w-5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                   />
//                 </svg>
//                 Checkout
//               </span>
//             </li>
//           </Link>

//           <li class="flex shrink-0 items-center">
//             <svg
//               class="me-2 h-4 w-4 sm:h-5 sm:w-5"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 stroke="currentColor"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="2"
//                 d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//               />
//             </svg>
//             Payment
//           </li>
//         </ol>
//       </div>
//       <section className="bg-white py-8 antialiased  md:py-16">
//         <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 mt-10">
//           <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">
//             Shopping Cart
//           </h2>

//           <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
//             <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
//               <div className="space-y-6">
//                 {cartItems.length === 0 ? (
//                   <p>Your cart is empty.</p>
//                 ) : (
//                   cartItems.map((item, index) => (
//                     <div
//                       key={index}
//                       className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
//                     >
//                       <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 ">
//                         <Image
//                           className="h-20 w-20  object-contain"
//                           src={"/" + item.imageUrl}
//                           alt={item.productName}
//                           width={800}
//                           height={0}
//                         />
//                         <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
//                           <a
//                             href="#"
//                             className="text-base font-medium text-gray-900 hover:underline"
//                           >
//                             {item.productName}
//                           </a>
//                           <div className="flex items-center justify-between">
//                             <div className="text-base font-bold text-gray-900">
//                               Rs. {item.price}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between md:order-3 md:justify-end">
//                           <button
//                             onClick={() => handleRemoveFromCart(item)}
//                             type="button"
//                             className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
//                           >
//                             <svg
//                               className="me-1.5 h-5 w-5"
//                               aria-hidden="true"
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="24"
//                               height="24"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 stroke="currentColor"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M6 18 17.94 6M18 18 6.06 6"
//                               />
//                             </svg>
//                             Remove
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 {cartItems?.length > 0 ? (
//                   <Link
//                     href="/CheckOut"
//                     className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//                   >
//                     Proceed to CheckOut
//                   </Link>
//                 ) : (
//                   <div className="flex justify-center">
//                     <Image src="/cart.png" width={200} height={100} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <ToastContainer />
//     </div>
//   );
// };

// export default Cart;
