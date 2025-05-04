export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "HOME",
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/admin",
      },
    ],
  },
  {
    heading: "UTILITIES",
    children: [
      {
        name: "Typography",
        icon: "solar:text-circle-outline",
        id: uniqueId(),
        url: "/admin/ui/typography",
      },
      {
        name: "Table",
        icon: "solar:bedside-table-3-linear",
        id: uniqueId(),
        url: "/admin/ui/table",
      },
      {
        name: "Form",
        icon: "solar:password-minimalistic-outline",
        id: uniqueId(),
        url: "/admin/ui/form",
      },
      {
        name: "Shadow",
        icon: "solar:airbuds-case-charge-outline",
        id: uniqueId(),
        url: "/admin/ui/shadow",
      },
    ],
  },
  {
    heading: "AUTH",
    children: [
      {
        name: "Login",
        icon: "solar:login-2-linear",
        id: uniqueId(),
        url: "/auth/login",
      },
      {
        name: "Register",
        icon: "solar:shield-user-outline",
        id: uniqueId(),
        url: "/auth/register",
      },
    ],
  },
  {
    heading: "EXTRA",
    children: [
      {
        name: "Icons",
        icon: "solar:smile-circle-outline",
        id: uniqueId(),
        url: "admin/icons/solar",
      },
      {
        name: "Sample Page",
        icon: "solar:notes-minimalistic-outline",
        id: uniqueId(),
        url: "admin/sample-page",
      },
    ],
  },
];

export default SidebarContent;
