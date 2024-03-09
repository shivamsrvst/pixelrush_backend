const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
    },
    price: {
      type: "Number",
      required: true,
    },
    description: {
      type: "String",
      required:true
    },
    category: {
      type: "String",
      enum: ["Game", "Console"],
      required: true,
    },
    publisher: {
      type: "String",
    },
    imageUrl: {
      type: "String",
      required: true,
    },
    inStock: {
      type: "Boolean",
      default: true,
    },
    // For Games only
    genre: {
      type: "String",
      required: function () {
        return this.category === "Game";
      },
    },
    "R-rated": {
      type: "Boolean",
      required: function () {
        return this.category === "Game";
      },
    },
    // For Games and Consoles
    labels: {
      type: ["String"],
      enum: ["Top Selling", "Upcoming", "Classic"],
      default: [],
    },
    upcomingUrl: {
      type: String,
      // Conditionally required for Upcoming items
      required: function() {
        return this.category === "Game" && this.labels.includes("Upcoming");
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
