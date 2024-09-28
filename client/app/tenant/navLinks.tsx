"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LineChart, Users, LayoutDashboard, House, Info, MessagesSquare, Files, KeyRound} from "lucide-react";

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <>
      <Link href="/tenant" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/tenant" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}>
        <LayoutDashboard className="h-4 w-4" />
        Tableau de bord
      </Link>
      <Link href="/tenant/properties" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/tenant/properties" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}>
        <House className="h-4 w-4" />
        Propriétés
      </Link>
      <Link href="/tenant/landlords" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${pathname === "/tenant/landlords" ? "bg-muted text-primary" : "text-muted-foreground"} transition-all hover:text-primary`}>
        <Users className="h-4 w-4" />
        Propriétaires
      </Link>
      <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <KeyRound className="h-4 w-4" />
        Locations
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