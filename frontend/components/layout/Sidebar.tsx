"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  CalendarPlus,
  Sparkles,
  LogOut,
  Dumbbell,
  Users,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/ui/Avatar";

const getNavItems = (role?: string) => {
  const baseItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  if (role === "ROLE_USER") {
    return [
      ...baseItems,
      { href: "/booking", label: "Booking", icon: CalendarPlus },
      { href: "/recommendation", label: "Rekomendasi AI", icon: Sparkles },
      { href: "/profile", label: "Profil", icon: LayoutDashboard },
    ];
  }

  if (role === "ROLE_TRAINER") {
    return [
      ...baseItems,
      {
        href: "/trainer/bookings",
        label: "Jadwal Booking",
        icon: CalendarPlus,
      },
      { href: "/trainer/profile", label: "Profil", icon: LayoutDashboard },
    ];
  }

  if (role === "ROLE_ADMIN") {
    return [
      ...baseItems,
      { href: "/admin/trainers", label: "Kelola Trainer", icon: Users },
      { href: "/admin/stats", label: "Statistik", icon: BarChart3 },
    ];
  }

  return baseItems;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navItems = getNavItems(user?.role);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0A0F1E] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Dumbbell size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Trai<span className="text-indigo-400">no</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5",
              )}
            >
              <item.icon
                size={20}
                className={isActive ? "text-indigo-400" : ""}
              />
              {item.label}
              {item.label === "Rekomendasi AI" && (
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-3">
          <Avatar src={user?.profilePictureUrl} name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full cursor-pointer"
        >
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
