
const { response } = require("express");
const express = require("express");

// Database 
const database = require("./database/index");

//initializing express
const shapeAI = express();

//configurations
shapeAI.use(express.json());

/*
Route         /
Description   get all books
Access        PUBLIC
Parameters    NONE
Method        GET
*/
shapeAI.get("/", (req, res) => {
    return res.json({books: database.books});
});

/*
Route         /
Description   get specific book based on ISBN
Access        PUBLIC
Parameters    isbn
Method        GET
*/
shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    };
    return res.json({book: getSpecificBook});
});

/*
Route         /c
Description   get specific books on category
Access        PUBLIC
Parameters    category
Method        GET
*/
shapeAI.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category)
        );

    if(getSpecificBooks.length === 0) {
        return res.json({
            error: `No book found for the ISBN of ${req.params.category}`})
    };
    return res.json({book: getSpecificBooks});
});

/*
Route         /a
Description   get all authors
Access        PUBLIC
Parameters    NONE
Method        GET
*/
shapeAI.get("/:author", (req, res) => {
    return res.json({authors: database.authors});
});

/*
Route         /author
Description   get list of all authors based on book's ISBN
Access        PUBLIC
Parameters    isbn
Method        GET
*/
shapeAI.get("/author/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) =>
     author.books.includes(req.params.isbn)
     );
     if(getSpecificAuthors.length === 0)
     {
         return res.json({
             error: `No author found for the book ${req.params.isbn}`
         });
     };
     return res.json({authors: getSpecificAuthors});
});

/*
Route         /book/new
Description   add new books
Access        PUBLIC
Parameters    NONE
Method        POST
*/
shapeAI.post("/book/new", (req, res) => {
    // request by body
    const {newBook} = req.body;
    database.books.push(newBook);
    return res.json({books: database.books, message: "book was added!"});
});

/*
Route         /author/new
Description   add new authir
Access        PUBLIC
Parameters    NONE
Method        POST
*/
shapeAI.post("/author/new", (req, res) => {
    const {newAuthor} = req.body;
    database.authors.push(newAuthor);
    return res.json({authors: database.authors, message: "author was added!"});
});

/*
Route         /book/update
Description   update title of a book
Access        PUBLIC
Parameters    isbn
Method        PUT
*/
shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({books: database.books});
});

/*
Route         /book/author/update/:isbn
Description   update/add new author
Access        PUBLIC
Parameters    isbn
Method        PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res) => {
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            return book.authors.push(req.body.newAuthor);
        }
    });
    //update author database
    database.authors.forEach((author) => {
        if(author.id === req.body.newAuthor) 
            return author.books.push(req.params.isbn);
    });
    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New author was added",
    });
});

/*
Route         /publication/update/book
Description   update publication
Access        PUBLIC
Parameters    isbn
Method        PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        } 
    });
    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully updated publication",
    });
});

/*
Route         /book/delete
Description   delete a book
Access        PUBLIC
Parameters    isbn
Method        DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter((book) => book.ISBN != req.params.isbn);
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});

/*
Route         /book/delete/author
Description   delete a author from a book
Access        PUBLIC
Parameters    isbn, author id
Method        DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId));
            book.authors = newAuthorList;
            return;
        }
    });
    //update author database
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter((book) => book !== req.params.isbn);
            author.books = newBookList;
            return; 
        } 
    });
    return res.json({
        book: database.books,
        auhtor: database.authors, 
        message: "author was deleted 👌!"
    });
});

/*
Route         /publication/delete/book
Description   delete a book from publication
Access        PUBLIC
Parameters    isbn, publication id
Method        DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    //update publication databse
    database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)) {
            const newBookList = publication.books.filter((book) => book !== req.params.isbn);
            publication.books = newBookList;
            return;
        }
    });
    //update book database
    database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
        book.publication = 0;
        return;
    }
   });
   return res.json({
       books: database.books,
       publications: database.publications,
   });
});

shapeAI.listen(3000, () => console.log("Server is running!"));
