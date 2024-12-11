import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { handleError, handleSucess } from "../utils/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Login() {
  const[Userinfo , SetUserinfo] = useState(null)
  const [logininfo, Setlogininfo] = useState({
    email:"",
    password: "",
  });

  const FetchUserDetails = async() =>{
    try{
    const response = await axios.get(`http://localhost:3000/userdata/${logininfo.email}`);
    SetUserinfo(response.data)
    }catch(error){
     console.log("error in fetching user details")
    }
  }

  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value } = e.target;
    Setlogininfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { email, password } = logininfo;
    if (!email || !password) {
      handleError("email , password required");
      return;
    }
    try {
      const URL = "http://localhost:3000/auth/login";
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(logininfo),
      });
      const result = await response.json();
      console.log(result)
      const { success, error, message, jwt_token } = result;
      if (success) {
        
        sessionStorage.setItem("token", jwt_token);
        FetchUserDetails();
        handleSucess(message);
        setTimeout(() => {
          navigate("/Home/Dashboard" , { state: Userinfo });
        }, 1000);
      } else {
        handleError(error ? error.details[0].message : message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className={styles.body}>
    <div className={styles.loginbanner}>
      {/* Left video section */}
      <div className={styles.loginbannerVideo}>
        {/* <video autoPlay loop muted className={styles.video}>
          <source src="/assets/Data Analysis.mp4" type="video/mp4" />

        </video> */}
        <img src="/assets/loginbg.avif" alt="" />
      </div>
  
      {/* Right form section */}
      <div className={styles.container}>
        <h1 className={styles.header}>Welcome!</h1>
        <p className={styles.subheader}>Sign in to your Account</p>
        <form className={styles.form} onSubmit={handlesubmit}>
          <input
            className={styles.input}
            onChange={handlechange}
            type="text"
            name="email"
            placeholder="Email Address"
          />
          <input
            className={styles.input}
            onChange={handlechange}
            type="password"
            name="password"
            placeholder="Password"
          />
         
          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  </div>
  
  
  );
}

export default Login;

