import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "../components/home";
import Index from "../components/share";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/share/login";
import Register from "../components/share/register";
import { useDispatch, useSelector } from "react-redux";
import Account from "../components/user/user";
import Line from "../components/game/gameLine";
import Caro from "../components/game/gameCaro";

const RoutePublic = () => {
  const account = useSelector((state) => state.user.account);
  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={
            account && account.loading === true ? <Navigate to="/" /> : <Register />
          }
        />
        <Route
          path="/login"
          element={account && account.loading === true ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="/game1" element={<Line />} />
          <Route path="/game2" element={<Caro />} />
          <Route
            path="/account/:username"
            element={
              account && account.loading === true ? <Account /> : <Navigate to="/login"/>
            }
          />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default RoutePublic;
