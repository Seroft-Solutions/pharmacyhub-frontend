import {SidebarLayout} from "@/components/NavSideBar/SideBarLayout";
import PharmacyManagerList from "@/components/PharmacyManager/PharmacyManagerList";

export default function PharmacyManager() {
  return(
      <SidebarLayout>
      <h1>Manager Page</h1>
        <PharmacyManagerList/>
      </SidebarLayout>
  )
}