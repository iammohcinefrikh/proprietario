import { Metadata } from "next";

import RegisterForm from "./form";

export const metadata: Metadata = {
  title: "Proprietario - S'enregistrer"
};

export default function Register() {
  return (
    <div className="flex h-screen items-center justify-center p-6">
      <RegisterForm />
    </div>
  )
}