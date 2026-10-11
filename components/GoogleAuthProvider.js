"use client";

/** Раньше оборачивал GoogleOAuthProvider; вход теперь через redirect. */
export function GoogleAuthProvider({ children }) {
  return children;
}
