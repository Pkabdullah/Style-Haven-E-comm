import mongoose, { Schema } from "mongoose";

const signupModel = new mongoose.Schema(
  {
    FullName: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const UserSignup =
  mongoose.models.auths || mongoose.model("auths", signupModel);

//////// contact us ///////////
const suggestionmodel = new mongoose.Schema(
  {
    Email: String,
    Name: String,
    Suggestion: String,
  },
  { timestamps: true }
);
export const Suggestion =
  mongoose.models.suggest || mongoose.model("suggest", suggestionmodel);

/// cart schema
const CartSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auths",
    required: true,
  },
});

export const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", CartSchema);

// order schema//

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auths",
      required: true,
    },
    customerDetails: {
      FullName: { type: String, required: true },

      email: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipcode: {
        type: Number,
        required: true,
      },
    },
    items: [
      {
        productName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days delivery time
    },
  },
  {
    timestamps: true,
  }
);

export const OrderDetails =
  mongoose.models.order || mongoose.model("order", orderSchema);
