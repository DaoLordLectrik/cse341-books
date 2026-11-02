# cse341-books

A read-only Books web service built with Node.js, Express, and MongoDB.

Live service: https://cse341-books-8q7f.onrender.com

## Endpoints

- `GET /` returns a JSON message confirming the server is running.
- `GET /books` returns all books, sorted by title.
- `GET /books/:id` returns one book, or a 404 if it isn't found.