"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import type { MenuItem } from "@/types/shared";
import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSwipe } from "@/hooks/useSwipe";
import { useFavorites } from "@/hooks/useFavorites";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSidebarProps {
  items: MenuItem[];
  logo: React.ReactNode;
}

interface SidebarItemProps {
  item: MenuItem;
  onItemClick?: () => void;
  isSelected?: boolean;
  tabIndex?: number;
  showFavorite?: boolean;
}

function SidebarItem({ 
  item, 
  onItemClick, 
  isSelected,
  tabIndex = 0,
  showFavorite = true
}: SidebarItemProps) {
  const pathname = usePathname();
  const { canAccess } = usePermissions();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isActive = pathname === item.href;

  if (!canAccess({
    permissions: item.permissions,
    roles: item.roles,
    requireAll: false
  })) {
    return null;
  }

  const Icon = item.icon;
  const itemIsFavorite = isFavorite(item.href);

  return (
    <div className="group relative">
      <Link
        href={item.href}
        onClick={onItemClick}
        tabIndex={tabIndex}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors outline-none",
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100",
          isSelected && "ring-2 ring-blue-400",
          "focus-visible:ring-2 focus-visible:ring-blue-400"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="truncate flex-1">{item.label}</span>
        {showFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
              itemIsFavorite && "opacity-100 text-yellow-500"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(item.href);
            }}
          >
            <Star className={cn("h-4 w-4", itemIsFavorite && "fill-current")} />
          </Button>
        )}
      </Link>
    </div>
  );
}

export function MobileSidebar({ items, logo }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { favorites } = useFavorites();

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => setIsOpen(false),
    onSwipeRight: () => setIsOpen(true),
    threshold: 100
  });

  // Group and filter items
  const { favoriteItems, categories } = useMemo(() => {
    const favItems = items.filter(item => favorites.includes(item.href));
    
    const categoryMap = new Map<string, MenuItem[]>();
    
    items.forEach(item => {
      const category = item.category || "General";
      const existingItems = categoryMap.get(category) || [];
      if (!favorites.includes(item.href)) {
        categoryMap.set(category, [...existingItems, item]);
      }
    });

    const filteredCategories = Array.from(categoryMap.entries())
      .map(([name, categoryItems]) => ({
        name,
        items: categoryItems.filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }))
      .filter(category => category.items.length > 0);

    return {
      favoriteItems: favItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      categories: filteredCategories
    };
  }, [items, favorites, searchQuery]);

  // Reset states when route changes
  const pathname = usePathname();
  useEffect(() => {
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  }, [pathname]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [...favoriteItems, ...categories.flatMap(c => c.items)];
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allItems.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < allItems.length) {
          const selectedItem = allItems[selectedIndex];
          router.push(selectedItem.href);
          setIsOpen(false);
          setSearchQuery("");
          setSelectedIndex(-1);
        }
        break;
      case "Escape":
        if (searchQuery) {
          e.preventDefault();
          setSearchQuery("");
          setSelectedIndex(-1);
        }
        break;
      case "/":
        if (e.target === searchInputRef.current) return;
        e.preventDefault();
        searchInputRef.current?.focus();
        break;
    }
  };

  return (
    <>
      <div
        className="fixed inset-y-0 left-0 w-8 md:hidden"
        {...swipeHandlers}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-[80%] max-w-[320px] p-0"
          {...swipeHandlers}
        >
          <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>
            <div className="p-4 border-b">
              {logo}
            </div>
            
            {/* Search Box */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search menu... ('/' to focus)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  className="pl-8 w-full"
                />
              </div>
              {searchQuery && (
                <div className="mt-2 text-xs space-y-1 text-gray-500">
                  <p>Use ↑↓ to navigate</p>
                  <p>Enter to select</p>
                  <p>Escape to clear search</p>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto">
              {/* Favorites Section */}
              <AnimatePresence initial={false}>
                {favoriteItems.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b"
                  >
                    <div className="p-2">
                      <h2 className="px-2 text-sm font-medium text-gray-500 mb-2">
                        Favorites
                      </h2>
                      <div className="space-y-1">
                        {favoriteItems.map((item, index) => (
                          <SidebarItem
                            key={item.href}
                            item={item}
                            isSelected={index === selectedIndex}
                            onItemClick={() => {
                              setIsOpen(false);
                              setSearchQuery("");
                              setSelectedIndex(-1);
                            }}
                            tabIndex={index === selectedIndex ? 0 : -1}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Categories */}
              <Accordion
                type="multiple"
                defaultValue={categories.map(c => c.name)}
                className="p-2"
              >
                {categories.map((category) => (
                  <AccordionItem key={category.name} value={category.name}>
                    <AccordionTrigger className="px-2 hover:no-underline">
                      <span className="text-sm font-medium text-gray-600">
                        {category.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        {category.items.map((item, index) => {
                          let globalIndex = favoriteItems.length;
                          for (let i = 0; i < categories.indexOf(category); i++) {
                            globalIndex += categories[i].items.length;
                          }
                          globalIndex += index;

                          return (
                            <SidebarItem
                              key={item.href}
                              item={item}
                              isSelected={globalIndex === selectedIndex}
                              onItemClick={() => {
                                setIsOpen(false);
                                setSearchQuery("");
                                setSelectedIndex(-1);
                              }}
                              tabIndex={globalIndex === selectedIndex ? 0 : -1}
                            />
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}