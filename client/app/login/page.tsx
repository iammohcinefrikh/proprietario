import { Metadata } from "next";

import LoginForm from "./form";

export const metadata: Metadata = {
  title: "Proprietario - Se connecter"
};

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center p-6">
      <LoginForm /> 
    </div>
  )
}