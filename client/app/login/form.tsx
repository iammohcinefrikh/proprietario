"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import setSession from "@/utils/setSessionUtil";

const loginFormSchema = z.object({
  userEmail: z.string()
    .min(1, { message: "L'adresse email est requise." })
    .email({ message: "Veuillez saisir une adresse email valide." }),
  userPassword: z.string()
    .min(8, { message: "Veuillez saisir un mot de passe valide." })
    .max(32, { message: "Le mot de passe est trop long." })
});

export default function LoginForm() {
  const router = useRouter();

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
    try {
      const session = await setSession(values.userEmail, values.userPassword);
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");
    
      if (session?.statusCode === 200) {
        setIsLoading(false);

        router.push(`/${session?.url}`);
        router.refresh();
      }

      else {
        if (session?.statusCode === 401) {
          form.setError("userEmail", {
            type: "manual",
            message: session?.message
          });

          form.setError("userPassword", {
            type: "manual",
            message: session?.message
          });
  
          form.setValue("userPassword", "");
          setIsLoading(false);
        }

        else if (session?.statusCode === 500) {
          setIsError(true);
          setErrorMessage(session?.message);

          form.setValue("userPassword", "");
          setIsLoading(false);
        }
      }
    }

    catch (error) {
      return;
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
              <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.25 0.25C9.87663 0.25 7.55655 0.953788 5.58316 2.27236C3.60977 3.59094 2.0717 5.46508 1.16345 7.6578C0.255199 9.85051 0.0175594 12.2633 0.480582 14.5911C0.943605 16.9189 2.08649 19.057 3.76472 20.7353C5.44295 22.4135 7.58115 23.5564 9.90892 24.0194C12.2367 24.4824 14.6495 24.2448 16.8422 23.3365C19.0349 22.4283 20.9091 20.8902 22.2276 18.9168C23.5462 16.9434 24.25 14.6234 24.25 12.25C24.2466 9.06843 22.9813 6.01814 20.7316 3.76843C18.4819 1.51872 15.4316 0.25336 12.25 0.25ZM11.3269 6.71154C11.3269 6.46672 11.4242 6.23193 11.5973 6.05882C11.7704 5.88571 12.0052 5.78846 12.25 5.78846C12.4948 5.78846 12.7296 5.88571 12.9027 6.05882C13.0758 6.23193 13.1731 6.46672 13.1731 6.71154V13.1731C13.1731 13.4179 13.0758 13.6527 12.9027 13.8258C12.7296 13.9989 12.4948 14.0962 12.25 14.0962C12.0052 14.0962 11.7704 13.9989 11.5973 13.8258C11.4242 13.6527 11.3269 13.4179 11.3269 13.1731V6.71154ZM12.25 18.7115C11.9762 18.7115 11.7085 18.6303 11.4808 18.4782C11.2531 18.326 11.0756 18.1098 10.9708 17.8568C10.866 17.6038 10.8386 17.3254 10.892 17.0568C10.9454 16.7882 11.0773 16.5415 11.2709 16.3478C11.4646 16.1542 11.7113 16.0223 11.9799 15.9689C12.2485 15.9155 12.5269 15.9429 12.7799 16.0477C13.0329 16.1525 13.2491 16.33 13.4013 16.5577C13.5534 16.7854 13.6346 17.0531 13.6346 17.3269C13.6346 17.6941 13.4887 18.0463 13.2291 18.306C12.9694 18.5657 12.6172 18.7115 12.25 18.7115Z" fill="currentColor"/>
              </svg>
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
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>Se connecter{isLoading && "..."}</Button>
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