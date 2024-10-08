"use client";

import { UserRound } from "lucide-react";

import destroySession from "../utils/destroySessionUtil";

import { Button } from "../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

export default function ProfileMenu() {
  const handleLogout = async () => {
    await destroySession();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserRound className="h-5 w-5" />
          <span className="sr-only">Afficher le menu utilisateur</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Paramètres</DropdownMenuItem>
        <DropdownMenuItem>Aide</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}