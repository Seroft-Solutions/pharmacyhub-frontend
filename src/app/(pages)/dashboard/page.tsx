
import {SidebarLayout} from "@/components/NavSideBar/SideBarLayout";
import { protectRoute } from '../../../../lib/auth/protect-route';

export default async function Dashboard() {
  await protectRoute();

  return (
    
      <h1>Dashboard Page</h1>
    

  )
}
