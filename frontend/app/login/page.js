"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "@/app/login/styles/login.css"; // Correct path for login styles
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [alert, setAlert] = useState({ message: "", success: false });

  // Optionally, fetch a welcome message from backend if needed.
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/login`)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching /login API:", error);
      });
  }, []);

  // Auto-add fade-out class after 5 seconds, then clear alert after animation (3s)
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        const alertElem = document.querySelector(".custom-alert");
        if (alertElem) {
          alertElem.classList.add("hid");
        }
        setTimeout(() => {
          setAlert({ message: "", success: false });
        }, 3000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    const username = e.target.loginUsername.value;
    const password = e.target.loginPassword.value;
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          action: "login",
          username,
          password,
        }
      );
      console.log("Login response:", response.data);
  
      if (response.data.token) {
        // ✅ Store token and profile photo in localStorage
        localStorage.setItem("token", response.data.token);
        if (response.data.profile_photo) {
          localStorage.setItem("profile_photo", response.data.profile_photo);
        }
      }
  
      setAlert({
        message: response.data.message,
        success: response.data.success,
      });
  
      if (response.data.success) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error during login:", err);
      setAlert({
        message: "Login failed. Please check your credentials and try again.",
        success: false,
      });
    }
  };
  

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    const username = e.target.registerUsername.value;
    const email = e.target.registerEmail.value;
    const password = e.target.registerPassword.value;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          action: "register",
          username,
          email,
          password,
        }
      );
      console.log("Register response:", response.data);
      setAlert({
        message: response.data.message,
        success: response.data.success,
      });
      if (response.data.success) {
        setIsLogin(true);
        if (window.$) {
          window.$(".wrapper").removeClass("active");
        }
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setAlert({
        message: "Registration failed. Please check your details and try again.",
        success: false,
      });
    }
  };

  // Attach jQuery click event handlers for toggling login/register forms.
  useEffect(() => {
    const wrapper = window.$ ? window.$(".wrapper") : null;
    const registerLink = window.$ ? window.$(".register-link") : null;
    const loginLink = window.$ ? window.$(".login-link") : null;

    if (wrapper && registerLink && loginLink) {
      registerLink.on("click", () => {
        wrapper.addClass("active");
        setIsLogin(false);
      });
      loginLink.on("click", () => {
        wrapper.removeClass("active");
        setIsLogin(true);
      });
    }

    return () => {
      if (registerLink) registerLink.off("click");
      if (loginLink) loginLink.off("click");
    };
  }, []);

  return (
    <main className="p-4">
      <div className="wrapper">
        {/* Animated background spans */}
        <span className="bg-animate"></span>
        <span className="bg-animate2"></span>

        {/* Custom Alert for messages */}
        {alert.message && (
          <div className={`custom-alert ${alert.success ? "success" : ""} show`}>
            {alert.message}
          </div>
        )}

        {/* Login form box */}
        <div className={`form-box login ${isLogin ? "" : "hidden"}`}>
          <h2 className="animation" style={{ "--i": 0, "--j": 21 }}>
            Login
          </h2>
          <form onSubmit={onSubmitLogin} className="col-6 mx-auto card p-3">
            <div
              className="input-box animation"
              style={{ "--i": 1, "--j": 22 }}
            >
              <input
                type="text"
                required
                id="Login-UserName"
                name="loginUsername"
              />
              <label htmlFor="Login-UserName">Username</label>
              <i className="bx bxs-user"></i>
            </div>
            <div
              className="input-box animation"
              style={{ "--i": 2, "--j": 23 }}
            >
              <input
                type="password"
                required
                id="Login-Password"
                name="loginPassword"
              />
              <label htmlFor="Login-Password">Password</label>
              <i className="bx bxs-lock"></i>
            </div>
            <button
              type="submit"
              className="btn animation loginBtn"
              style={{ "--i": 3, "--j": 24 }}
            >
              Login
            </button>
            <div
              className="logreg-link animation"
              style={{ "--i": 4, "--j": 25 }}
            >
              <p>
                Don&apos;t have an account?{" "}
                <Link href="#" className="register-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Info text for login */}
        <div className={`info-text login ${isLogin ? "" : "hidden"}`}>
          <h2 className="animation" style={{ "--i": 0, "--j": 20 }}>
            Welcome Back, Otaku!
          </h2>
          <p className="animation" style={{ "--i": 1, "--j": 21 }}>
            Dive back into your favorite anime world at OtakuRealm—where every
            login unlocks new adventures. Let&apos; s get started!
          </p>
        </div>

        {/* Register form box */}
        <div className={`form-box register ${isLogin ? "hidden" : ""}`}>
          <h2 className="animation" style={{ "--i": 17, "--j": 0 }}>
            Sign Up
          </h2>
          <form onSubmit={onSubmitRegister} className="col-6 mx-auto card p-3">
            <div
              className="input-box animation"
              style={{ "--i": 18, "--j": 1 }}
            >
              <input
                type="text"
                required
                id="Register-UserName"
                name="registerUsername"
              />
              <label htmlFor="Register-UserName">Username</label>
              <i className="bx bxs-user"></i>
            </div>
            <div
              className="input-box animation"
              style={{ "--i": 19, "--j": 2 }}
            >
              <input
                type="text"
                required
                id="Register-Email"
                name="registerEmail"
              />
              <label htmlFor="Register-Email">Email</label>
              <i className="bx bxs-envelope"></i>
            </div>
            <div
              className="input-box animation"
              style={{ "--i": 20, "--j": 3 }}
            >
              <input
                type="password"
                required
                id="Register-Password"
                name="registerPassword"
              />
              <label htmlFor="Register-Password">Password</label>
              <i className="bx bxs-lock"></i>
            </div>
            <button
              type="submit"
              className="btn animation"
              style={{ "--i": 21, "--j": 4 }}
            >
              Sign Up
            </button>
            <div
              className="logreg-link animation"
              style={{ "--i": 22, "--j": 5 }}
            >
              <p>
                Already have an account?{" "}
                <Link href="#" className="login-link">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Info text for register */}
        <div className={`info-text register ${isLogin ? "hidden" : ""}`}>
          <h2
            className="animation"
            style={{
              "--i": 17,
              "--j": 0,
            }}
          >
            Join OtakuRealm
          </h2>
          <h3
            className="animation"
            style={{ "--i": 18, "--j": 1, color: "white" }}
          >
            Your gateway to endless anime adventures, exclusive content, and a
            vibrant community. Sign up now and be part of the revolution!
          </h3>
        </div>
      </div>
    </main>
  );
}
