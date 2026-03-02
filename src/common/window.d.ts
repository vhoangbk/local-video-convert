type BrowserSettings = Record<string, {
    codecName: string;
    width: number;
    height: number;
    framerate: number;
    hardwareAcceleration: "prefer-hardware" | "prefer-software" | "no-preference";
    bitrateMode: "constant" | "variable";
    latencyMode: "quality" | "realtime";
    codec: string;
    bitrate: number;
    max_bpp: number;
    min_bpp: number;
    bpp: number;
    supported_resolution: {
      landscape: [number, number][];
      portrait: [number, number][];
    };
  }>;

export type CodecSetting = BrowserSettings[string];

export type ResolutionSetting = CodecSetting['supported_resolution'];

declare global {
  interface Window {
    browser_settings?: BrowserSettings;
    AndroidInterface: {
      shareVideo(fileId: string, displayName: string): void;
      rateApp(): void;
    };
    webkit?: {
      messageHandlers: {
        BeeBridge: {
          postMessage: (message: unknown) => void;
        };
      };
    };
  }
}

export {};

