import React, { useState } from "react";
import type { IUser } from "../../types";
import { FaPlus } from "react-icons/fa";
import { useUsers } from "../../context/UsersContext";
import ConfirmBox from "../../components/ConfirmBox";
import SuccessBox from "../../components/SuccessBox";
import { toast } from "react-toastify";

const ManageUsers: React.FC = () => {
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<IUser>({
    name: "",
    email: "",
    password: "",
    role: "employee",
    managerId: undefined,
  });
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { users, deleteUser, addUser, updateUser } = useUsers();
  const managers = users.filter((user) => user.role === "manager");
  const employees = users.filter((user) => user.role === "employee");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEdit = (emp: IUser) => {
    setIsAddingUser(true);
    setIsEditingUser(true);
    setNewUser({
      _id: emp._id,
      name: emp.name,
      email: emp.email,
      password: "",
      role: emp.role,
      managerId: emp.managerId || undefined,
    });
    const container = document.getElementById("main");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: name === "role" && value === "manager" ? value : value,
      ...(name === "role" && value === "employee"
        ? { managerId: undefined }
        : {}),
    }));
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewUser((prev) => ({
      ...prev,
      managerId: e.target.value || undefined,
    }));
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "employee",
      managerId: undefined,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditingUser) {
        if (newUser.role === "manager") {
          newUser.managerId = undefined;
        }
        updateUser(newUser);
      } else {
        await addUser(newUser);
      }

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "employee",
        managerId: undefined,
      });
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create/update user");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignManager = async (employee: IUser, managerId: string) => {
    setIsEditingUser(true);
    await updateUser({ ...employee, managerId });
    setShowSuccess(true);
  };

  const handleDelete = (id: any) => {
    setDeleteUserId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteUserId) {
      deleteUser(deleteUserId);
    }
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
    setShowConfirm(false);
  };

  const hideSuccess = () => {
    setShowSuccess(false);
    setDeleteUserId(null);
    setIsEditingUser(false);
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
          Team Management
        </h1>
        <div className="">
          <div className="flex justify-center">
            {isAddingUser ? (
              <form
                onSubmit={handleSubmit}
                className="mb-8 w-full max-w-md bg-white border border-gray-200 p-6 rounded-lg outline-0">
                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Enter Name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                    type="text"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                    type="email"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required={!isEditingUser}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                    type="password"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                    required>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                {newUser.role === "employee" && (
                  <div className="mb-4">
                    <label
                      className="block mb-1 font-medium"
                      htmlFor="managerId">
                      Assign Manager
                    </label>
                    <select
                      id="managerId"
                      name="managerId"
                      value={newUser.managerId || ""}
                      onChange={handleManagerChange}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0">
                      <option value="">Select Manager</option>
                      {managers.map((mgr) => (
                        <option key={mgr._id} value={mgr._id}>
                          {mgr.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    {loading
                      ? "Saving..."
                      : isEditingUser
                        ? "Update"
                        : "Add Team Memeber"}
                  </button>

                  {isEditingUser && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <button
                className=" w-fit flex justify-center items-center bg-blue-500 px-4 py-2 text-white rounded-lg border border-gray-200 hover:bg-blue-600 transition gap-2 mb-4"
                onClick={() => setIsAddingUser(true)}>
                Add Team Member{" "}
                <strong className="text-xl flex justify-center items-center">
                  <FaPlus />
                </strong>
              </button>
            )}
          </div>
          {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
        </div>

        <h2 className="text-xl font-semibold mb-4">Managers</h2>
        <div className="bg-gray-100 border border-gray-300 rounded-lg w-full overflow-hidden">
          {managers.length === 0 ? (
            <p className="text-gray-500">No managers added yet.</p>
          ) : (
            <div className="max-w-full overflow-x-auto max-h-[500px] overflow-y-auto text-nowrap">
              <table className="min-w-full text-sm text-left h-full rounded-md">
                <thead className=" text-blue-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Employees Count</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager, index) => {
                    const employeeCount = employees.filter(
                      (emp) => emp.managerId === manager._id
                    ).length;
                    return (
                      <tr
                        key={manager._id}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-4 py-3 font-medium">
                          {manager.name}
                        </td>
                        <td className="px-4 py-3">{manager.email}</td>
                        <td className="px-4 py-3">{employeeCount}</td>
                        <td className="flex p-3 gap-3">
                          <button
                            onClick={() => handleEdit(manager)}
                            className="text-blue-700 bg-blue-50 border-[1px] border-gray-200 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(manager._id)}
                            className="bg-red-100 border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-6">Employees</h2>

        <div className="bg-gray-100 border border-gray-300 rounded-lg w-full overflow-hidden">
          {employees.length === 0 ? (
            <p className="text-gray-500">No employees added yet.</p>
          ) : (
            <div className="w-[100%] max-h-[500px] overflow-y-auto overflow-x-auto text-nowrap">
              <table className="w-[100%] h-full text-sm text-left">
                <thead className="text-blue-600 uppercase text-xs">
                  <tr className="">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Manager</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr
                      key={emp._id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="px-4 py-3 font-medium">{emp.name}</td>
                      <td className="px-4 py-3">{emp.email}</td>
                      <td className="px-4 py-3">
                        {!emp.managerId ? (
                          <select
                            className="bg-white border border-gray-300 rounded px-2 py-1 w-full"
                            value={emp.managerId || ""}
                            onChange={(e) =>
                              handleAssignManager(emp!, e.target.value)
                            }>
                            <option value="">Select Manager</option>
                            {managers.map((m) => (
                              <option key={m._id} value={m._id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>
                            {managers.find((m) => m._id === emp.managerId)
                              ?.name || "Not Assigned"}
                          </span>
                        )}
                      </td>
                      <td className="flex p-3 gap-3">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="text-blue-700 bg-blue-50 border-[1px] border-gray-200 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-200 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showConfirm && (
        <ConfirmBox
          message="Are you sure you want to delete?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {showSuccess && (
        <SuccessBox
          message={
            isEditingUser
              ? "User Updated Successfully"
              : deleteUserId
                ? "User Deleted Successfully"
                : "User Added Successfully"
          }
          onClose={hideSuccess}
        />
      )}
    </>
  );
};

export default ManageUsers;
