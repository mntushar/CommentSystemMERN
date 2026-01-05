import mongoose from "mongoose";

export function validateObjectId(paramName) {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!mongoose.isValidObjectId(value))
      return res.status(400).json({ message: "Invalid id" });
    next();
  };
}
