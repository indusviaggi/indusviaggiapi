export const sendSuccess = (res: any, data: any = {}, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: any, error: any, status = 500) => {
  return res.status(status).json({
    success: false,
    message: error.message || "Internal Server Error",
    error: error.errors || undefined,
  });
};