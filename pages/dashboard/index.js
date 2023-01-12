import Cookie from "js-cookie";import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import cookies from "next-cookies";
import jwt_decode from "jwt-decode";
import { Box, Grid } from "@mui/material";

export async function getServerSideProps(ctx) {
  const allCookies = cookies(ctx);
  const token = allCookies.token;
  if (!allCookies.token)
    return ctx.res
      .writeHead(302, {
        Location: "/",
      })
      .end();
  return {
    props: {
      token,
    },
  };
}

export default function Dashboard({ token }) {
  const decoded = jwt_decode(token);
  //  console.log(decoded);
  const { username } = decoded;
  //console.log(token);

  const { query } = useRouter();

  const { client } = query;

  if (client) {
    console.log(client);
    const getData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/project/search?client=${client}`,
          {
            method: "GET",
          }
        );
        const data = res.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }

  const handleLogout = () => {
    Cookie.remove("token");
    Router.replace("/");
  };

  const getDatas = async () => {
    const tokens = Cookie.get("token");

    try {
      const res = await fetch("http://localhost:3001/projects", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + tokens,
        },
      });
      const datas = await res.json();
      // console.log(datas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item md="2">
          f
        </Grid>
        <Grid item md="9">
          g
        </Grid>
      </Grid>
      <div>Welcome, {username}</div>

      <p>This is dashboard</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
