export const isValidPasswordFormat = (str) =>
  str.match(/^(?=.*\d)(?=.*?[A-Z])(?=.*[a-zA-Z])(?=.*[\W_]).{10,}$/gm);

export const isValidPassword = (password) =>
  password && password.length > 0 && isValidPasswordFormat(password);
