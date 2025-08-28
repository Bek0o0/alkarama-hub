export const login = (role) => {
  localStorage.setItem("userRole", role);
};

export const logout = () => {
  localStorage.removeItem("userRole");
};

export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

export const isAdmin = () => getUserRole() === "admin";
export const isDiaspora = () => getUserRole() === "diaspora";
