// client/src/apiBase.js
const hosted =
  typeof window !== "undefined" && /netlify\.app$/.test(window.location.hostname);

// If REACT_APP_API is set (in Netlify env), use that.
// Else: if on Netlify and no env var, hardcode your Render URL here temporarily.
// Else (local dev): use localhost:5000.
export const API_BASE =
  process.env.REACT_APP_API ||
  (hosted ? "https://YOUR-RENDER-URL.onrender.com" : "http://localhost:5000");
