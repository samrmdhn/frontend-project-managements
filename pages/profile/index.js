import { useEffect } from "react";
import unauthpage from "../../middleware/unauthpage";

export async function getServerSideProps(ctx) {
  const DATA_JWT = unauthpage(ctx);
  return {
    props: {
      DATA_JWT,
    },
  };
}

export default function Profile({ DATA_JWT }) {
  const { id, username } = DATA_JWT.decoded;
  const { token } = DATA_JWT;

  const getData = async () => {
    try {
      const res = await fetch(`http://localhost:3001/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {username}
      <h3>My Profile</h3>
    </div>
  );
}
