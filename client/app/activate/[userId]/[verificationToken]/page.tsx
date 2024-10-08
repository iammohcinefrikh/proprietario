import { Metadata } from "next";

import Activation from "./activation";

export const metadata: Metadata = {
  title: "Proprietario - Activation du compte"
};

export default function ActivatePage() {
  return (
    <main className="flex h-screen items-center justify-center p-6">
      <Activation />
    </main>
  );
}