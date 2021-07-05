require("dotenv").config();
// Frame work
const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");

// Database 
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Microservices Route
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

//initializing express
const shapeAI = express();

//configurations
shapeAI.use(express.json());

// Establish Databse connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => console.log("connection established !!!"));

// Initializing Microservices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);

shapeAI.listen(3000, () => console.log("Server is running!"));
