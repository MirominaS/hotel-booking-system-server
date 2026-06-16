export const authorize =
  (...roles) =>
  (req, res, next) => {
    console.log("Allowed Roles:", roles);
    console.log("User Role:", req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  };
