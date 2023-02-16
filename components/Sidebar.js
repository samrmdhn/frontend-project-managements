import { Typography } from "@mui/material";
import Link from "next/link";
export default function Sidebar() {
  const listItems = [
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Search",
      url: "/search",
    },
  ];

  return (
    <div>
      {listItems.map((list, index) => {
        return (
          <div>
            <div>
              <Link href={list.url}>
                <Typography sx={{ color: "white", fontWeight: "bolder" }}>
                  {list.label}
                </Typography>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
