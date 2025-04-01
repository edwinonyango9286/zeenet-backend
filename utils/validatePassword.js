const validatePassword = (password) => {
  password = password.trim();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must have a mix of upper and lowercase letters, at least one number and a special character."
    );
  }
  return true;
};

module.exports = validatePassword;
