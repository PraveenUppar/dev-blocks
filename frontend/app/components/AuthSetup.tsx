"use client";
// Purpose: Connects Clerk to Axios - (Runs once on app load)

import { useAuth } from "@clerk/nextjs";
import { setAuthTokenGetter } from "@/lib/axios";
import { useEffect } from "react";

export default function AuthSetup() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return null; 
}
