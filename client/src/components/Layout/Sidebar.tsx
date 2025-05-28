import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarLinks } from "../../constants/sidebarConfig";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.webp";
import { FaSignOutAlt } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, hideLabels } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (!user) return null;

  const links = sidebarLinks[user.role as keyof typeof sidebarLinks];

  return (
    <aside
      className={`fixed top-0 left-0 h-full ${!hideLabels ? "w-64" : "w-fit"} text-gray-900 md:pl-4 md:py-4 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static flex justify-start`}>
      <div className="bg-white h-full w-full border border-gray-200 flex flex-col md:rounded-xl justify-between p-4">
        <div>
          <div className="flex justify-between items-center mb-4 gap-2">
            <div
              className={`flex items ${hideLabels ? "justify-center" : "justify-start"} items-center gap-2`}>
              <img src={logo} alt="Logo" className={`w-10 rounded-md`} />
              {!hideLabels && (
                <h1
                  className="font-outfitbold leading-none
         font-extrabold">
                  <strong>CHANGE NETWORKS</strong>
                </h1>
              )}
            </div>
            <button className="md:hidden text-gray-900" onClick={onClose}>
              <strong>
                <IoCloseCircle fontSize={25} />
              </strong>
            </button>
          </div>

          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center ${hideLabels ? "justify-center" : "justify-start px-3"} gap-3 py-2 rounded-lg hover:bg-[#ecf3ff] text-blue-600 hover:text-blue-600 ${
                  isActivePath(to, true)
                    ? "bg-blue-600 text-white border-[1px] border-gray-200 hover:bg-blue-600 hover:text-white"
                    : ""
                }`}
                onClick={onClose}>
                <Icon size={20} />
                {!hideLabels && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className=" flex flex-col justify-center gap-2 items-start">
          <strong
            className={`md:hidden flex gap-3 py-2 text-sm justify-start px-2 text-gray-900 items-center`}>
            <span className="leading-none bg-blue-600 rounded-full flex justify-center items-center text-white w-[30px] h-[30px]">
              {user?.name.charAt(0).toUpperCase()}
            </span>
            {!hideLabels && <span className="text-blue-600">{user?.name}</span>}
          </strong>

          <button
            className={`w-full py-2 flex text-sm gap-3 text-blue-600 ${hideLabels ? "justify-center" : "justify-start px-3"}   text-black rounded-lg hover:bg-red-50 font-bold hover:text-red-600 hover:border-[1px] border-gray-200 flex items-center`}
            onClick={logout}>
            <FaSignOutAlt fontSize={25} />
            {!hideLabels && <span className="">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
