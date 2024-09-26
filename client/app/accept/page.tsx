import { Metadata } from "next";

import { CircleX } from "lucide-react";

export const metadata: Metadata = {
  title: "Proprietario - Activation du compte"
};

export default function AcceptPage() {
  return (
    <main className="flex h-screen items-center justify-center p-6">
      <div className="flex flex-col justify-center items-center sm:w-[350px]">
        <CircleX className="h-14 w-14 stroke-rose-600" />
        <h1 className="text-2xl font-semibold tracking-tight mt-6 text-center">Erreur d'acceptation d'invitation</h1>
        <p className="white text-sm text-muted-foreground mt-2 mb-6 text-center">Le lien d'acceptation n'est pas valide, veuillez vérifier s'il est valide et réessayer.</p>
      </div>
    </main>
  )
}