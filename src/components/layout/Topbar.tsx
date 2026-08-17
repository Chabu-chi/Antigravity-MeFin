"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-gray-200 dark:border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:text-primary-500 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-red rounded-full border-2 border-background"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white font-bold">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-foreground">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {session?.user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
