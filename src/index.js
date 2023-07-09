// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import ReactDOM from "react-dom/client";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import TrackersView from "./pages/TrackersView/TrackersView";
import TrackerView from "pages/TrackerView/TrackerView";
import ErrorPage from "pages/ErrorPage/ErrorPage";
import RootLayout from "components/RootLayout/RootLayout";
import UserAreaLayout from "components/UserAreaLayout/UserAreaLayout";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

export default function App() {
  return (
    // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="user-area" element={<UserAreaLayout />}>
            <Route path="trackers" element={<TrackersView />} />
            <Route path="tracker">
              <Route path=":trackerId" element={<TrackerView />} />
              <Route path="new" element={<TrackerView />} />
            </Route>
          </Route>
        </Route>
        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Routes>
    </BrowserRouter>
    // </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
