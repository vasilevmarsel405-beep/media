const COOKIE = "mars_admin";

export const adminCookieName = COOKIE;

const sameSite = process.env.NODE_ENV === "production" ? ("strict" as const) : ("lax" as const);

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
