import {Button} from "@/components/ui/button";
import {NavItemProps} from "@/components/NavigationBar/NavItem";

const MobileNavItem = ({item}: NavItemProps) => {
  const Icon = item.icon;

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      asChild
    >
      <a href={item.link}>
        <Icon className="mr-2 h-4 w-4"/>
        {item.title}
      </a>
    </Button>
  );
};

export default MobileNavItem;