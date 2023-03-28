const Event = require("../Models/EventModel");
const User = require("../Models/UserProfile");

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventID: req.params.id });
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createEvent = async (req, res, next) => {
  const userPermissions = await User.findOne({ userId: req.body.userId });
  if (userPermissions.userType !== "partner") {
    res.status(400).json({ success: false, data: "User is not a partner" });
  }
  await Event.create(req.body);

  res.status(201).json({ success: true, data: req.body });
};

exports.updateEvent = async (req, res, next) => {
  const event = await Event.findOne({ eventID: req.params.id });
  const user = await User.findOne({ userId: req.body.userId });

  if (!event) {
    res.status(404).json({ msg: "Event not found" });
  }
  if (!user) {
    res.status(404).json({ msg: "User not found" });
  }
  if (event.createdBy !== user._id) {
    res.status(404).json({ msg: "User is not the creator of this event" });
  }

  await event.update(req.body);
  res.status(200).json("Event updated", event);
};

exports.deleteEvent = async (req, res, next) => {

  const event = await Event.findOne({ eventID: req.params.id });
  const user = await User.findOne({ userId: req.body.userId });

  if (!event) {
    res.status(404).json({ msg: "Event not found" });
  }
  if (!user) {
    res.status(404).json({ msg: "User not found" });
  }
  if (event.createdBy !== user._id) {
    res.status(404).json({ msg: "User is not the creator of this event" });
  }
  await event.delete();
  res.status(200).json("Event deleted", event);
};
