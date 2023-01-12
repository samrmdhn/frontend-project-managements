import { useRouter } from "next/router";
import unauthpage from "../../middleware/unauthpage";
import React, { useState, useEffect } from "react";
import axios from "axios";
import cookies from "next-cookies";

export default function Search(props) {
  const router = useRouter();
  const datas = props.datas.data;
  console.log(datas);

  const [nameClient, setNameClient] = useState("");
  const [budgetClient, setBudgetClient] = useState("");

  const nameHandler = (e) => {
    setNameClient(e.target.value);
  };

  const budgetHandler = (e) => {
    setBudgetClient(e.target.value);
  };

  //const filterSearch = ({ name, budget }) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { query } = router;

    if (nameClient) query.client = nameClient;
    if (budgetClient) query.budget = budgetClient;

    router.push({
      pathname: router.pathname,
      query: query,
    });

    /*

    const querySearch = {};

    if (name1 !== "") {
      querySearch.client = name1;

      console.log(querySearch);

      const params = Object.keys(querySearch)
        .map((key) => `${key}=${query[key]}`)
        .join("&");

      let routerParams = Object.keys(querySearch);

      routerParams.forEach((router) => {
        let value = querySearch[router];
        return value;
      });

      console.log(routerParams);

      router.push({
        pathname: "/search",
        query: params,
      });

      const res = await axios
        .get(`http://localhost:3001/project/search?${params}`)
        .then(function (response) {
          return response;
        });

      console.log(res);
    }
    */

    /*

    if (name1 != "" && name2 === "") {
      router.push({
        pathname: "/search",
        query: {
          client: name1,
        },
      });

      const res = await axios
        .get("http://localhost:3001/project/search", {
          params: {
            client: name1,
          },
        })
        .then(function (response) {
          return response;
        });
      console.log(res);
    } else if (name1 != "" && name2 != "") {
      router.push({
        pathname: "/search",
        query: {
          client: name1,
          budget: name2,
        },
      });

      const res = await axios
        .get("http://localhost:3001/project/search", {
          params: {
            client: name1,
            budget: name2,
          },
        })
        .then(function (response) {
          return response;
        });
    }
    */
  };

  return (
    <div>
      <h3>Search page</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name Client" onChange={nameHandler} />
        <input placeholder="Budget" onChange={budgetHandler} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const allCookies = cookies(ctx);
  const token = allCookies.token;

  if (Object.keys(ctx.query).length === 0) {
    const data = await axios
      .get(`http://localhost:3001/projects`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        return response;
      });

    return {
      props: {
        datas: data.data,
      },
    };
  }

  const data = await axios
    .get(`http://localhost:3001/project/search`, {
      params: ctx.query,
    })
    .then(function (response) {
      return response;
    });

  console.log(data.data);

  return {
    props: {
      datas: data.data,
    },
  };
}
