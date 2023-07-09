import { Outlet } from "react-router-dom";

import "index.css";
import "./RootLayout.css";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <div className="footer">
        <p>CNAT | Cloud-Native Asset Tracking</p>
        <p>Copyright 2023 Amir Parsa Mahdian</p>
      </div>
    </>
  );
}
