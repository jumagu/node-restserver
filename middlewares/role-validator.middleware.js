export const roleValidator = (...roles) => {
  return (req, res, next) => {
    if (!req.authenticatedUser)
      return res.status(500).json({
        msg: "Internal server error",
      });

    if (!roles.includes(req.authenticatedUser.role))
      return res.status(401).json({
        msg: "You do not have privileges to perform this action",
      });

    next();
  };
};

/* export const roleValidator = (req, res, next) => {
  if (!req.authenticatedUser)
    return res.status(500).json({
      msg: "Internal server error",
    });

  const { role } = req.authenticatedUser;

  if (role !== "ADMIN")
    return res.status(401).json({
      msg: "You do not have privileges to perform this action",
    });

  next();
}; */
