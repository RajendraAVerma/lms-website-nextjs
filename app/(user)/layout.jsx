"use client";

import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import { Button, CircularProgress } from "@nextui-org/react";

export default function Layout({ children }) {
  return (
    <>
      <AuthContextProvider>
        <CheckUser>{children}</CheckUser>
      </AuthContextProvider>
    </>
  );
}

function CheckUser({ children }) {
  const { user, handleSignInWithGoogle, isLoading } = useAuth();
  if (user === undefined) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex flex-col h-screen w-screen justify-center items-center">
        <h1 className="mb-4">Please Logged In First</h1>
        <Button
          onClick={handleSignInWithGoogle}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Sign In
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}
