import { Outlet } from "react-router-dom";
import NavBar from './NavBar/NavBar';

const Layout = () => {
    return (
        <main className="App">
            <NavBar />
            <Outlet />
        </main>
    );
}

export default Layout;