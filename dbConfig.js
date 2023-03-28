const mongoose = require("mongoose");
module.exports = async () => {
  try {
    const connection = await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
