/** Safe JSON parse */
const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

/* --------------------------
   TOKEN HANDLING
--------------------------- */

export const saveToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

/* --------------------------
   USER HANDLING
--------------------------- */

export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  return safeParse(localStorage.getItem("user"));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

/* --------------------------
   CLEAR ALL
--------------------------- */

export const clearSession = () => {
  removeToken();
  removeUser();
};
