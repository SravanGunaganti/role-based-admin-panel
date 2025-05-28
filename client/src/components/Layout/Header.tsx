import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaBars } from "react-icons/fa";
import logo from "../../assets/logo.webp";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, handleLabels, hideLabels } = useAuth();
  const [displayProfile, setDisplayProfile] = useState<boolean>(false);

  const toggleProfile = () => {
    setDisplayProfile((prev: boolean) => !prev);
  };

  return (
    <header className="bg-white   md:px-4 md:py-1 md:rounded-lg flex flex-col justify-between items-center border border-gray-200">
      <div className="w-full flex justify-center items-center gap-2 md:hidden bg-white p-2">
        <h1 className="font-outfitbold text-2xl text-blue-600  flex items-center gap-2">
          CHANGE
          <img src={logo} alt="Logo" className={`w-10 rounded-md`} /> NETWORKS
        </h1>
      </div>
      <div className="w-full flex justify-between px-4 py-3 md:px-0 md:py-0">
        <div className="md:hidden flex items-center bg-brand border border-gray-200 p-3 rounded-xl">
          <button
            className=" text-gray-700 focus:outline-none"
            onClick={onMenuToggle}>
            <FaBars size={25} />
          </button>
        </div>

        <div className="flex md:w-full text-blue-600 justify-center md:justify-between items-center">
          {hideLabels ? (
            <button
              className="hidden md:flex"
              onClick={() => handleLabels(false)}>
              <IoIosArrowDroprightCircle fontSize={25} />
            </button>
          ) : (
            <button
              className="hidden md:flex"
              onClick={() => handleLabels(true)}>
              <IoIosArrowDropleftCircle fontSize={25} />
            </button>
          )}
          <div className="flex relative items-center gap-4">
            {" "}
            <strong
              className={`flex gap-1 py-2 text-sm ${hideLabels ? "justify-center" : "justify-start px-2"} text-gray-900 items-center`}>
              <button
                onClick={() => toggleProfile()}
                className="leading-none  bg-blue-600 rounded-full flex justify-center items-center text-white w-[30px] h-[30px]">
                {user?.name.charAt(0).toUpperCase()}
              </button>
              {displayProfile && (
                <div className="bg-white text-gray-600 border border-blue-200 flex flex-col w-fit font-medium text-nowrap p-4 rounded-lg absolute z-10 top-[100%] shadow-lg right-[50%]">
                  <button
                    className="flex justify-end"
                    onClick={() => toggleProfile()}>
                    <IoCloseCircleOutline
                      fontSize={25}
                      className="bg-red-800 border border-red-200 ring-1 rounded-full text-white"
                    />
                  </button>
                  <span className="text-blue-600">Name: </span>
                  <p className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {user?.name}
                  </p>
                  <span className="text-blue-600">Email:</span>
                  <p className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {user?.email}
                  </p>
                </div>
              )}

              {
                <span className="text-nowrap font-bold capitalize">
                  {user?.role}
                </span>
              }
            </strong>
          </div>
        </div>
      </div>
    </header>
  );
};
