import {Button} from "@/components/ui/button";
import {MenuItem} from "@/types/menuItem";

export interface NavItemProps {
  item: MenuItem;
}

const NavItem = ({item}: NavItemProps) => {
  const Icon = item.icon;

  return (
    <Button
      variant="ghost"
      className="flex items-center space-x-2 h-12 px-4 hover:bg-accent"
      asChild
    >
      <a href={item.link}>
        <Icon className="h-4 w-4"/>
        <span>{item.title}</span>
      </a>
    </Button>
  );
};
export default NavItem;