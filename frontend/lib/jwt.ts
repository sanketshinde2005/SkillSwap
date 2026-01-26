export interface JwtPayload {
  sub: string;   // email
  role: "STUDENT" | "ADMIN";
  exp: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}
