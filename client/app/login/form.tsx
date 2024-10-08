"use client";

import { useState } from "react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { TriangleAlert, Loader } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

import loginUser from "./loginUser";

const loginFormSchema = z.object({
  userEmail: z.string()
  .min(1, { message: "L'adresse email est requise." })
  .email({ message: "Veuillez saisir une adresse email valide." }),
  userPassword: z.string()
  .min(8, { message: "Le mot de passe doit comporter au moins 8 caractères." })
  .max(64, { message: "Le mot de passe ne doit pas dépasser 64 caractères." })
  .regex(/[a-z]/, { message: "Le mot de passe doit inclure une lettre minuscule." })
  .regex(/[A-Z]/, { message: "Le mot de passe doit inclure une lettre majuscule." })
  .regex(/\d/, { message: "Le mot de passe doit inclure un chiffre." })
  .regex(/[^a-zA-Z0-9]/, { message: "Le mot de passe doit inclure un symbole." })
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userEmail: "",
      userPassword: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const session = await loginUser(values.userEmail, values.userPassword);
    
      if (session.statusCode === 200) {
        window.location.href = `/${session?.url}`;
      }

      else {
        if (session.statusCode === 401) {
          form.setError("userEmail", {
            type: "manual",
            message: session.message
          });

          form.setError("userPassword", {
            type: "manual",
            message: session.message
          });
  
          form.setValue("userPassword", "");
        }

        else if (session.statusCode === 403) {
          setIsError(true);
          setErrorMessage("Compte non activé, veuillez activer votre compte pour vous connecter.");
          form.setValue("userPassword", "");
        }

        else if (session.statusCode === 500) {
          setIsError(true);
          setErrorMessage(session?.message);

          form.setValue("userPassword", "");
        }

        setIsLoading(false);
      }
    }

    catch (error) {
      setIsError(true);
      setErrorMessage("Une erreur s'est produite lors de votre connexion.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Connexion à votre compte</h1>
            <p className="white text-sm text-muted-foreground">Saisissez vos identifiants ci-dessous pour vous connecter à votre compte</p>
          </div>
          { isError && (
            <Alert variant="destructive" className="mt-4">
              <TriangleAlert className="w-5 h-5" />
              <AlertTitle className="text-sm text-primary">Erreur</AlertTitle>
              <AlertDescription className="text-muted-foreground">{errorMessage}</AlertDescription>
            </Alert>
          ) }
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 mt-4">
              <FormField control={form.control} name="userEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="userPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>{isLoading && <Loader className="h-5 w-5 animate-spin mr-2" />}Se connecter</Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Vous n&apos;avez pas de compte?{" "}
            <Link href="/register" className="text-blue-600 text-sm underline underline-offset-4 hover:text-blue-900">S&apos;enregistrer</Link>
          </div>
        </div>
      </div>
    </>
  )
}