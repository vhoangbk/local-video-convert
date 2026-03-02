"use client";

import { useState } from "react";
import { FileVideo, Maximize2, HardDrive, Film, Play } from "lucide-react";
import type { FileInfo } from "@/common/types";
import Image from "next/image";
import { VideoPreviewModal } from "./video-preview-modal";

type Props = {
  info: FileInfo;
};

export function VideoInfo({ info }: Props) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        {/* Thumbnail */}
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden border border-border shadow-sm group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
          aria-label={`Play preview of ${info.name}`}
        >
          {info.thumbnail ? (
            <Image
              src={info.thumbnail}
              alt={`Thumbnail for ${info.name}`}
              width={500}
              height={500}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileVideo className="w-16 h-16 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
              <Play className="w-8 h-8 text-black ml-1" fill="currentColor" aria-hidden="true" />
            </div>
          </div>
        </button>

        {/* File Name */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground truncate" title={info.name}>
            {info.name}
          </h3>
        </div>

        {/* Video Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Resolution */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Resolution
              </p>
              <p className="text-xs font-semibold text-foreground truncate">
                {info.width} × {info.height}
              </p>
            </div>
          </div>

          {/* File Size */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                File Size
              </p>
              <p className="text-xs font-semibold text-foreground truncate">
                {info.displaySize}
              </p>
            </div>
          </div>

          {/* Video Codec */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Film className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Video Codec
              </p>
              <p className="text-xs font-semibold text-foreground uppercase truncate">
                {info.videoCodec || "N/A"}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <FileVideo className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Duration
              </p>
              <p className="text-xs font-semibold text-foreground truncate">
                {formatDuration(info.duration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        videoUrl={info.input_url}
        videoName={info.name}
      />
    </>
  );
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "0:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
