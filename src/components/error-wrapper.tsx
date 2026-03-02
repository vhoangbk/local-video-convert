"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setError } from "@/store/slices/appSlice";
import { Error } from "./error";

export function ErrorWrapper() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.app.error);

  if (!error || !error.message) return null;

  const handleClose = () => {
    if (error.onClose) {
      error.onClose();
    }
    dispatch(setError(null));
  };

  return (
    <Error
      title={error.title}
      message={error.message}
      onClose={handleClose}
    />
  );
}
