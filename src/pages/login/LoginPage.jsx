import React, { useState } from "react";
import "./login.css";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await axiosClient.post("/users/login", {
        phone_number: phoneNumber,
        password,
      });
      console.log(result);
        const token = result.token;
        localStorage.setItem('token', token);
      navigate("/");
      console.log('Token:', token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div class="container-body">
        <div class="loginform">
          <div class="boxloginform">
            <label class="heading-form">Đăng nhập</label>
            <div class="loginform-input mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tài khoản"
                class="input "
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div class="loginform-input mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <input
                type="password"
                placeholder="Mật khẩu"
                class="input "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button class="btnlogin btn-gradient mb-3" onClick={handleLogin}>
                Đăng nhập
              </button>
            </div>
            {/* <p class="">Quên mật khẩu?</p>
            <div>
                <button class="btnsignin btn-gradient mb-3">Đăng ký</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
