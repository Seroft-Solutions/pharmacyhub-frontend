// src/config/menuItems.ts
import {FaCog, FaPhone, FaTachometerAlt, FaUsers,} from "react-icons/fa";
import {MenuItem} from '@/types/menuItem';
import {  Handshake} from "lucide-react";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: FaTachometerAlt,
    link: "/dashboard",
  },
  {
    title: "Pharmasicts",
    icon: FaUsers,
    link: "/pharmasict",

  },
  {
    title: "Propritors",
    icon: Handshake,
    link: "/propritor",

  },

  {
    title: "Salesmen",
    icon: FaPhone,
    link: "/salesmen",
  },
  {
    title: "Manager",
    icon: FaPhone,
    link: "/manager",
  },
];
