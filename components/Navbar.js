import Link from "next/link";
export default function Navbar({ role }) {
  let navigation = [];

  switch (role) {
    case "user":
      navigation = [
        {
          name: "Home",
          link: "/dashboard",
        },
      ];
      break;
    case "admin":
      navigation = [
        {
          name: "Home",
          link: "/dashboard",
        },
        {
          name: "Search",
          link: "/search",
        },
        {
          name: "Setting",
          link: "/setting",
        },
      ];
  }

  return (
    <div style={{ display: "flex" }}>
      {navigation.map((nav, index) => {
        return (
          <>
            <Link href={nav.link}>
              <div style={{ marginLeft: 20 }}>{nav.name}</div>
            </Link>
          </>
        );
      })}
    </div>
  );
}
