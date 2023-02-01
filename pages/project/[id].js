import axios from "axios";
import cookies from "next-cookies";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

export default function ProjectID(props) {
  const [data, setData] = useState(props.data);
  const router = useRouter();

  const query = router.query;

  const id = query.id;

  console.log(id);

  return (
    <div>
      <h3>This is Project page ID : {data.id}</h3>
      <div>{data.Company.name}</div>
      <div>{data.name}</div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const allCookies = cookies(ctx);
  const token = allCookies.token;
  const { query } = ctx;
  const { id } = query;

  const res = await axios
    .get(`http://localhost:3001/project/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(function (response) {
      return response;
    });

  return {
    props: {
      data: res.data.data,
    },
  };
}
