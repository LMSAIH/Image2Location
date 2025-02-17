import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BiLogOut } from "react-icons/bi";
import axios from 'axios'
export function Navbar() {

    const { setUser } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        try {
            const response = axios.get("http://localhost:8000/logout", { withCredentials: true });
            setUser(null);
        } catch (err) {
            console.log(err);
        }
    }

    const navLink =
    location.pathname === "/"
      ? { to: "/list", text: "Your List" }
      : { to: "/", text: "Home" };

    return (
        <nav>
            <div className="flex flex-row justify-end gap-8 mr-10 mt-10">
                <Link to={navLink.to} className="text-white text-2xl my-auto duration-300 hover:text-blue-400 hover:underline"> {navLink.text} </ Link>
                <button onClick={handleLogout} className="text-white text-2xl flex flex-row border-2 border-white rounded-md p-2 duration-300 hover:border-red-500 hover:bg-red-500">
                    <BiLogOut className="size-10"></BiLogOut>
                    Logout 
                </button>
            </div>
        </nav>
    )
}