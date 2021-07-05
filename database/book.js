const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 16,
    },
    title: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,
});

// Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;