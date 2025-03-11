import { Outlet } from "react-router-dom";
import Header from "./header";

const Index = () => {
    return (
        <>
        <Header/>
        <Outlet/>
        </>
    )
}

export default Index;