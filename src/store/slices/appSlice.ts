import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FileInfo } from "../../common/types";

interface AppState {
  loading: boolean;
  loadingMessage: string;
  fileInfo: FileInfo | null;
  error: {
    title: string;
    message: string;
    onClose?: () => void;
  } | null;
  fileInfoConverted: FileInfo | null;
} 

const initialState: AppState = {
  loading: false,
  loadingMessage: "",
  fileInfo: null,
  error: null,
  fileInfoConverted: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setLoadingMessage: (state, action: PayloadAction<string>) => {
      state.loadingMessage = action.payload;
    },

    setFileInfo: (state, action: PayloadAction<FileInfo | null>) => {
      state.fileInfo = action.payload;
    },

    setError: (state, action: PayloadAction<{ title: string; message: string; onClose?: () => void } | null>) => {
      state.error = action.payload;
    },

      setFileInfoConverted: (state, action: PayloadAction<FileInfo | null>) => {
      state.fileInfoConverted = action.payload;
    },

    resetApp: () => initialState,
  },
});

export const { setLoading, setLoadingMessage, resetApp, setFileInfo, setError, setFileInfoConverted } = appSlice.actions;

export default appSlice.reducer;
