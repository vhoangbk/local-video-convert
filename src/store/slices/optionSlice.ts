import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AspectRatio, ConvertOption } from "../../common/types";

const initialState: ConvertOption = {
  input_url: "",
  format_name: "",
  container: "mp4",
  name: "",
  hflip: 0,
  vflip: 0,
  volume_level: 1,
  fps: 25,
  resolution: {
    width: 0,
    height: 0,
  },
  audioBitrate: "",
  crop: undefined,
  target_size: undefined,
  trim: undefined,
  quality: undefined,
  rotate: 0,
  speed: 1,
};

const optionSlice = createSlice({
  name: "option",
  initialState,
  reducers: {

    setTrim: (state, action: PayloadAction<{ startTime: number; endTime: number } | undefined>) => {
      state.trim = action.payload;
    },

    setCrop: (state, action: PayloadAction<{ x: number; y: number; width: number; height: number; mode: "original" | "crop"; aspectRatio: AspectRatio } | undefined>) => {
      state.crop = action.payload;
    },

    setFormatName: (state, action: PayloadAction<string>) => {
      state.format_name = action.payload;
    },

    setContainer: (state, action: PayloadAction<string>) => {
      state.container = action.payload;
    },

    setInputUrl: (state, action: PayloadAction<string>) => {
      state.input_url = action.payload;
    },

    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    setHflip: (state, action: PayloadAction<number>) => {
      state.hflip = action.payload;
    },
    setVflip: (state, action: PayloadAction<number>) => {
      state.vflip = action.payload;
    },

    setVolumeLevel: (state, action: PayloadAction<number>) => {
      state.volume_level = action.payload;
    },
    setQuality: (state, action: PayloadAction<string | undefined>) => {
      state.quality = action.payload;
    },

    setOption: (state, action: PayloadAction<ConvertOption>) => {
      return { ...state, ...action.payload};
    },

    setResolution: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      state.resolution = action.payload;
    },

    setAudioBitrate: (state, action: PayloadAction<string>) => {
      state.audioBitrate = action.payload;
    },
    setFps: (state, action: PayloadAction<number>) => {
      state.fps = action.payload;
    },

    setTargetSize: (state, action: PayloadAction<number>) => {
      state.target_size = action.payload;
    },
    resetAll: () => initialState,
  },
});

export const {
  setFps,
  setTargetSize,
  resetAll,
  setAudioBitrate,
  setVolumeLevel,
  setFormatName,
  setContainer,
  setInputUrl,
  setName,
  setHflip,
  setVflip,
  setQuality,
  setResolution,
  setOption,
  setTrim,
  setCrop,
} = optionSlice.actions;

export default optionSlice.reducer;
