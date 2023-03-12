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
      success_url: `${DOMAIN}?success=true`,
      cancel_url: `${DOMAIN}?canceled=true`,
    });
    return session.url;
  },

  handlePostTransaction: async function (userId, data) {
    console.log("webhook");
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      upsert: true,
    });
    return user;
  },
};
