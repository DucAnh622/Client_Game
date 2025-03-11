import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import { registerUser } from "../../service/userService";

const Register = () => {
  const navigate = useNavigate();
  const dataDefault = {
    email: "",
    password: "",
    username: "",
    fullname: "",
    address: "",
    phone: "",
  };

  const checkDefault = {
    email: true,
    password: true,
    username: true,
    fullname: true,
    address: true,
    phone: true,
  };

  const [data, setData] = useState(dataDefault);
  const [check, setCheck] = useState(checkDefault);

  const handleInput = (type, value) => {
    let _data = _.cloneDeep(data);
    _data[type] = value;
    setData({ ..._data });
    setCheck(checkDefault);
  };

  const validate = () => {
    setCheck(checkDefault);
    let checkValid = true;
    let arr = ["email", "password", "username", "fullname", "address", "phone"];
    for (let i = 0; i < arr.length; i++) {
      if (!data[arr[i]]) {
        let _checkInput = _.cloneDeep(checkDefault);
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
      let res = await registerUser(data);
      if (res && res.statusCode === 201) {
        toast.success(res.message);
        setData(dataDefault);
        setCheck(checkDefault);
        navigate("/login");
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
        <h3 className="text-center">Signup</h3>
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
        <div className="mb-3">
          <input
            type="text"
            value={data.username}
            maxLength={30}
            onChange={(e) => handleInput("username", e.target.value)}
            className={
              check.username === true
                ? "form-control"
                : "form-control is-invalid"
            }
            placeholder="Username"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            value={data.fullname}
            maxLength={50}
            onChange={(e) => handleInput("fullname", e.target.value)}
            className={
              check.fullname === true
                ? "form-control"
                : "form-control is-invalid"
            }
            placeholder="Fullname"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            value={data.address}
            maxLength={100}
            onChange={(e) => handleInput("address", e.target.value)}
            className={
              check.address === true
                ? "form-control"
                : "form-control is-invalid"
            }
            placeholder="Address"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            value={data.phone}
            maxLength={15}
            onChange={(e) => handleInput("phone", e.target.value)}
            className={
              check.phone === true ? "form-control" : "form-control is-invalid"
            }
            placeholder="Phone"
          />
        </div>
        <button
          onClick={() => handleSubmit()}
          className="btn btn-primary w-100 mt-3"
          type="submit"
        >
          Signup
        </button>
        <p className="text-center mt-2">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
