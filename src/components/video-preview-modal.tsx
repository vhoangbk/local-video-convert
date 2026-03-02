"use client";

import { useEffect, useRef } from "react";
import { X, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoName: string;
};

export function VideoPreviewModal({ isOpen, onClose, videoUrl, videoName }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 bg-black border-0 overflow-hidden">
        <DialogHeader className="absolute top-0 left-0 right-0 z-10 flex flex-row items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <DialogTitle className="text-white text-base font-semibold truncate pr-4">
            {videoName}
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Close video preview"
          >
            <X className="w-5 h-5 text-white" aria-hidden="true" />
          </button>
        </DialogHeader>

        <div className="relative w-full aspect-video bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            controlsList="nodownload"
            className="w-full h-full"
            preload="metadata"
            playsInline
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Play button overlay (only shows when video is paused) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-black ml-1" aria-hidden="true" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
