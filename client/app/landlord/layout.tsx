import Image from "next/image";

import { Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

import NavigationLinks from "./navLinks";
import ProfileMenu from "../profileMenu";

export default function Landlord({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <Image src={`/images/proprietario-logo.svg`} alt="Proprietario Logo" width="142" height="20" />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavigationLinks />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-[60px] items-center gap-4 border-b bg-muted/40 px-4 lg:h-[65px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 rounded-full md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Basculer le menu de navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Image src={`/images/proprietario-logo.svg`} alt="Proprietario Logo" width="142" height="20" />
                <NavigationLinks />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto">
            <ProfileMenu />
          </div>
        </header>
        <main className="p-4 lg:p-6 h-full">
          {children}
        </main>
      </div>
    </div>
  )
}