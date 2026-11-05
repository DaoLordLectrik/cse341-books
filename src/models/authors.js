import { getDb } from '../db/connect.js';

const WITHOUT_MONGO_ID = { projection: { _id: 0 } };

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}, WITHOUT_MONGO_ID).sort({ name: 1 }).toArray();

  return authors;
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id }, WITHOUT_MONGO_ID);

  return author;
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');

  // insertOne adds _id to the object it receives, so insert a copy.
  await collection.insertOne({ ...author });

  return author;
};

const updateAuthor = async (id, fields) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.updateOne({ id }, { $set: fields });

  return result.matchedCount > 0;
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.deleteOne({ id });

  return result.deletedCount > 0;
};

const authorHasBooks = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const count = await collection.countDocuments({ authorId: id }, { limit: 1 });

  return count > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
};