const sendServerError = (res, action, error) => {
  console.error(`Failed to ${action}:`, error.message);
  return res.status(500).json({ message: 'Internal server error' });
};

export { sendServerError };