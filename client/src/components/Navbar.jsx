import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SiPlanetscale } from "react-icons/si";
import { IoLogInSharp } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname || "/";

  const activeClass =
    "block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500";
  const defaultClass =
    "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 z-50 h-[70px]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 h-full">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <SiPlanetscale className="h-8 w-8 text-blue-600" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              FlightManager
            </span>
          </Link>

          <div className="flex md:order-2 items-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-md me-2"
            >
              <IoLogInSharp className="w-5 h-5" />
              <span className="text-sm">Login</span>
            </Link>

            {/* Theme toggle icon (visual only) */}
            <button
              type="button"
              aria-label="Toggle theme"
              className="ms-2 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-2 rounded-md"
            >
              <CiDark className="w-5 h-5" />
            </button>

            <button
              type="button"
              data-collapse-toggle="navbar-default"
              aria-controls="navbar-default"
              aria-expanded="false"
              className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-default"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to={"/"}
                  className={isActive("/") ? activeClass : defaultClass}
                  aria-current={isActive("/") ? "page" : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={"/planner"}
                  className={isActive("/planner") ? activeClass : defaultClass}
                >
                  Planner
                </Link>
              </li>
              <li>
                <Link
                  to={"/scheduler"}
                  className={
                    isActive("/scheduler") ? activeClass : defaultClass
                  }
                >
                  Scheduler
                </Link>
              </li>
              <li>
                <Link
                  to={"/map"}
                  className={isActive("/map") ? activeClass : defaultClass}
                >
                  Map
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
