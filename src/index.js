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
import HomePage from "./pages/HomePage";
import UserLoginPage from "./pages/UserLoginPage";
import UserRegisterPage from "pages/UserRegisterPage";
import TrackersPage from "./pages/TrackersPage";
import TrackerPage from "pages/TrackerPage";
import ErrorPage from "pages/ErrorPage";
import RootLayout from "components/RootLayout/RootLayout";
import UserAreaLayout from "components/UserAreaLayout";
import TrackerRegisterPage from "pages/TrackerRegisterPage";

import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

export default function App() {
  return (
    // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<UserLoginPage />} />
          <Route path="register" element={<UserRegisterPage />} />
          <Route path="user-area" element={<UserAreaLayout />}>
            <Route path="tracker">
              <Route index element={<TrackersPage />} />
              <Route path=":trackerId" element={<TrackerPage />} />
              <Route path="register" element={<TrackerRegisterPage />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    // </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
