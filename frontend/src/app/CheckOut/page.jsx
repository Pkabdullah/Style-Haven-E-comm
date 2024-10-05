"use client";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { clearCart, setCart } from "../features/slice";
import { useRouter } from "next/navigation";

const CheckOut = () => {
  const checkout = useSelector((state) => state.cart.cart);
  const [checkItem, setcheckItem] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectPayment, SetselectPayment] = useState();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");

  const { data: session } = useSession();
  const dispatch = useDispatch()
  const router= useRouter();

  const totalOriginalPrice = checkItem.reduce(
    (acc, item) => acc + item.price,
    0
  );
  const DeliveryFee = 150;
  const totalPrice = totalOriginalPrice + DeliveryFee;
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/cart?userId=${session.user.id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch cart items");

        const data = await response.json();
        setcheckItem(data.cartItems);
        dispatch(setCart(data.cartItems));
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to fetch cart items");
      }
    };

    fetchCartItems();
  }, [session?.user?.id, dispatch]);

  const handlePayment = async () => {
    
      try {
        // Handle the payment
        if (selectPayment === "card") {
          const getStripePromise = loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_API_TOKEN
          );
    
          const response = await fetch(
            "http://localhost:3000/api/checkout-session/",
            {
              method: "POST",
              cache: "no-cache",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(checkout),
            }
          );
    
          const data = await response.json();
          if (data.session) {
            await (await getStripePromise).redirectToCheckout({
              sessionId: data.session.id,
            });
    
         
            dispatch(clearCart());
          }
        } else if (selectPayment === "cod") {
          
        }
      } catch (error) {
        toast.error("Failed to handle payment");
        console.error("Error handling payment:", error);
      } finally {
        // Clear cart regardless of payment method
        dispatch(clearCart());
      }
    };

  const handleOrder = async () => {
    if (!session?.user?.id) {
      toast.error("Please log in to place order");
    }
    try {
      const response = await fetch("http://localhost:3000/api/order", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
      toast.success("ORDER PLACE successfully");
      setTimeout(() => {
       router.replace("/Order-Tracking")
      }, 1500);


      const clearCartItem = await fetch(
        `http://localhost:3000/api/clearItem?userId=${session.user.id}`,
        {
          method: "DELETE",
        }
      );
      if (!clearCartItem.ok)
        throw new Error("Failed to clear the cart in the database");
      dispatch(clearCart());

    } catch (error) {
      toast.error("Failed to place order");
      console.error("Error placing order:", error);
    }
  };

  const customerDetails = {
    FullName: fullName,
    email: email,
    address: address,
    city: city,
    province: province,
    country: country,
    zipcode: zipcode,
  };
  const orderData = {
    userId: session?.user?.id,
    customerDetails,
    items: checkItem,
    total: totalPrice,
    paymentMethod: selectPayment, 
  };

  return (
    <div>
      <div className="mt-20 ml-14">
        <ol class="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
          <Link href={"/Cart"}>
            <li class="after:border-1 flex items-center text-blue-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  class="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Cart
              </span>
            </li>
          </Link>

          <Link href={"/CheckOut"}>
            <li class="after:border-1 flex items-center text-blue-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-400 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span class="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  class="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Checkout
              </span>
            </li>
          </Link>

          <li class="flex shrink-0 items-center">
            <svg
              class="me-2 h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Payment
          </li>
        </ol>
      </div>
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="w-full lg:w-1/2 p-6">
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email">Email Address</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  placeholder="StyleHaven@.Pk"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label htmlFor="address">Address/Street</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  placeholder="Apartment, suite, etc. (optional)"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
              </div>
              <div className="md:col-span-1">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                />
              </div>
              <div className="md:col-span-1">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  placeholder="Pakistan"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                />
              </div>
              <div className="md:col-span-1">
                <label htmlFor="state">Province</label>
                <input
                  type="text"
                  name="province"
                  id="province"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  placeholder="Sindh"
                  onChange={(e) => setProvince(e.target.value)}
                  value={province}
                />
              </div>
              <div className="md:col-span-1">
                <label htmlFor="zipcode">Zipcode</label>
                <input
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  placeholder="12345"
                  onChange={(e) => setZipcode(e.target.value)}
                  value={zipcode}
                />
              </div>

              <p className="mt-8 text-lg font-medium">Payment Methods</p>
              <form className="mt-5 grid gap-6">
                <select
                  onChange={(e) => SetselectPayment(e.target.value)}
                  value={selectPayment}
                >
                  <option value="">Select Payment Method</option>
                  <option value="card">Card</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </form>

              <div className="md:col-span-2 text-right">
                <button
                  onClick={() => {
                    handlePayment();handleOrder()
                  }}
                  className="w-full mt-4 bg-blue-700 text-white font-medium py-2 rounded-lg"
                >
                  {selectPayment === "cod" ? "Place Order" : "Proceed To Pay"}
                </button>
              </div>

              <div className="flex items-center justify-center mt-4">
                <span className="text-sm font-normal text-gray-500">or</span>
                <Link href="/">
                  <h1 className="text-blue-600 ml-1 text-sm font-medium">
                    {" "}
                    Continue Shopping
                  </h1>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Left side - Order Summary */}
        <div className="w-full lg:w-1/2 p-6">
          <div className="lg:hidden mb-4">
            <button
              className="bg-gray-100 w-full p-4 text-left text-lg font-medium rounded-lg"
              onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            >
              {isSummaryOpen ? "Hide Order Summary" : "Show Order Summary"} (Rs.
              {totalPrice})
            </button>
          </div>

          <div
            className={`${
              isSummaryOpen ? "block" : "hidden"
            } lg:block bg-white rounded shadow-lg p-4 px-4 md:p-8`}
          >
            <h2 className="text-xl font-medium">Order Summary</h2>
            <p className="text-gray-400">
              Check your items and select a suitable shipping method.
            </p>

            <div className="mt-8 space-y-3">
              {checkItem.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-lg bg-white p-4"
                >
                  <Image
                    className="m-2 h-24 w-28 rounded-md border object-contain"
                    src={"/" + item.imageUrl}
                    alt={item.productName}
                    width={800}
                    height={0}
                  />
                  <div className="flex flex-col ml-4">
                    <span className="font-semibold">{item.productName}</span>
                    <span className="text-lg font-bold">Rs. {item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <dl className="flex justify-between">
                <dt className="text-base font-normal text-gray-500">
                  Original Price
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  Rs. {totalOriginalPrice}
                </dd>
              </dl>

              <dl className="flex justify-between">
                <dt className="text-base font-normal text-gray-500">
                  Delivery Fees
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  Rs. {DeliveryFee}
                </dd>
              </dl>

              <dl className="flex justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-bold text-gray-900">Total</dt>
                <dd className="text-base font-bold text-gray-900">
                  Rs. {totalPrice}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default CheckOut;
