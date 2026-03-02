import { useState, useCallback } from "react";
import type { FileInfo } from "@/common/types";
import { run_get_info } from "@/script/run-command";

interface UseGetFileInfoReturn {
  getFileInfo: (blobUrl: string) => Promise<FileInfo | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to get file info from blob URL
 * Handles loading state and error handling
 */
export const useGetFileInfo = (): UseGetFileInfoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFileInfo = useCallback(async (blobUrl: string): Promise<FileInfo | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const info = await run_get_info(blobUrl);
      setIsLoading(false);
      return info;
    } catch {
      const errorMessage =
        "We couldn't process your file. Please check if the file is corrupted";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    getFileInfo,
    isLoading,
    error,
  };
};
