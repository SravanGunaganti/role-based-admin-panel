import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaShoppingCart,
} from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import type { IconType } from "react-icons";

export interface SidebarLink {
  to: string;
  label: string;
  icon: IconType;
}

export const sidebarLinks: Record<
  "admin" | "manager" | "employee",
  SidebarLink[]
> = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: TbLayoutDashboardFilled },
    { to: "/admin/manage-team", label: "Manage Team", icon: FaUsers },
    { to: "/team/manage-products", label: "Manage Products", icon: FaBoxOpen },
    { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
  ],
  manager: [
    { to: "/manager", label: "Dashboard", icon: TbLayoutDashboardFilled },
    { to: "/team/manage-products", label: "Manage Products", icon: FaBoxOpen },
    { to: "/manager/team", label: "My Team", icon: FaUsers },
    { to: "/manager/orders", label: "Team Orders", icon: FaClipboardList },
  ],
  employee: [
    { to: "/employee", label: "Dashboard", icon: TbLayoutDashboardFilled },
    { to: "/products", label: "View Products", icon: FaBoxOpen },
    { to: "/employee/orders", label: "My Orders", icon: FaShoppingCart },
  ],
};
