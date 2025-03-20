import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TimerIcon from "@mui/icons-material/Timer";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname } from "next/navigation";
import { useAuth } from "../AuthContext"
import { useEffect, useState } from 'react'
import Link from "next/link";
import { signOut } from "../lib/supabaseClient";

export default function NavigationBar() {
    const pathname = usePathname();
    const { session } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => { }, [session])

    if (typeof window !== "undefined") {
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        });
    }


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav
            className={`p-4 ${pathname === "/" ? "hidden" : "flex"} sticky md:w-20 top-0 h-screen md:h-screen flex-col md:gap-4 md:bg-[var(--foreground)] md:backdrop-blur-md z-50 ${menuOpen ? "bg-[var(--foreground)]  backdrop-blur-md shadow-lg" : ""}`}
        >
            {/* <img src='/TIMERLogo.svg' className='w-auto h-16 object-conatain' height={64} width={64}></img> */}
            <div className="flex justify-between items-center md:hidden">
                <button
                    type="button"
                    onClick={toggleMenu}
                    className="text-[var(--accent)] focus:outline-none"
                >
                    {menuOpen ? (
                        <div></div> // <CloseIcon fontSize="large" />
                    ) : (
                        <MenuIcon fontSize="large" />
                    )}
                </button>
            </div>
            <ul
                className={`flex flex-col md:flex-col md:gap-4 w-auto h-full md:flex ${menuOpen ? "flex" : "hidden"}`}
            >
                <li className="mb-2 md:mb-0">
                    <Link
                        href="/timer"
                        title="Timer"
                        onClick={() => setMenuOpen(false)}
                        className={`flex justify-center items-center ${pathname !== "/timer" ? "text-[var(--background)]" : "text-[var(--accent)] bg-none"} hover:text-[var(--accent)] border border-none rounded p-1 text-center backdrop-blur-md shadow-lg`}
                    >
                        <TimerIcon fontSize="large" />
                    </Link>
                </li>
                <li className="mb-2 md:mb-0">
                    <Link
                        href="/analytics"
                        onClick={() => setMenuOpen(false)}
                        title="Analytics"
                        className={`flex justify-center items-center ${pathname !== "/analytics" ? "text-black bg-white" : "text-[var(--accent)] bg-none"}  hover:text-[var(--accent)] border border-none rounded p-1 text-center  backdrop-blur-md shadow-lg`}
                    >
                        <AssessmentIcon fontSize="large" />
                    </Link>
                </li>
                <li className="mb-2 md:mb-0">
                    <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        title="Profile"
                        className={`flex justify-center items-center ${pathname !== "/profile" ? "text-black bg-white" : "text-[var(--accent)] bg-none"}  hover:text-[var(--accent)] border border-none rounded p-1 text-center   backdrop-blur-md shadow-lg`}
                    >
                        <AccountBoxIcon fontSize="large" />
                    </Link>
                </li>
            </ul>
            {session?.user && <button
                onClick={signOut}
                title="Signout"
                className={`md:flex justify-center items-center text-[var(--background)] ${menuOpen ? "block" : "hidden"} bg-none  hover:text-[var(--accent)] border border-none rounded p-1 text-center   backdrop-blur-md shadow-lg`}
            >
                <LogoutIcon fontSize="large" />
            </button>}

        </nav >)
}