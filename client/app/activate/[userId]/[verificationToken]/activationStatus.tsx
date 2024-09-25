"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import activateAccount from "./activateAccount";
import { CircleAlert, CircleCheck, CircleX, Loader } from "lucide-react";
import Link from "next/link";

const paramsSchema = z.object({
  userId: z.string().transform((val) => parseInt(val, 10)),
  verificationToken: z.string().length(64).regex(/^[A-Za-z0-9]+$/),
});

export default function ActivationStatus() {
  const params = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorCode, setErrorCode] = useState<number>();

  useEffect(() => {
    const activateUserAccount = async () => {
      const result = paramsSchema.safeParse({
        userId: params.userId,
        verificationToken: params.verificationToken,
      });
  
      if (result.success) {
        const response = await activateAccount(result.data.userId, result.data.verificationToken);
        
        if (response.statusCode === 200) {
          setIsSuccess(true);
        }

        else {
          setIsError(true);
          setErrorCode(response.statusCode);
          setErrorMessage(response.message);
        }
      }
      
      else {
        setIsError(true);
        setErrorMessage("Une erreur s'est produite lors de l'activation du compte.");
      }

      setIsLoading(false);
    };
  
    activateUserAccount();
  }, [params]);

  return (
    <main className="flex h-screen items-center justify-center p-6">
      {isLoading ? (
        <div className="flex flex-row">
          <Loader className="animate-spin" />
          <p className="ml-3">Activation de votre compte...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col justify-center items-center sm:w-[350px]">
          { errorCode === 409 ? (<CircleAlert className="h-14 w-14 stroke-yellow-500" />) : (<CircleX className="h-14 w-14 stroke-rose-600" />)}
          <h1 className="text-2xl font-semibold tracking-tight mt-6 text-center">Erreur d'activation du compte</h1>
          <p className="white text-sm text-muted-foreground mt-2 mb-6 text-center">{errorMessage}</p>
          { errorCode === 409 ? (<Link href="/login" className="text-blue-600 text-sm underline underline-offset-4 hover:text-blue-900">Connectez-vous à votre compte</Link>) : ("")}
        </div>
      ) : isSuccess ? (
        <div className="flex flex-col justify-center items-center sm:w-[350px]">
          <CircleCheck className="h-14 w-14 stroke-green-600" />
          <h1 className="text-2xl font-semibold tracking-tight mt-6 text-center">Compte activé avec succès</h1>
          <p className="white text-sm text-muted-foreground mt-2 mb-6 text-center">Votre compte a été activé avec succès, vous pouvez désormais vous connecter en utilisant vos identifiants.</p>
          <Link href="/login" className="text-blue-600 text-sm underline underline-offset-4 hover:text-blue-900">Connectez-vous à votre compte</Link>
        </div>
      ) : null}
    </main>
  );
}