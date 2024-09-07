"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOrder } from "../features/slice";
import Loader from "@/components/others/loadingAnimation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import OrderDetails from "@/components/others/OrderDetails";

const OrderTracking = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      if (!session?.user?.id) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/order?userId=${session.user.id}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch order details");

        const data = await response.json();
        setOrders(data.orderdone);
        dispatch(setOrder(data.orderdone));

        setLoading(false);
      } catch (error) {
        toast.error("Error fetching order data");
        console.error("Error fetching order data:", error);
      }
    };

    if (session || status === "loading") {
      fetchOrder();
    }
  }, [session?.user?.id]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <Loader title={"Order is being processed"} />;
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/order?userId=${session.user.id}&orderId=${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedOrders = orders.filter((order) => order._id !== orderId);
      setOrders(updatedOrders);
      dispatch(setOrder(updatedOrders));

      toast.success("Order canceled successfully");

     
    } catch (error) {
      toast.error("Failed to cancel the order");
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Image src="/no-order.png" width={200} height={100} alt="No orders" />
        </div>
      ) : (
        <section className="bg-white py-8 antialiased dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <div className="mx-auto max-w-5xl">
              {orders.map((order) => (
                <div key={order._id} className="mt-6 flow-root sm:mt-8">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="flex flex-wrap items-start gap-y-4 py-6">
                      <dl className="w-full sm:w-1/2 lg:w-1/4">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Order ID:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                          #{order._id}
                        </dd>
                      </dl>

                      <dl className="w-full sm:w-1/2 lg:w-1/4">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Date:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                          {order.createdAt}
                        </dd>
                      </dl>

                      <dl className="w-full sm:w-1/2 lg:w-1/4">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Price:
                        </dt>
                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                          Rs{order.total}
                        </dd>
                      </dl>

                      <dl className="w-full sm:w-1/2 lg:w-1/4">
                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                          Status:
                        </dt>
                        <dd className="mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                          <svg
                            className="mr-1 h-3 w-3"
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
                              d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                            />
                          </svg>
                          {order.orderStatus}
                        </dd>
                      </dl>

                      <div className="w-full sm:flex sm:justify-between lg:w-64 lg:items-center gap-4">
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          type="button"
                          className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 sm:w-auto"
                        >
                          Cancel order
                        </button>
                        <button
                          onClick={() => handleViewDetails(order)}
                          type="button"
                          className="w-full rounded-lg border border-blue-700 px-3 py-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-4 sm:w-auto"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <nav
                className="mt-6 flex items-center justify-center sm:mt-8"
                aria-label="Page navigation example"
              >
                <ul className="flex h-8 items-center -space-x-px text-sm">
                  <li>
                    <a
                      href="#"
                      className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-4 w-4 rtl:rotate-180"
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
                          d="m15 19-7-7 7-7"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      2
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 flex h-8 items-center justify-center border border-gray-300 bg-gray-100 px-3 leading-tight text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      3
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-4 w-4 rtl:rotate-180"
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
                          d="m9 5 7 7-7 7"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>
      )}

      {/* Integrate OrderDetails Modal */}
      {selectedOrder && (
     <OrderDetails isOpen={isModalOpen} closeModal={closeModal} selectedOrder={selectedOrder} orders={orders}/>

      )}

      <ToastContainer />
    </div>
  );
};

export default OrderTracking;
