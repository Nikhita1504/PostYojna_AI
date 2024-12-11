import React from 'react'
import styles from'./signup.module.css'
import { handleError, handleSucess } from "../utils";
import { ToastContainer } from "react-toastify";
import { useState } from 'react'
const Signup = () => {
  
const [Userinfo , SetUserinfo] = useState(null)
  const handlechange = (e) => {
    const { name, value } = e.target;
    const copyinfo = { ...Userinfo };
    copyinfo[name] = value;
    SetUserinfo(copyinfo);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = Userinfo;

    if (!name || !email || !password) {
      handleError("Name, email, and password are required.");
      return;
    }

    try {
      const URL = "http://localhost:3000/auth/signup";
      const body = { name, email, password };
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      const { success, error, message } = result;

      if (success) {
        handleSucess(message);
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
        SetUserinfo({ name, email, password });
      } else if (error) {
        const details = error.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
   
       <div className={styles.signupContainer}>
      <div className={styles.signupContent}>
        <div className={styles.illustration}>
          <video src="/assets/loginmv.mp4" autoPlay loop muted className={styles.video} />
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Signup</h1>
          <form className={styles.form} onSubmit={handlesubmit}>
            <div>
              <label className={styles.label} htmlFor="name">Name</label>
              <input id="name" className={styles.input} onChange={handlechange} type="text" name="name" placeholder="Enter your name" />
            </div>
            <div>
              <label className={styles.label} htmlFor="email">Email</label>
              <input id="email" className={styles.input} onChange={handlechange} type="text" name="email" placeholder="Enter your email" />
            </div>
            <div>
              <label className={styles.label} htmlFor="password">Password</label>
              <input id="password" className={styles.input} onChange={handlechange} type="password" name="password" placeholder="Enter password" />
            </div>
            <button className={styles.signup}>Signup</button>
           
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
    
  )
}

export default Signup
