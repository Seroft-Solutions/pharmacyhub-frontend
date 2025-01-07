import {SidebarLayout} from "@/components/NavSideBar/SideBarLayout";
import SalesmanList from "@/components/Salesman/SalesmanList";

export default function Salesman() {
  return(
      <SidebarLayout><h1>Salesman Page</h1>
      <SalesmanList/>
      </SidebarLayout>
  )
}