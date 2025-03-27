const authorisedRoles = (...authorisedRoles) => {
  return (req, res, next) => {
    if (!authorisedRoles.includes(req.user.role)) {
      throw new Error("Access denied.");
    }
    next();
  };
};

module.exports = { authorisedRoles };
