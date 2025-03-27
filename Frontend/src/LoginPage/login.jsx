import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { handleError, handleSucess } from "../utils/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Login() {
  const [Userinfo, SetUserinfo] = useState(null);
  const [logininfo, Setlogininfo] = useState({
    email: "",
    password: "",
    // rememberMe: false

  });

  const FetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/userdata/${logininfo.email}`);
      SetUserinfo(response.data);
    } catch (error) {
      console.log("error in fetching user details");
    }
  };

  const navigate = useNavigate();

  const handlechange = (e) => {
    const { name, value, type, checked } = e.target;
    Setlogininfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { email, password } = logininfo;
    if (!email || !password) {
      handleError("Email and password required");
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
      const { success, error, message, jwt_token } = result;
      if (success) {
        if (logininfo) {
          localStorage.setItem("token", jwt_token);
        } else {
          sessionStorage.setItem("token", jwt_token);
        }
        FetchUserDetails();
        handleSucess(message);
        setTimeout(() => {
          navigate("/Home/Dashboard", { state: Userinfo });
        }, 1000);
      } else {
        handleError(error ? error.details[0].message : message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Panel - Blue Gradient */}
      <div className={styles.leftPanel}>
        <div className={styles.logoContainer}>
          <img src="/assets/PostYojnaAI_-removebg-preview.png" alt="Company Logo" className={styles.logo} />
          <h2 className={styles.companyName}>PostYojna AI</h2>
        </div>

        {/* Centered Image */}
        <div className={styles.centerImageContainer}>
          <div className={styles.imageContainer}>
            <img
              src="/assets/loginbg.png"  // Replace with your image path
              alt="Login Illustration"
              className={styles.centerImage}
            />
          </div>
        </div>

        {/* Optional bottom content */}
        {/* <div className={styles.panelContent}>
    <h1 className={styles.panelTitle}>Welcome back!</h1>
    <p className={styles.panelSubtitle}>Please login to access your dashboard</p>
  </div> */}
      </div>

      {/* Right Panel - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h1 className={styles.formTitle}>Welcome back</h1>
          <p className={styles.formSubtitle}>Enter your credentials to access your account.</p>

          <form onSubmit={handlesubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email address</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={logininfo.email}
                onChange={handlechange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                name="password"
                value={logininfo.password}
                onChange={handlechange}
                required
              />
            </div>

            <div className={styles.options}>
              {/* <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={logininfo.rememberMe}
                  onChange={handlechange}
                />
                <span className={styles.checkmark}></span>
                Remember me
              </label> */}

              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            </div>

            <button type="submit" className={styles.loginButton}>
              Sign in
            </button>
          </form>

          <div className={styles.signupPrompt}>
            Don't have an account? <a href="#" className={styles.signupLink}>Create account!</a>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
