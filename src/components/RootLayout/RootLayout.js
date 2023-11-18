import { Outlet } from "react-router-dom";

import "./RootLayout.css";

/**
 * This component represents the root layout applied to all pages.
 *
 * @author Amir Parsa Mahdian
 */
export default function RootLayout() {
  return (
    <>
      <Outlet />
      <div className="footer">
        <p>CNAT | Cloud-Native Asset Tracking</p>
        <p>Made by Amir Parsa Mahdian</p>
      </div>
    </>
  );
}
