import { useCallback, useEffect } from "react";
import type { FileInfo } from "@/common/types";
import { useAppDispatch } from "@/store/hooks";
import { setError, setFileInfo, setLoading, setLoadingMessage } from "@/store/slices/appSlice";
import { setOption } from "@/store/slices/optionSlice";
import { useGetFileInfo } from "./useGetFileInfo";

interface UseFileUploadOptions {
  onSuccess?: () => void;
}

interface UseFileUploadReturn {
  handleFileUpload: (files: FileList | null) => Promise<void>;
  isLoading: boolean;
}

/**
 * Custom hook to handle file upload workflow
 * - Creates blob URL from file
 * - Gets file info
 * - Initializes default options
 * - Dispatches to Redux store
 * - Navigates to convert page
 */
export const useFileUpload = (
  options: UseFileUploadOptions = {}
): UseFileUploadReturn => {
  const { onSuccess } = options;
  const dispatch = useAppDispatch();
  const { getFileInfo, isLoading, error } = useGetFileInfo();

  const initDefaultOption = useCallback(
    (info: FileInfo) => {
      let format = "h264";
      if (window.browser_settings) {
        const result: string[] = [];
        for (const value of Object.values(window.browser_settings)) {
          result.push(value.codecName);
        }
      format =
        result.find((format) => format === info.videoCodec) ?? result[0];
    }

      dispatch(
        setOption({
          format_name: format,
          fps: info.fps,
          resolution: { width: info.width, height: info.height },
          name: info.name,
          input_url: info.input_url,
          audioBitrate: `${info.audioBitRate}k`,
          hflip: 0,
          vflip: 0,
          volume_level: 1,
          crop: undefined,
          target_size: undefined,
          trim: undefined,
          quality: undefined,
          rotate: 0,
          speed: 1,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(setError({
      title: "",
      message: error ?? ""
    }));
  }, [error]);

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) {return;}

      const blobUrl = URL.createObjectURL(file);
      dispatch(setLoading(true));
      dispatch(setLoadingMessage("Processing your video..."));

      const info = await getFileInfo(blobUrl);
      dispatch(setLoading(false));
      dispatch(setLoadingMessage(""));
      if (info) {
        info.name = file.name;
        initDefaultOption(info);
        dispatch(setFileInfo(info));  
        onSuccess?.();
      }
    },
    [dispatch, getFileInfo, initDefaultOption, onSuccess]
  );

  return {
    handleFileUpload,
    isLoading
  };
};
