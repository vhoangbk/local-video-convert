import { useCallback } from "react";

interface UseSelectFileOptions {
  accept?: string;
  onFilesSelected: (files: FileList | null) => void;
}

interface UseSelectFileReturn {
  openFileSelector: () => void;
}

/**
 * Custom hook to handle file selection via input element
 * @param options - Configuration options
 * @returns Object with openFileSelector function
 */
export const useSelectFile = ({
  accept = "video/*,.mkv,.flv,.3gp",
  onFilesSelected,
}: UseSelectFileOptions): UseSelectFileReturn => {
  const openFileSelector = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      onFilesSelected(target.files);
    };

    input.click();
  }, [accept, onFilesSelected]);

  return {
    openFileSelector,
  };
};
