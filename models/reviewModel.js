
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    isBanned: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    bannedUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    isUserBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ createdAt: -1 });

const Reviews = mongoose.model("Reviews", reviewSchema);

module.exports = Reviews;
