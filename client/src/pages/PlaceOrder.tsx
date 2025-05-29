import { useLocation, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { useForm } from "react-hook-form";
import SuccessBox from "../components/SuccessBox";
import { useState } from "react";

export type OrderStatus = "Pending" | "Delivered" | "Cancelled";

interface PreOrder {
  _id?: string;
  customer: {
    name: string;
    email: string;
    mobileNumber: string;
    address: string;
  };

  productId: string;
}

interface OrderForm {
  name: string;
  email: string;
  mobile: string;
  address: string;
}

const PlaceOrder = () => {
  const { state } = useLocation();
  const { addOrder } = useOrders();
  const product = state?.product;
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderForm>();

  const onSubmit = async (form: OrderForm) => {
    const order: PreOrder = {
      customer: {
        name: form.name,
        email: form.email,
        mobileNumber: form.mobile,
        address: form.address,
      },
      productId: product?._id,
    };

    const data = await addOrder(order);

    if (data) {
      setShowSuccess(true);
    } else alert("❌ Failed to place order.");
  };

  const hideSuccess = () => {
    setShowSuccess(false);
    navigate("/products");
  };

  if (!product)
    return (
      <div className="text-center text-gray-600 mt-10">No product selected</div>
    );

  return (
    <>
      <div className="flex justify-center h-full w-full items-center">
        <div className="bg-white max-w-2xl m-auto p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col w-full items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-xl mb-4 shadow"
            />
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <span className="text-xl font-semibold text-green-600">
              &#x20B9;{product.price}/-
            </span>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col bg-white p-8 rounded-lg shadow-xl w-80 gap-4">
            <div>
              <label className="font-semibold" htmlFor="name">
                Name
              </label>
              <input
                type="name"
                placeholder="Enter name"
                className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                {...register("name", { required: "Email is required" })}
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm mb-4">{errors.name.message}</p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mb-4">
                {errors.email.message}
              </p>
            )}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="mobile">
                Mobile
              </label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                {...register("mobile", {
                  pattern: {
                    value: /^[6-9][0-9]{9}$/,
                    message:
                      "Phone number must be exactly 10 digits and start with 6–9",
                  },
                })}
              />
            </div>
            {errors.mobile && (
              <p className="text-red-600 text-sm mb-4">
                {errors.mobile.message}
              </p>
            )}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="address">
                Address
              </label>
              <textarea
                placeholder="Enter address"
                rows={3}
                className="w-full font-outfit bg-white border border-gray-300 rounded-lg p-2 outline-0"
                {...register("address", {
                  maxLength: {
                    value: 255,
                    message: "Address cannot exceed 255 characters",
                  },
                })}
              />
            </div>
            {errors.address && (
              <p className="text-red-600 text-sm mb-4">
                {errors.address.message}
              </p>
            )}

            <button
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 shadow-lg">
              {isSubmitting ? "Placing Order in..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
      {showSuccess && (
        <SuccessBox
          message={"Order Placed Successfully"}
          onClose={hideSuccess}
        />
      )}
    </>
  );
};

export default PlaceOrder;
