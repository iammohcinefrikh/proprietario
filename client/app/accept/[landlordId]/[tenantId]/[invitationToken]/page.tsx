import { Metadata } from "next";

import Invitation from "./invitation";

export const metadata: Metadata = {
  title: "Proprietario - Activation du compte"
};

export default function AcceptPage() {
  return (
    <main className="flex h-screen items-center justify-center p-6">
      <Invitation />
    </main>
  );
}