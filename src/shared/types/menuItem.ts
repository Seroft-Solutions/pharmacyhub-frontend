// src/types/menuItem.ts
import {IconType} from 'react-icons';

export interface MenuItem {
  title: string;
  icon: IconType;
  link?: string;
  requiredRole?: string;
  subItems?: MenuItem[];
}