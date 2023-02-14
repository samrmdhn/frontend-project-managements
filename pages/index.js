import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Router from "next/router";
import cookies from "next-cookies";
import Image from "next/image";
import { Button, Grid, TextField, Box, Typography, Alert } from "@mui/material";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation, EffectFade, Autoplay } from "swiper";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
  const [errorText, setErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    const result = await axios
      .post("http://localhost:3001/login", data)
      .then(function (response) {
        Cookie.set("token", response.data.token, { expires: 1 });
        Router.push("/dashboard");
      })
      .catch(function (error) {
        if (error.response?.data) {
          setErrorText(error.response.data.message);
        } else {
          setErrorText("Can't connect to server");
        }
      });
  };

  const greeting = () => {
    let myDate = new Date();
    let hrs = myDate.getHours();

    var greet;

    if (hrs < 12) {
      greet = "Good Morning";
    } else if (hrs >= 12 && hrs <= 17) {
      greet = "Good Afternoon";
    } else if (hrs >= 17 && hrs <= 24) {
      greet = "Good Evening";
    }

    return greet;
  };

  const datas = [
    {
      text: "Lorem Ipsum",
      bg: "/signin.jpg",
    },
    {
      text: "Lorem Ipsum 2",
      bg: "/signin2.jpg",
    },
    {
      text: "Lorem Ipsum 2",
      bg: "/signin3.jpg",
    },
  ];

  return (
    <div>
      <Grid container>
        <Grid item md={6} sm={12}>
          <Swiper
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[Navigation, EffectFade, Autoplay]}
            className="mySwiper"
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
          >
            {datas.map((data, index) => {
              return (
                <div key={index + Date.now()}>
                  <SwiperSlide key={index + Date.now()}>
                    <div
                      style={{
                        width: "100%",
                        height: "100vh",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          zIndex: "1",
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          opacity: "35%",
                          background:
                            "linear-gradient(to bottom, rgba(251,251,251,1), rgba(157,157,157,1),rgba(0,0,0,1),rgba(0,0,0,1))",
                        }}
                      ></Box>
                      <Image
                        alt="Background image"
                        src={data.bg}
                        fill
                        priority
                        objectFit="cover"
                        style={{ zIndex: 0 }}
                      />
                    </div>
                  </SwiperSlide>
                </div>
              );
            })}
          </Swiper>
        </Grid>
        <Grid
          item
          md={6}
          sm={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "400px",
              }}
            >
              <Box sx={{ marginBottom: "30px" }}>
                <Typography
                  sx={{
                    fontSize: "30px",
                    fontWeight: "bolder",
                  }}
                >
                  {greeting()}
                </Typography>

                <Typography sx={{ color: "grey" }}>
                  Welcome back! Please enter your details.
                </Typography>
              </Box>

              {errorText && (
                <>
                  {" "}
                  <Alert severity="error" sx={{ marginBottom: "20px" }}>
                    <Typography>{errorText}</Typography>
                  </Alert>
                </>
              )}

              <TextField
                size="small"
                placeholder="Email"
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: "20px" }}
              />

              <TextField
                size="small"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "20px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "30px",
                }}
              >
                <Box>
                  <label
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    <input type="checkbox" />
                    <Typography sx={{ color: "grey" }}>
                      Remember for 30 days
                    </Typography>
                  </label>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: "bolder" }}>
                    <a
                      style={{ textDecoration: "underline", color: "black" }}
                      href="#"
                    >
                      Forget Password?
                    </a>
                  </Typography>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  marginBottom: "30px",
                  ":hover": {
                    backgroundColor: "black",
                  },
                }}
              >
                Login
              </Button>

              <Typography sx={{ textAlign: "center", color: "grey" }}>
                Don't have an account?{" "}
                <span style={{ fontWeight: "bolder", color: "black" }}>
                  <a
                    href="#"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Sign up for free
                  </a>
                </span>
              </Typography>
            </Box>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}
