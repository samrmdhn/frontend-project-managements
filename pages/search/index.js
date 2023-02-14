import { useRouter } from "next/router";
import unauthpage from "../../middleware/unauthpage";
import React, { useState, useEffect } from "react";
import axios from "axios";
import cookies from "next-cookies";
import Navbar from "../../components/Navbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, Pagination, TextField } from "@mui/material";
import Link from "next/link";

import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import Slider from "@mui/material/Slider";
import Sidebar from "../../components/Sidebar";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Search(props) {
  dayjs.extend(localizedFormat);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const router = useRouter();

  const [dataChart, setDataChart] = useState(props.projects.data);

  //PROPS SSR

  //PAGINATION
  const datas = props.datas.data;
  const datasLength = props.datas.length;
  const range = props.datas.range;

  //COMPANY INFO

  console.log(dataChart);

  const settingChart = {
    labels: dataChart.projects_of_company.map((project) => {
      return project.name;
    }),
    datasets: [
      {
        label: "# of Votes",
        data: dataChart.projects_of_company.map((project) => {
          return project._count.projects;
        }),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  //ROLE BASED ACCESS
  const { role } = props.DATA_JWT.decoded;

  // const [datas, setDatas] = useState([datas])

  const [nameProject, setNameProject] = useState("");
  const [company, setCompany] = useState("");
  const [page, setPage] = useState(Number(1));

  const [valueSlider, setValueSlider] = useState([100000000, 1000000000]);

  const projectHandler = (e) => {
    setNameProject(e.target.value);
  };

  const companyHandler = (e) => {
    setCompany(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { query } = router;

    if (nameProject === "" && query.project !== "") delete query.project;
    if (company === "" && query.company !== "") delete query.company;

    if (nameProject) query.project = nameProject;
    if (company) query.company = company;

    if (query.project) setNameProject(query.project);
    if (query.company) setCompany(query.company);

    query.minimum = valueSlider[0];
    query.maximum = valueSlider[1];

    if (query.page !== 1) {
      query.page = 1;
      setPage(Number(1));
    }

    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  const handleChange = (event, value) => {
    setPage(value);

    const { query } = router;

    if (query.project) setNameProject(query.project);

    query.page = value;

    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  const handleChangeSlider = (event, newValue) => {
    console.log(newValue);
    setValueSlider(newValue);
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  return (
    <div>
      <Navbar role={role} />
      <h3>Search page</h3>
      <div style={{ height: "400px", marginBottom: "20px" }}>
        <Doughnut data={settingChart} />;
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            width: "50%",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            type="text"
            placeholder="Name project"
            value={nameProject}
            onChange={projectHandler}
          />

          <TextField
            size="small"
            type="text"
            placeholder="Name Company"
            value={company}
            onChange={companyHandler}
          />

          <Slider
            sx={{ width: "20%" }}
            getAriaLabel={() => "Temperature range"}
            value={valueSlider}
            min={100000000}
            max={1000000000}
            marks={true}
            step={100000000}
            onChange={handleChangeSlider}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
          />

          <Button type="submit" variant="contained">
            Submit
          </Button>
        </div>
      </form>
      {datas.slice(0, 5).map((data, index) => {
        return (
          <div key={index}>
            <div style={{ marginBottom: "20px" }}>
              <div>{data.Company.name}</div>

              <Link href={`project/${data.id}`}>
                <div style={{ textDecoration: "none", fontWeight: "bolder" }}>
                  {data.name}
                </div>
              </Link>

              <div>{data.budget}</div>
              <div>{dayjs(data.project_start).format("ll")}</div>
              <div>{dayjs(data.project_end).format("ll")}</div>
              <div>
                {dayjs(data.project_end).diff(dayjs(data.project_start), "day")}{" "}
                days
              </div>
              <div>Users</div>
              <div>
                {data.users.map((user, index) => {
                  return (
                    <div key={index}>
                      <div>{user.username}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      <Stack spacing={2}>
        <Typography>Page: {page}</Typography>
        <Pagination
          count={Math.ceil(datasLength / 5)}
          color="primary"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />

        {range == null || undefined ? (
          <>
            <Typography>Items 1 - 5 of {datasLength}</Typography>
          </>
        ) : (
          <>
            <Typography>{range}</Typography>
          </>
        )}
      </Stack>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const DATA_JWT = unauthpage(ctx);

  console.log(DATA_JWT);

  const data = await axios
    .get(`http://localhost:3001/project/search`, {
      headers: {
        Authorization: "Bearer " + DATA_JWT.token,
      },
      params: ctx.query,
    })
    .then(function (response) {
      return response;
    });

  const project = await axios
    .get("http://localhost:3001/company", {
      headers: {
        Authorization: "Bearer " + DATA_JWT.token,
      },
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });

  return {
    props: {
      DATA_JWT,
      projects: project.data,
      datas: data.data,
    },
  };
}
