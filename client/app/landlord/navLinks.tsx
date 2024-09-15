"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LineChart, Users, LayoutDashboard, Building, House, Info, MessagesSquare, Files} from "lucide-react";

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <>
      <Link href="/landlord" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/landlord" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}>
        <LayoutDashboard className="h-4 w-4" />
        Tableau de bord
      </Link>
      <Link href="/landlord/units" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/landlord/units" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}>
        <House className="h-4 w-4" />
        Unités
      </Link>
      <Link href="/landlord/buildings" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/landlord/buildings" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}>
        <Building className="h-4 w-4" />
        Bâtiments
      </Link>
      <Link href="/landlord/tenants" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/landlord/tenants" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}>
        <Users className="h-4 w-4" />
        Locataires
      </Link>
      <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <LineChart className="h-4 w-4" />
        Finances
      </Link>
      <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <Info className="h-4 w-4" />
        Demandes
      </Link>
      <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <MessagesSquare className="h-4 w-4" />
        Messages
      </Link>
      <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <Files className="h-4 w-4" />
        Documents
      </Link>
    </>
  )
}