import { Link } from "react-router-dom";
import './home.scss';
const Home = ()=> {
    return (
        <div className="container mt-2">
            <div className="row">
                <div className="col-12"><h4 className="text-center">List game</h4></div>
                <div className="col-12 col-sm-6 col-md-3">
                    <Link to="/game1" className="item-game">
                        <div className="image">
                        <img src="https://play-lh.googleusercontent.com/fV1IfZbSZ3M-rs-2R0kYkd-Bcf8LfJsWnb3vy0aiz2KVIWnxdlc3joUO10_0r8oQqlY" alt="" />
                        </div>
                        <p>Line98</p>
                    </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <Link to="/game2" className="item-game">
                        <div className="image">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/CaroVN.jpg" alt="" />
                        </div>
                        <p>Caro</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;