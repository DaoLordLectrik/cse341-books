const MAX_LENGTH = 200;

const isMissing = (value) => {
  return value === undefined || value === null;
};

const isValidString = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_LENGTH;
};

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isValidBirthYear = (value) => {
  return Number.isInteger(value) && value >= 1 && value <= new Date().getFullYear();
};

const getBody = (req) => {
  const { body } = req;

  if (body && typeof body === 'object' && !Array.isArray(body)) {
    return body;
  }

  return {};
};

const joinFields = (fields) => {
  if (fields.length < 3) {
    return fields.join(' and ');
  }

  return `${fields.slice(0, -1).join(', ')}, and ${fields[fields.length - 1]}`;
};

const validateAuthor = (body, { requireId }) => {
  const fields = requireId ? ['id', 'name', 'birthYear'] : ['name', 'birthYear'];

  const hasMissingField = fields.some((field) => {
    return isMissing(body[field]);
  });

  if (hasMissingField) {
    return { error: `${joinFields(fields)} are required` };
  }

  const badString = fields
    .filter((field) => {
      return field !== 'birthYear';
    })
    .find((field) => {
      return !isValidString(body[field]);
    });

  if (badString) {
    return { error: `${badString} must be a non-empty string of at most ${MAX_LENGTH} characters` };
  }

  if (!isValidBirthYear(body.birthYear)) {
    return { error: 'birthYear must be a whole number from 1 through the current year' };
  }

  const data = {};

  if (requireId) {
    data.id = body.id.trim();
  }

  data.name = body.name.trim();
  data.birthYear = body.birthYear;

  return { data };
};

const validateBook = (body, { requireId }) => {
  const fields = requireId
    ? ['id', 'authorId', 'title', 'publicationDate']
    : ['authorId', 'title', 'publicationDate'];

  const hasMissingField = fields.some((field) => {
    return isMissing(body[field]);
  });

  if (hasMissingField) {
    return { error: `${joinFields(fields)} are required` };
  }

  const badString = fields
    .filter((field) => {
      return field !== 'publicationDate';
    })
    .find((field) => {
      return !isValidString(body[field]);
    });

  if (badString) {
    return { error: `${badString} must be a non-empty string of at most ${MAX_LENGTH} characters` };
  }

  if (!isValidDate(body.publicationDate)) {
    return { error: 'publicationDate must be a valid date in YYYY-MM-DD format' };
  }

  const data = {};

  if (requireId) {
    data.id = body.id.trim();
  }

  data.authorId = body.authorId.trim();
  data.title = body.title.trim();
  data.publicationDate = body.publicationDate;

  return { data };
};

export { getBody, validateAuthor, validateBook };