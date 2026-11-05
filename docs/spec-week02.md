## Feature 2: Author CRUD Operations

### Goal
Add an `authors` collection and support all CRUD operations for authors. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required, a whole number

Authors use custom string ids instead of MongoDB `_id` values for route parameters.

### Routes

#### GET /authors
Success: `200`, an array of author objects
Errors: `500` if an unexpected server or database error occurs

#### GET /authors/:id
Success: `200`, the matching author object
Errors: `404` if no author has that id; `500` for unexpected errors

#### POST /authors
Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1975
    }

Success: `201`, the created author object
Errors: `400` if a required field is missing or invalid; `400` if the `id` already exists; `500` for unexpected errors

#### PUT /authors/:id
Request body:

    {
      "name": "Updated Author Name",
      "birthYear": 1976
    }

Success: `200`, the updated author object
Errors: `400` if a required field is missing or invalid; `404` if no author has that id; `500` for unexpected errors

#### DELETE /authors/:id
Success: `204`, no response body
Errors:
- `409` if any book still references this author's `id`
- `404` if no author has that id
- `500` for unexpected errors

### Swagger Documentation
Swagger must document every author route, including request bodies.

### Deployment Expectations
Author routes must work locally and on Render, and be testable from the deployed `/api-docs`.