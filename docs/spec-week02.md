# Books and Authors API Week 02 Spec - Version 2

## Overview
Extend the Week 01 Books API with full CRUD for books, a new `authors` collection with full CRUD, and a reference from each book to its author. Every route must be documented in Swagger at `/api-docs` and testable from the browser, locally and on Render.

Implementation order: authors first, then books, because creating or updating a book checks that its author exists.

## Conventions (apply to every route)

### Ids
Books use custom string ids such as `b1`. Authors use custom string ids such as `a1`. Route parameters use these custom ids, never MongoDB `_id`.

### Response shape
- MongoDB's `_id` is never returned.
- Only the documented fields are returned or stored. Any other fields in a request body are ignored.
- List routes return `200` with `[]` when the collection is empty.
- List routes are sorted: books by `title` ascending, authors by `name` ascending.

### Error response format
All errors return JSON in this shape, with no stack traces and no database error text:

```json
{
  "message": "Short description of the problem"
}
```

- Unexpected failures return `500` with `{ "message": "Internal server error" }`. Details are logged on the server only.
- A request body that is not valid JSON returns `400` with `{ "message": "Invalid JSON" }`.

### Status code rules
- `400`: missing, invalid, or wrongly typed input, including an `authorId` that does not match an existing author.
- `404`: the id in the URL does not match an existing document.
- `409`: the request conflicts with existing data (duplicate `id`, or deleting an author who still has books).
- `500`: unexpected server or database error.

### Validation rules
- String fields must be strings (not objects, arrays, numbers, or booleans), non-empty after trimming, and at most 200 characters.
- `publicationDate` must be a real calendar date in `YYYY-MM-DD` format.
- `birthYear` must be a whole number from 1 through the current year.
- Validation happens in the controller before any database call.

### Database
- Database: `cse341-books-db`.
- Collections: `books` and `authors`.
- A unique index on `id` in both collections, so duplicate ids are rejected even if two requests arrive at the same time. A duplicate-key error is returned as `409`.
- An index on `authorId` in `books`, so checking whether an author still has books is not a full scan.
- Connection settings come from environment variables only.

## Feature 1: Book CRUD Operations and Author References

### Data Model
Documents in the `books` collection:

| Field | Type | Rules |
|---|---|---|
| `id` | string | required, unique, custom id such as `b1` |
| `authorId` | string | required, must match the `id` of an existing author |
| `title` | string | required |
| `publicationDate` | string | required, `YYYY-MM-DD` |

### GET /books
Returns all books, sorted by `title` ascending.

- `200`: array of book objects
- `500`: unexpected error

```json
[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  }
]
```

### GET /books/:id
Returns one book.

- `200`: the book object
- `404`: no book with that id (`{ "message": "Book not found" }`)
- `500`: unexpected error

### POST /books
Creates a book. All four fields are required.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

- `201`: the created book object
- `400`: a required field is missing or invalid (`{ "message": "id, authorId, title, and publicationDate are required" }`)
- `400`: `authorId` does not match an existing author (`{ "message": "authorId does not match an existing author" }`)
- `409`: a book with that `id` already exists (`{ "message": "A book with that id already exists" }`)
- `500`: unexpected error

### PUT /books/:id
Updates an existing book. The URL id identifies the book, and the id itself never changes: an `id` in the request body is ignored. `authorId`, `title`, and `publicationDate` are all required, because PUT replaces them.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

- `200`: the updated book object
- `400`: a required field is missing or invalid
- `400`: `authorId` does not match an existing author
- `404`: no book with that id
- `500`: unexpected error

### DELETE /books/:id
Deletes a book.

- `204`: no response body
- `404`: no book with that id
- `500`: unexpected error

## Feature 2: Author CRUD Operations

### Data Model
Documents in the `authors` collection:

| Field | Type | Rules |
|---|---|---|
| `id` | string | required, unique, custom id such as `a1` |
| `name` | string | required |
| `birthYear` | number | required, whole number |

### GET /authors
Returns all authors, sorted by `name` ascending.

- `200`: array of author objects
- `500`: unexpected error

```json
[
  {
    "id": "a1",
    "name": "Maya Rivera",
    "birthYear": 1978
  }
]
```

### GET /authors/:id
Returns one author.

- `200`: the author object
- `404`: no author with that id (`{ "message": "Author not found" }`)
- `500`: unexpected error

### POST /authors
Creates an author. All three fields are required.

Request body:

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1975
}
```

- `201`: the created author object
- `400`: a required field is missing or invalid
- `409`: an author with that `id` already exists
- `500`: unexpected error

### PUT /authors/:id
Updates an existing author. An `id` in the request body is ignored. `name` and `birthYear` are both required.

Request body:

```json
{
  "name": "Updated Author Name",
  "birthYear": 1976
}
```

- `200`: the updated author object
- `400`: a required field is missing or invalid
- `404`: no author with that id
- `500`: unexpected error

### DELETE /authors/:id
Deletes an author, only if no book references them.

- `204`: no response body
- `404`: no author with that id
- `409`: at least one book still has this author's `id` as its `authorId` (`{ "message": "Author still has books and cannot be deleted" }`). The author is not deleted.
- `500`: unexpected error

## Swagger Documentation
- Every route above has an OpenAPI comment, tagged `Books` or `Authors`.
- Every `:id` parameter is documented as `{id}` with a string path parameter.
- Every `POST` and `PUT` route has a `requestBody` section with an example matching the bodies above.
- Every status code listed in this spec is documented for its route, and the comments match what the controllers actually return.
- `swagger.json` is regenerated with `npm run swagger` after every route change, and the generated file is committed.

## Deployment Expectations
- All routes work locally and on Render.
- The deployed `/api-docs` page lets someone test every book and author route from the browser.
- Atlas allows connections from Render's outbound IP ranges.

## Seed Data
- Create the `authors` collection with at least three authors (`a1` to `a3`).
- Update the existing books so each has a valid `authorId` and no longer has the old `author` text field.

## Out of Scope for Week 2
- Authentication and authorization
- Pagination and filtering
- `PATCH` routes
- `$lookup` joins or embedding author details inside book responses