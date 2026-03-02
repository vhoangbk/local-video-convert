import type { ConvertStatus, CompleteData, ConvertOption } from "@/common/types";

export interface ConversionState {
  status: ConvertStatus;
  percent: string;
  message: string;
  remainingTime: number;
  errorMessage: string;
  resultData: {
    url: string;
    name: string;
  } | null;
}

export interface ConversionCallbacks {
  onComplete?: (data: CompleteData) => void;
  onError?: (error: string) => void;
}

export interface UseVideoConversionReturn extends ConversionState {
  startConversion: (option: ConvertOption, customOptions?: ConvertOption) => void;
  cancelConversion: () => void;
  resetError: () => void;
  setResultData: (data: { url: string; name: string } | null) => void;
}
