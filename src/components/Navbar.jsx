import React from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full bg-red flex flex-col justify-center">
      <ul className="flex justify-center gap-[200px] p-7">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {" "}
          <li className="p-1">SubdomainFind</li>
        </NavLink>
        <NavLink
          to="/portScan"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {" "}
          <li className="p-1">Port Scan</li>
        </NavLink>
        <NavLink
          to="/crawl"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {" "}
          <li className="p-1">Crawling</li>
        </NavLink>
      </ul>
      <div className="w-full border-2"></div>
    </div>
  );
};

export default Navbar;
