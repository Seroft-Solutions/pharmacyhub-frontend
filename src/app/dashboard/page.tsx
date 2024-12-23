import {Layout} from "lucide-react";
import Navbar from "@/components/NavigationBar/NavigationBar";
import {menuItems} from "@/config/menuItems";

export default function Dashboard() {
  const user = {
    name: "John Doe",
    email: "john@example.com"
  };
  return (
      <><Navbar /><h1>Welcome to dashboard</h1></>

  );

}