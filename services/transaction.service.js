const { Types } = require("mongoose");
const User = require("../models/userModel");

const stripe = require("stripe")(process.env.STRIPE_PUBLIC_API_KEY);

const DOMAIN = "http://localhost:3000";

exports.TransactionService = {
  createTransaction: async function (data) {
    const session = await stripe.checkout.sessions.create({
      // line_items: [
      //   {
      //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
      //     price: "{{PRICE_ID}}",
      //     quantity: 1,
      //   },
      // ],
      line_items: data,
      mode: "payment",
      success_url: `${DOMAIN}`,
      cancel_url: `${DOMAIN}`,
    });
    return session.url;
  },

  handlePostTransaction: async function (event) {
    // const paymentIntent = event.data.object.payment_intent;
    // console.log("paymentIntent: ", paymentIntent);

    // Get payment intent id
    // paymentIntentId: string | Stripe.PaymentIntent (can be this type with expand parameter)
    let paymentIntentId = event.data.object.id;
    // Make this variable string to avoid Typescript Overload error
    paymentIntentId = String(paymentIntentId);
    console.log("paymentIntentId: ", event.data.object);

    const productOrderedDetails = await stripe.checkout.sessions.listLineItems(
      paymentIntentId
    );

    console.log(
      "productOrderedDetails: ",
      JSON.stringify(productOrderedDetails)
    );

    return productOrderedDetails;
  },
};
