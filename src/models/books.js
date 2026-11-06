import { getDb } from '../db/connect.js';

const WITHOUT_MONGO_ID = { projection: { _id: 0 } };

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}, WITHOUT_MONGO_ID).sort({ title: 1 }).toArray();

  return books;
};

const getBookById = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id }, WITHOUT_MONGO_ID);

  return book;
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');

  // insertOne adds _id to the object it receives, so insert a copy.
  await collection.insertOne({ ...book });

  return book;
};

const updateBook = async (id, fields) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.updateOne({ id }, { $set: fields });

  return result.matchedCount > 0;
};

const deleteBook = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id });

  return result.deletedCount > 0;
};

const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const count = await collection.countDocuments({ id: authorId }, { limit: 1 });

  return count > 0;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook, authorExists };