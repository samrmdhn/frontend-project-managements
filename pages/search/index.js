import { useRouter } from "next/router";import unauthpage from "../../middleware/unauthpage";
import React, { useState, useEffect } from "react";
import axios from "axios";
import cookies from "next-cookies";
import Navbar from "../../components/Navbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button, Grid, Pagination, TextField } from "@mui/material";
import Link from "next/link";

import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import Slider from "@mui/material/Slider";
import Sidebar from "../../components/Sidebar";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import Select from "react-select";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Search(props) {
  dayjs.extend(localizedFormat);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const router = useRouter();
  const { query } = router;

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

  const optionsProps = [{ label: "All", value: "" }];

  props.category?.data.map((category) => {
    return optionsProps.push({ label: category.name, value: category.name });
  });

  console.log(optionsProps);

  const [options, setOptions] = useState(optionsProps);

  const [nameProject, setNameProject] = useState(query.name ? query.name : "");
  const [company, setCompany] = useState(query.company ? query.company : "");
  const [page, setPage] = useState(Number(1));
  const [category, setCategory] = useState(
    query.category
      ? { label: query.category, value: query.category }
      : options[0]
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [valueSlider, setValueSlider] = useState([100000000, 1000000000]);

  // CATCH QUERY TO VALUE

  /*
  if (query.project) setNameProject(query.project);
  if (query.company) setCompany(query.company);
  if (query.category)
    setCategory({ label: query.category, value: query.category });
*/
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
    if (category.value === "" && query.category !== "") delete query.category;

    if (nameProject) query.project = nameProject;
    if (company) query.company = company;
    if (category.value) query.category = category.value;

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
    return `${value}??C`;
  }

  const handleSelect = (selectedOption) => {
    setCategory(selectedOption);
  };

  const handleReset = () => {
    const { query } = router;

    delete query.category;
    delete query.minimum;
    delete query.maximum;
    delete query.page;
    delete query.company;
    delete query.project;

    setNameProject("");
    setCompany("");
    setCategory(options[0]);
    setPage(Number(1));

    router.push({
      router: router.pathname,
      query: query,
    });
  };

  return (
    <div>
      <Navbar role={role} />
      <h3>Search page</h3>
      <div style={{ height: "400px", marginBottom: "20px" }}>
        <Doughnut data={settingChart} />;
      </div>
      <form onSubmit={handleSubmit}>
        <Typography fontWeight="bolder">Search by name</Typography>
        <Grid container alignItems="start">
          <Grid item md="2">
            <TextField
              size="small"
              type="text"
              placeholder="Name project"
              value={nameProject}
              onChange={projectHandler}
              sx={{ height: "20px" }}
            />
          </Grid>

          <Grid item md="1">
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "100%", height: "40px" }}
            >
              Search
            </Button>
            <Typography
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => setShowAdvanced((prevShow) => !prevShow)}
            >
              Advanced Search
            </Typography>
          </Grid>
        </Grid>

        {showAdvanced && (
          <Grid container gap={3} alignItems="end">
            <Grid item md="2">
              <Typography>Company name</Typography>
              <TextField
                size="small"
                type="text"
                placeholder="Name Company"
                value={company}
                onChange={companyHandler}
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid item md="2">
              <Typography>Category</Typography>
              <div style={{ width: "100%" }}>
                <Select
                  options={options}
                  onChange={handleSelect}
                  defaultValue={options[0]}
                  value={category}
                />
              </div>
            </Grid>

            <Grid item md="2">
              <Typography>Budget</Typography>
              <Slider
                value={valueSlider}
                min={100000000}
                max={1000000000}
                marks={true}
                step={100000000}
                onChange={handleChangeSlider}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item md="2">
              <Button variant="contained" onClick={handleReset}>
                Reset
              </Button>
            </Grid>
          </Grid>
        )}
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

  const category = await axios
    .get("http://localhost:3001/category")
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
      category: category.data,
    },
  };
}
