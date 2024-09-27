import Image from "next/image";
import Link from "next/link";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <header className="w-full">
        <div className="container flex flex-row flex-1 justify-between items-center h-16">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Image src={`/images/proprietario-logo.svg`} alt="Proprietario Logo" width="142" height="20" />
            </Link>
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:space-x-2 lg:justify-end">
            <Link href="/login">
              <Button variant="outline" className="mr-2">Se connecter</Button>
            </Link>
            <Link href="/register">
              <Button>Créer un compte</Button>
            </Link>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <Link href="/login" className="text-sm font-medium">
                    Se connecter
                  </Link>
                  <Link href="/register" className="text-sm font-medium">
                    Créer un compte
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex flex-1 justify-center items-center">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl/none">Maximisez les profits,<br />minimisez le stress.</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 mt-5 md:text-base dark:text-gray-400">Comptez sur Proprietario pour rendre vos résidents encore plus heureux.</p>
          <Link href="/register">
            <Button className="rounded-full mt-3">Commencez maintenant</Button>
          </Link>
        </div>
      </main>

      <footer className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Proprietario - Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-gray-500 dark:text-gray-400 hover:underline underline-offset-4" href="/terms">
            Conditions de Service
          </Link>
          <Link className="text-xs text-gray-500 dark:text-gray-400 hover:underline underline-offset-4" href="/privacy">
            Politique de Confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  )
}