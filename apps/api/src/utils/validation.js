// Simple validation utilities

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Minimum 6 characters
  return password && password.length >= 6;
};

const validateName = (name) => {
  // Name should be at least 2 characters and only contain letters and spaces
  return name && name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName
};