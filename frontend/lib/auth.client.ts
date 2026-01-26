"use client";

import api from "./api";
import { decodeJwt } from "./jwt";

export async function login(email: string, password: string) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  const token = response.data.token;
  if (!token) throw new Error("Token missing");

  localStorage.setItem("token", token);

  const decoded = decodeJwt(token);
  if (!decoded) throw new Error("Invalid token");

  return decoded;
}

export function logout() {
  localStorage.removeItem("token");
}
