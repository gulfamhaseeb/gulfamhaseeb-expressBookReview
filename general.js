const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = async () => books;
    let response = await getBooks();
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({message: "Book not found"});
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json(err));
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve) => {
        let booksByAuthor = [];
        for (let isbn in books) {
          if (books[isbn].author === author) {
            booksByAuthor.push({
              "isbn": isbn,
              "author": books[isbn].author,
              "title": books[isbn].title,
              "reviews": books[isbn].reviews
            });
          }
        }
        resolve(booksByAuthor);
      });
    };
    let result = await getBooksByAuthor();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve) => {
    let booksByTitle = [];
    for (let isbn in books) {
      if (books[isbn].title === title) {
        booksByTitle.push({
          "isbn": isbn,
          "title": books[isbn].title,
          "author": books[isbn].author,
          "reviews": books[isbn].reviews
        });
      }
    }
    resolve(booksByTitle);
  })
  .then((result) => res.status(200).json(result))
  .catch((err) => res.status(500).json({message: "Error fetching books by title"}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
