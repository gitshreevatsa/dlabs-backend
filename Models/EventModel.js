const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    totalTickets: {
      type: Number,
    },
    ticketsSold: {
      type: Number,
    },
    ticketsLeft: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    contractAddress: {
      type: String,
    },
    eventOpen: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
