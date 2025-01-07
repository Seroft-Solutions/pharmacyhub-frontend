import {SidebarLayout} from "@/components/NavSideBar/SideBarLayout";
import ProprietorList from "@/components/Proprietor/ProprietorList";

export default function Proprietor() {
  return(
      <SidebarLayout><h1>Proprietor Page</h1>
      <ProprietorList/>
      </SidebarLayout>

  )
}