const Router = require("express").Router();

const PublicationModel = require("../../database/publication")
/*
Route         /publication/update/book
Description   update publication
Access        PUBLIC
Parameters    isbn
Method        PUT
*/
Router.put("/update/book/:isbn", (req, res) => {
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
Route         /publication/delete/book
Description   delete a book from publication
Access        PUBLIC
Parameters    isbn, publication id
Method        DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", (req, res) => {
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

module.exports = Router;