export const sendSuccess = (res, data, message = "Success") => {
  return res.json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = "Something went wrong", code = 500) => {
  return res.status(code).json({
    success: false,
    message,
  });
};
