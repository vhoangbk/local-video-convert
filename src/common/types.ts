export interface ConvertOption {
  input_url: string;
  format_name: string;
  container?: string;
  name: string;
  hflip: number;
  vflip: number;
  volume_level: number;
  fps: number;
  resolution?: {
    width: number;
    height: number;
  };
  audioBitrate: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
    mode: "original" | "crop";
    aspectRatio: AspectRatio;
  };
  target_size?: number;
  trim?: {
    startTime: number;
    endTime: number;
  };
  quality?: string;
  rotate: number;
  speed: number;
}

export interface FileInfo {
  filename: string;
  size: number;
  displaySize: string;
  duration: number;
  bitrateTotal: number;
  width: number;
  height: number;
  fps: number;
  videoBitRate: number;
  audioBitRate: number;
  videoCodec: string;
  audioCodec: string;
  streams: Streams[];
  thumbnail: string;
  fmt: string;
  input_url: string;
  name: string;
}

export interface Streams {
  index: string;
  type: string;
  codec_name: string;
  video_stream_index: number;
  width: number;
  height: number;
  displaymatrix: number;
  bitrate: number;
  fps: number;
}

export const enum ConvertStatus {
  upload,
  configure,
  converting,
  completed,
  failed,
}

export type AspectRatio = "free" | "16:9" | "4:3" | "1:1" | "9:16" | "3:4";

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProgressData {
  type_cmd: string;
  percent: string;
  title: string;
  remainingTime: number;
}

export interface CompleteData {
  type_cmd: string;
  fileInfo: FileInfo;
  outputName: string;
}

export interface ErrorData {
  type_cmd: string;
  message: string;
}

// Union type for all callback data types
export type CallbackData = ProgressData | CompleteData | ErrorData;
