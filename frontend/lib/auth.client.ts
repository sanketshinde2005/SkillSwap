"use client";

import { API_BASE_URL } from "./api";
import { decodeJwt } from "./jwt";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  const token = data.token;
  if (!token) throw new Error("Token missing");

  localStorage.setItem("token", token);

  const decoded = decodeJwt(token);
  if (!decoded) throw new Error("Invalid token");

  return decoded;
}

export function logout() {
  localStorage.removeItem("token");
}
