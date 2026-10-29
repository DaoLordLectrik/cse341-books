import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ title: 1 })
    .toArray();
  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId }, { projection: { _id: 0 } });
  return book;
};

export { getAllBooks, getBookById };