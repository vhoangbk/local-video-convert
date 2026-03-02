import { useState, useCallback } from "react";
import {
  ConvertStatus,
  type CompleteData,
  type ConvertOption,
  type ErrorData,
  type ProgressData,
} from "@/common/types";
import {
  run_cancel_convert,
  run_Convert_File_With_Options_New,
  run_on_event,
} from "@/script/run-command";
import type {
  ConversionCallbacks,
  UseVideoConversionReturn,
} from "./types";

/**
 * Custom hook to manage video conversion process
 * Handles conversion state, progress tracking, error handling, and cancellation
 */
export const useVideoConversion = (
  callbacks?: ConversionCallbacks
): UseVideoConversionReturn => {
  const [status, setStatus] = useState<ConvertStatus>(ConvertStatus.upload);
  const [percent, setPercent] = useState("");
  const [message, setMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultData, setResultData] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const resetError = useCallback(() => {
    setErrorMessage("");
    setStatus(ConvertStatus.configure);
  }, []);

  const cancelConversion = useCallback(() => {
    run_cancel_convert();
    setStatus(ConvertStatus.configure);
  }, []);

  const startConversion = useCallback(
    (option: ConvertOption, customOptions?: ConvertOption) => {
      setPercent("0");
      setStatus(ConvertStatus.converting);

      run_on_event((event, data) => {
        
        switch (event) {
          case "cmd-bee-update-progress": {
            const progressData = data as ProgressData;
            setPercent(progressData.percent);
            setMessage(progressData.title);
            setRemainingTime(progressData.remainingTime);
            break;
          }
          case "cmd-bee-complete": {
            const completeData = data as CompleteData;
            if (
              completeData.fileInfo !== null &&
              completeData.fileInfo !== undefined
            ) {
              setStatus(ConvertStatus.completed);
              setResultData({
                url: completeData.fileInfo.input_url,
                name: completeData.outputName,
              });
              callbacks?.onComplete?.(completeData);
            } else {
              setErrorMessage("We couldn't process your file. Please check if the file is corrupted or try a different format");
              setStatus(ConvertStatus.failed);
            }
            break;
          }
          case "cmd-bee-error": {
            const errorData = data as ErrorData;
            setStatus(ConvertStatus.failed);
            run_cancel_convert();
            setErrorMessage(errorData.message);
            callbacks?.onError?.(errorData.message);
            break;
          }
          case "cmd-bee-cancel-convert": {
            setStatus(ConvertStatus.configure);
            break;
          }
          default:
            break;
        }
      });

      try {
        void run_Convert_File_With_Options_New(option, customOptions);
      } catch (error) {
        console.error("error convert: ", error);
        setStatus(ConvertStatus.failed);
        run_cancel_convert();
        const errorMsg =
          "We couldn't process your file. Please check if the file is corrupted or try a different format";
        setErrorMessage(errorMsg);
        callbacks?.onError?.(errorMsg);
      }
    },
    [callbacks]
  );

  return {
    status,
    percent,
    message,
    remainingTime,
    errorMessage,
    resultData,
    startConversion,
    cancelConversion,
    resetError,
    setResultData,
  };
};
