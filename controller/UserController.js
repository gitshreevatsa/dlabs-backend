const User = require("../Models/UserProfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ethers = require("ethers");

// @route   POST api/users
// @desc    Register a user
// @access  Public

exports.registerUser = async (req, res) => {
  // Destructure the name and email from the request body
  const { firstName, lastName, email, password } = req.body;
  // Check if the user already exists in the database.
  try {
    let user = await User.findOne({ email });
    if (user) {
      res
        .status(400)
        .json({
          msg: "User already exists",
          walletAddress: user.walletAddress,
        });
    }
    // If the user does not exist, create a new user.
    const wallet = new ethers.Wallet.createRandom(
      new ethers.AnkrProvider("https://rpc.ankr.com/polygon")
    );
    user = new User({
      firstName,
      lastName,
      email,
      password,
      walletAddress: wallet.address,
    });

    //NODE MAILER
    // Encrypt the password using bcrypt.
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    // Return the user object with the password hashed.
    const payload = {
      user: {
        id: user.id,
      },
    };
    // Create a JWT token using the payload and the secret key.
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/users
// @desc    Get all users
// @access  Public
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/users/:id
// @desc    Get a user by id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Public
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Update the user object with the new values.
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Public
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    await user.remove();
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// PAGES:
/**
 * User registration
 * Organisation registration
 * Event creation
 * Ticket buying
 * Primary marketplace
 * Secondary marketplace
 * DASHBOARD
 * Profile Page
 */

/**
 * USER PROCESS:
 * USER -> Login Page -> Biconomy/Metamask -> User registration (Store privateKey if Biconomy)
 * Primary Marketplace -> Has all events that are registered by Organisations -> User can click any event ->
 * Ticket Buying -> Info about the event -> Buy tickets -> Updating user profile with event he just bought tickets for and increasing his ticket count as well totalEvents attending -> Updating eventModel with userIDs to map them to users and details

 * Secondary Marketplace :
 * Secondary Marketplace -> User can come and put up a ticket to marketplace , provides their UPI ID ->(Listing the ticket) if metamask then user signs else sign directly from backend using the mapped private key
 * (Buying the Ticket) -> Pay through a INR payment gateway -> Listen to it and frontend calls the backend to transfer the nft ticket to address connected -> initiate a transfer of fund between the given owner UPI address and the buyer UPI address(SKEPTICAL , NEED TO EXPLORE IF THIS EXIST) -> transfer NFT ticket from our escrow marketplace to the buyer address taken from frontend

 * Profile Page -> User can see all the events he has attended and the tickets he has bought

 * ORGANISATION PROCESS:
 * Organisation -> Login Page -> Biconomy/Metamask -> Organisation registration (Store privateKey if Biconomy)
 * Event Creation -> Form -> Store the event in the event model -> Store the eventID in the organisation model
 * Dashboard -> Organisation can see all the events he has created and the tickets sold for each event with users non private data mapped to the list of buyers
 */

/**
 * REST :
 * CREATE
 * GET
 * UPDATE
 * DELETE
 */
