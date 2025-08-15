"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Info, 
  TrendingUp, 
  Wallet 
} from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navItems = [
    { id: "trade", label: "Trade", icon: TrendingUp },
    { id: "portfolio", label: "Portfolio", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-center">
        <div className="w-[400px] flex justify-around items-center py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                onClick={() => onTabChange(item.id)}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
