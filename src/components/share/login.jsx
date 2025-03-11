import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../service/userService";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/action/userAction";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataDefault = {
    email: "",
    password: "",
  };

  const checkDefault = {
    email: true,
    password: true,
  };

  const [data, setData] = useState(dataDefault);
  const [check, setCheck] = useState(checkDefault);

  const handleInput = (type, value) => {
    let _data = { ...data };
    _data[type] = value;
    setData(_data);
    setCheck(checkDefault);
  };

  const validate = () => {
    setCheck(checkDefault);
    let checkValid = true;
    let arr = ["email", "password"];
    for (let i = 0; i < arr.length; i++) {
      if (!data[arr[i]]) {
        let _checkInput = { ...checkDefault };
        _checkInput[arr[i]] = false;
        setCheck(_checkInput);
        checkValid = false;
        toast.error(`Invalid ${arr[i]}!`);
        break;
      }
    }

    return checkValid;
  };

  const handleSubmit = async () => {
    let check = validate();
    if (check === true) {
      let res = await loginUser(data);
      if (res && res.statusCode === 201) {
        dispatch(loginSuccess(res.data));
        navigate("/");
        toast.success(res.message);
        setData(dataDefault);
        setCheck(checkDefault);
      } else {
        toast.error(res.message);
        setData(dataDefault);
        setCheck(checkDefault);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center">Login</h3>
        <div className="mb-3">
          <input
            type="email"
            value={data.email}
            maxLength={50}
            onChange={(e) => handleInput("email", e.target.value)}
            className={
              check.email === true ? "form-control" : "form-control is-invalid"
            }
            placeholder="Email"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={data.password}
            maxLength={20}
            onChange={(e) => handleInput("password", e.target.value)}
            className={
              check.password === true
                ? "form-control"
                : "form-control is-invalid"
            }
            placeholder="Password"
          />
        </div>
        <button
          onClick={() => handleSubmit()}
          className="btn btn-primary w-100 mt-3"
          type="submit"
        >
          Login
        </button>
        <p className="text-center mt-2">
          Don't have an account? <Link to="/register">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
