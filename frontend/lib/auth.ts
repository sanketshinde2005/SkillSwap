import { API_BASE_URL } from "./api";
import { decodeJwt } from "./jwt";

/**
 * LOGIN
 */
export async function login(email: string, password: string) {
  console.log("LOGIN FUNCTION CALLED");

  if (typeof window === "undefined") {
    console.error("LOGIN RUNNING ON SERVER ❌");
    throw new Error("Login must run on client");
  }

  console.log("LOGIN RUNNING ON CLIENT ✅");

  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const response = await res.json();

  console.log("LOGIN RESPONSE:", response);

  const token = response.token;

  console.log("TOKEN BEFORE SAVE:", token);

  localStorage.setItem("token", token);

  console.log("TOKEN AFTER SAVE:", localStorage.getItem("token"));

  return token;
}

/**
 * LOGOUT
 */
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

/**
 * AUTH HELPERS
 */
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("token"));
}

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = decodeJwt(token);
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}

export function getUserRole(): "STUDENT" | "ADMIN" | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = decodeJwt(token);
    return payload?.role ?? null;
  } catch {
    return null;
  }
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: "STUDENT" }),
  });
  return res.json();
}
