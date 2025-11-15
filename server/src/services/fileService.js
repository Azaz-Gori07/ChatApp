export const validateBase64 = (image) => {
  if (!image.startsWith("data:image"))
    return false;

  return true;
};
