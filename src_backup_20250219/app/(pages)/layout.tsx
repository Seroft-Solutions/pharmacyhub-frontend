import { SidebarLayout } from "@/components/NavSideBar/SideBarLayout";

export default function AuthLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}