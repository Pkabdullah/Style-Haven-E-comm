import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(request) {
  const body = await request.json();
  console.log("stripe body", body);

  try {
    if (body.length > 0) {
      // Corrected typo in 'length'
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [{ shipping_rate: "shr_1Pt9ULP2qWLog7s5h8a5JlYf" }],
        line_items: body.map((item) => {
          return {
            price_data: {
              currency: "pkr",
              product_data: {
                name: item.productName,
                images: [ item.imageUrl], // 'images' should be an array
              },
              unit_amount: item.price * 100,
            },
            quantity: 1,
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 10,
            },
          };
        }),
        phone_number_collection: {
          enabled: true,
        },
        mode: "payment",
        success_url: `${request.headers.get("origin")}/?success=true`,
        cancel_url: `${request.headers.get("origin")}/?canceled=true`,
      });
      return NextResponse.json({ session });
    } else {
      return NextResponse.json({ message: "No data here!" });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }); // Added 'error' key for consistency
  }
}
