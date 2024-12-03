const mongoose = require("mongoose")

require("dotenv").config();

    mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Database connection successfull");
    })
    .catch((error) => {
      console.error(error);
      console.log("Database connection error");
      process.exit(1);
    });
