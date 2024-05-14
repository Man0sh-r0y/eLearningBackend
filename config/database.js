const mongoose = require('mongoose'); // importing mongoose library

require('dotenv').config(); // configuring dotenv to use .env file

// connecting to the database
function dbConnect(){
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true, // specifies whether to use the new MongoDB connection string parser
        useUnifiedTopology: true // indicates that Mongoose should use the new Unified Topology engine
    })
    .then(() => console.log("Database connected successfully"))
    .catch((error) => {
      console.log("Database connection failed");
      console.log(error.message); // displays the reason for a database connection failure
      process.exit(1); // script exits with a status code of 1 
    });
}

module.exports = dbConnect; // exporting the connect function
  