import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.webp";
import { toast } from 'react-toastify';



interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (user) navigate(`/${user.role}`);
  }, [user]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate(`/${user?.role}`);
    } catch(e:any) {
      toast.error(e?.message|| "Login failed Try again!")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-xl w-80">
        <div className="w-full flex justify-center items-center mb-4">
          <img src={logo} alt="Logo" className={`w-10`} />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mb-4">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            minLength={6}
            placeholder="Enter password"
            className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
          <p className="text-red-600 text-sm mb-4">{errors.password.message}</p>
        )}
        </div>
        
        <button
          disabled={isSubmitting}
          className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 shadow-lg">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
