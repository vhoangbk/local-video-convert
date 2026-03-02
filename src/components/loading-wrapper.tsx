"use client";

import { useAppSelector } from "@/store/hooks";
import { Loading } from "./loading";

export function LoadingWrapper() {
  const { loading } = useAppSelector((state) => state.app);

  if (!loading) return null;

  return <Loading />;
}
