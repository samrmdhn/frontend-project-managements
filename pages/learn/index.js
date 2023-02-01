import axios from "axios";
import { useState } from "react";
export async function getServerSideProps(ctx) {
  const results = await axios
    .get("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
    .then(function (response) {
      return response;
    });

  //  console.log(results.data.results);

  return {
    props: {
      datas: results.data.results,
    },
  };
}

export default function Learn(props) {
  const [datas, setDatas] = useState(props.datas);
  const [initialOffset, setInitialOffset] = useState(30);

  const fetchMore = async () => {
    setInitialOffset((prevInitialOffset) => prevInitialOffset + 10);

    const results = await axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${initialOffset}`)
      .then(function (response) {
        return response;
      });

    console.log(results.data.results);
    setDatas((prevDatas) => [...prevDatas, ...results.data.results]);
  };

  return (
    <div>
      {datas.map((data, index) => {
        return (
          <>
            <div>{data.name}</div>
          </>
        );
      })}

      <h3>Learn</h3>
      <button onClick={fetchMore}>Fetch More</button>
    </div>
  );
}
