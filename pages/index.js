import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Router from "next/router";
import cookies from "next-cookies";

export async function getServerSideProps(ctx) {
  const allCookies = cookies(ctx);
  if (allCookies.token)
    return ctx.res
      .writeHead(302, {
        Location: "/dashboard",
      })
      .end();
  return {
    props: {
      data: "",
    },
  };
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const datas = await res.json();

      console.log(datas);

      console.log(datas.token);

      if (datas.token) {
        Cookie.set("token", datas.token, { expires: 1 });
        Router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Login</h3>
      {errorText.message}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
