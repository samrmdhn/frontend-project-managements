import Cookie from "js-cookie";
import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import cookies from "next-cookies";
import jwt_decode from "jwt-decode";
import { Box, Grid, Typography, Button } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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

      <Grid container>
        <Grid item md={2}>
          <Box
            height="100vh"
            bgcolor="#F6F4F5"
            alignItems="center"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box padding={5} textAlign="center">
              <Typography fontWeight="bolder">APP</Typography>
            </Box>
            <Box textAlign="center">
              <AccountCircleIcon fontSize="large" />
              <Box>
                <Typography>{username}</Typography>
              </Box>
              <Box>
                <Typography>{role.toUpperCase()}</Typography>
              </Box>
            </Box>
            <Box padding={5} textAlign="center">
              <Box marginBottom={3}>Dashboard</Box>
              <Box marginBottom={3}>Account</Box>
              <Box marginBottom={3}>Dashboard</Box>
            </Box>
            <Box padding={5}>
              <Button
                sx={{
                  color: "grey",
                  gap: "10px",
                  textTransform: "capitalize",
                  ":hover": {
                    backgroundColor: "unset",
                  },
                }}
                onClick={handleLogout}
              >
                <LogoutIcon />
                <Typography fontWeight="bolder">Logout</Typography>
              </Button>
              <Box display="flex" gap="10px" color="grey"></Box>
            </Box>
          </Box>
        </Grid>
        <Grid item md="10">
          ergerg
        </Grid>
      </Grid>
    </div>
  );
}
