import type { FileInfo } from "@/common/types";
import { useAppSelector } from "@/store/hooks";

/**
 * Custom hook to get file info from Redux store
 * @returns FileInfo | null
 */
export const useFileInfo = (): FileInfo | null => {
  return useAppSelector((state) => state.app.fileInfo);
};
