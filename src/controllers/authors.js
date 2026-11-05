import { getBody, validateAuthor } from '../validation.js';
import { sendServerError } from '../responses.js';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
} from '../models/authors.js';

const DUPLICATE_KEY_ERROR = 11000;

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    return sendServerError(res, 'retrieve authors', error);
  }
};

const getAuthorByIdHandler = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return sendServerError(res, 'retrieve author', error);
  }
};

const createAuthorHandler = async (req, res) => {
  try {
    const { error, data } = validateAuthor(getBody(req), { requireId: true });

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (await getAuthorById(data.id)) {
      return res.status(409).json({ message: 'An author with that id already exists' });
    }

    const createdAuthor = await createAuthor(data);
    return res.status(201).json(createdAuthor);
  } catch (error) {
    if (error.code === DUPLICATE_KEY_ERROR) {
      return res.status(409).json({ message: 'An author with that id already exists' });
    }

    return sendServerError(res, 'create author', error);
  }
};

const updateAuthorHandler = async (req, res) => {
  try {
    const { error, data } = validateAuthor(getBody(req), { requireId: false });

    if (error) {
      return res.status(400).json({ message: error });
    }

    const { id } = req.params;
    const wasUpdated = await updateAuthor(id, data);

    if (!wasUpdated) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json({ id, ...data });
  } catch (error) {
    return sendServerError(res, 'update author', error);
  }
};

const deleteAuthorHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!(await getAuthorById(id))) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (await authorHasBooks(id)) {
      return res.status(409).json({ message: 'Author still has books and cannot be deleted' });
    }

    await deleteAuthor(id);
    return res.status(204).send();
  } catch (error) {
    return sendServerError(res, 'delete author', error);
  }
};

export {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
};