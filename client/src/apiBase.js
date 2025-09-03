const hosted =
  typeof window !== "undefined" && /netlify\.app$/.test(window.location.hostname);


export const API_BASE =
  process.env.REACT_APP_API ||
  (hosted ? "https://YOUR-RENDER-URL.onrender.com" : "http://localhost:5000");
