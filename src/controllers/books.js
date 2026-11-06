import { getBody, validateBook } from '../validation.js';
import { sendServerError } from '../responses.js';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
} from '../models/books.js';

const DUPLICATE_KEY_ERROR = 11000;
const UNKNOWN_AUTHOR_MESSAGE = 'authorId does not match an existing author';

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    return sendServerError(res, 'retrieve books', error);
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return sendServerError(res, 'retrieve book', error);
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { error, data } = validateBook(getBody(req), { requireId: true });

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!(await authorExists(data.authorId))) {
      return res.status(400).json({ message: UNKNOWN_AUTHOR_MESSAGE });
    }

    if (await getBookById(data.id)) {
      return res.status(409).json({ message: 'A book with that id already exists' });
    }

    const createdBook = await createBook(data);
    return res.status(201).json(createdBook);
  } catch (error) {
    if (error.code === DUPLICATE_KEY_ERROR) {
      return res.status(409).json({ message: 'A book with that id already exists' });
    }

    return sendServerError(res, 'create book', error);
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { error, data } = validateBook(getBody(req), { requireId: false });

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!(await authorExists(data.authorId))) {
      return res.status(400).json({ message: UNKNOWN_AUTHOR_MESSAGE });
    }

    const { id } = req.params;
    const wasUpdated = await updateBook(id, data);

    if (!wasUpdated) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ id, ...data });
  } catch (error) {
    return sendServerError(res, 'update book', error);
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const wasDeleted = await deleteBook(req.params.id);

    if (!wasDeleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return sendServerError(res, 'delete book', error);
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};