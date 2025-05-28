import React from "react";
import { useOrders } from "../../context/OrderContext";
import { useUsers } from "../../context/UsersContext";

const ManagerTeam: React.FC = () => {
  const { team } = useUsers();
  const { teamOrders } = useOrders();

  return (
    <div className="w-full">
      <h1 className="text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
        My Team
      </h1>
      <div className="bg-white rounded shadow p-4 w-full overflow-hidden">
        {team?.length === 0 ? (
          <p className="text-gray-500">No employees assigned yet.</p>
        ) : (
          <div className="w-[100%] overflow-x-auto">
            <table className="w-[100%] text-sm text-left">
              <thead className="text-gray-600 uppercase text-xs">
                <tr className="">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Orders</th>
                </tr>
              </thead>
              <tbody>
                {team.map((emp, index) => (
                  <tr
                    key={emp._id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="px-4 py-3 font-medium">{emp.name}</td>
                    <td className="px-4 py-3">{emp.email}</td>
                    <td className="px-4 py-3">
                      {teamOrders?.filter(
                        (order) => order?.employeeId === emp._id
                      ).length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerTeam;
