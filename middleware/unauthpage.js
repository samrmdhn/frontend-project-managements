import cookies from "next-cookies";
import jwt_decode from "jwt-decode";

export default function unauthpage(ctx) {
  const cookie = cookies(ctx);
  const { token } = cookie;
  console.log(token);
  if (!token) {
    return ctx.res
      .writeHead(302, {
        Location: "/",
      })
      .end();
  }

  const decoded = jwt_decode(token);

  return { token, decoded };
}
