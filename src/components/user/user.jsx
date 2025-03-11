import React from "react";
import { useState, useEffect } from "react";
import { getInfomation, updateUser } from "../../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { _ } from "lodash";
import "./user.scss";
import { toast } from "react-toastify";

const Account = () => {
  const dataDefault = {
    email: "",
    fullname: "",
    username: "",
    image: "",
    address: "",
    phone: "",
  };

  const checkDefault = {
    username: true,
    fullname: true,
    email: true,
    image: true,
    phone: true,
    address: true,
  };

  const [data, setData] = useState(dataDefault);
  const [check, setCheck] = useState(checkDefault);
  const account = useSelector((state) => state.user.account);

  const handleInput = (type, value) => {
    let _data = { ...data };
    _data[type] = value;
    setData(_data);
    setCheck(checkDefault);
  };

  const validate = () => {
    setCheck(checkDefault);
    let checkValid = true;
    let arr = ["email", "username", "fullname", "phone", "address"];
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

  const getDetailUser = async (id) => {
    let res = await getInfomation(id);
    if (res && res.statusCode === 200) {
      if(res.data.image) {
        setData(res.data)
      }
      else {
        setData({...res.data,image:""})
      }
    } else {
      setData(dataDefault);
    }
  };

  useEffect(() => {
    if (account && account.id) {
      getDetailUser(+account.id);
    }
  }, [account]);

  const handleSubmit = async () => {
    let check = validate();
    if (check === true) {
      let res = await updateUser(data);
      if (res && res.statusCode === 200) {
        toast.success(res.message);
        setCheck(checkDefault);
        setData(dataDefault);
        getDetailUser(account.id);
      } else {
        toast.error(res.message);
        setCheck(checkDefault);
        setData(dataDefault);
        getDetailUser(account.id);
      }
    }
  };

  const handleClose = () => {
    setData(dataDefault);
    setCheck(checkDefault);
    if (account.id) {
      getDetailUser(account.id);
    }
  };

  return (
    <div className="user-detail card container mt-2 mb-2">
      <div className="row">
        <div className="col-md-3 col-12 text-center">
          <img
            src={
              data && data.image
                ? data.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTGqEx_vqU2paNsNpDL1EjIpKCGXnoIdXrti48mthxcQE-BzumbnfkU8tWFqHXEH5rxFY&usqp=CAU"
            }
            className="rounded-circle img-fluid"
            alt="Profile"
          />
        </div>
        <div className="col-md-9 col-12">
          <div className="row">
            <div className="col-sm-6 col-12">
              <div className="input-box">
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  id="email"
                  value={data.email}
                  onChange={(e) => handleInput("email", e.target.value)}
                  className={
                    check.email ? "form-control" : "form-control is-invalid"
                  }
                />
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="input-box">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={data.username}
                  onChange={(e) => handleInput("username", e.target.value)}
                  className={
                    check.username ? "form-control" : "form-control is-invalid"
                  }
                />
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="input-box">
                <label htmlFor="fullname">Fullname:</label>
                <input
                  type="text"
                  id="fullname"
                  value={data.fullname}
                  onChange={(e) => handleInput("fullname", e.target.value)}
                  className={
                    check.fullname ? "form-control" : "form-control is-invalid"
                  }
                />
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="input-box">
                <label htmlFor="image">Image:</label>
                <input
                  type="text"
                  id="image"
                  value={data.image}
                  onChange={(e) => handleInput("image", e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="input-box">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  value={data.phone}
                  onChange={(e) => handleInput("phone", e.target.value)}
                  className={
                    check.phone ? "form-control" : "form-control is-invalid"
                  }
                />
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="input-box">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  value={data.address}
                  onChange={(e) => handleInput("address", e.target.value)}
                  className={
                    check.address ? "form-control" : "form-control is-invalid"
                  }
                />
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex mt-2 justify-content-end">
                <button
                  onClick={() => handleSubmit()}
                  className="btn btn-primary"
                  style={{ marginRight: "8px" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleClose()}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
