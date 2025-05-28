import React from "react";
import { FaCheck } from "react-icons/fa";

interface SuccessBoxProps {
  message: string;
  onClose: () => void;
}

const SuccessBox: React.FC<SuccessBoxProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-50/60 bg">
      <div className="bg-white border border-gray-200 flex flex-col gap-4 justify-center items-center text-center p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-center bg-green-200 border border-green-200 p-3 w-fit rounded-full ">
          <FaCheck fontSize={30} className="text-green-500" />
        </div>
        <p className="text-gray-600 mb-2 text-center">{message}</p>
        <div className="flex">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessBox;
