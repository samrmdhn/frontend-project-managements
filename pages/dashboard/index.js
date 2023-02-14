import Cookie from "js-cookie";import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import cookies from "next-cookies";
import jwt_decode from "jwt-decode";
import { Box, Grid } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

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
  const { username, role } = decoded;
  //console.log(token);

  const handleLogout = () => {
    Cookie.remove("token");
    Router.replace("/");
  };

  return (
    <div>
      <Navbar role={role} />
      <Grid container p={3}>
        <Grid item md={1.5}>
          <Box sx={{ height: "80vh", backgroundColor: "blue" }}>
            <Sidebar />
          </Box>
        </Grid>
        <Grid item md={10}>
          g
        </Grid>
      </Grid>

      <div>Welcome, {username}</div>

      <p>This is dashboard</p>

      {role === "admin" && (
        <div>
          <button>Create token</button>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
