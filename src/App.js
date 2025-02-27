import React from "react";
import Navbar from "./Components/Navbar";
import CardList from "./Components/Main";
import { Route, Routes } from "react-router-dom";
// import Card from './Components/Card';
import ForgotPassword from "./Components/ForgotPassword";
import TextEditor from "./Components/BlogSection/Editor/TextEditor";
import { Login } from "@mui/icons-material";
import LoginPopup from "./Components/login";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path='/login' element={<LoginPopup />} /> */}
        <Route path="/" element={<CardList />} />
        {/* <Route path='/blog' element={<BlogMain/>}/> */}
        <Route path="/blog" element={<TextEditor />} />
        {/* <Route path='/card' element={<Card />} /> */}
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};
export default App;
