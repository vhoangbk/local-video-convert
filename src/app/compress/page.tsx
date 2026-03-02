"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Shrink, Zap } from "lucide-react";
import { CompressFeatures } from "@/components/compress/compress-features";
import { TargetSizeInput } from "@/components/compress/target-size-input";
import { useFileUpload, useSelectFile } from "@/hooks/video-conversion";
import VideoUploader from "@/components/video-uploader";
import { VideoInfo } from "@/components/video-info";
import { useAppSelector } from "@/store/hooks";

export default function CompressVideoPage() {
  const info = useAppSelector((state) => state.app.fileInfo);

  const { handleFileUpload } = useFileUpload();
  const { openFileSelector } = useSelectFile({
    onFilesSelected: handleFileUpload,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header user={null} />

      <main className="flex-1 py-16">
        <div className={`${info ? "max-w-7xl" : "max-w-3xl"} mx-auto px-6`}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 mb-5">
              <Shrink className="w-9 h-9 text-primary-600" aria-hidden="true" />
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Compress Video
            </h1>
            <p className="text-slate-600 max-w-md mx-auto">
              Reduce file size while preserving quality. Fast, secure, and
              optimized for any platform.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Upload Area */}
            {!info ? (
              <div className="p-8">
                <VideoUploader
                  onPressSelectFile={openFileSelector}
                  onDropFiles={handleFileUpload}
                />
              </div>
            ) : (
              <div className="p-8">
                {/* Desktop: 2 columns | Mobile: 1 column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    {/* Left Column - Video Info */}
                    <VideoInfo info={info} />
                  </div>
                  {/* Right Column - Target Size Input */}
                  <div className="space-y-6">
                    <TargetSizeInput
                      value={12}
                      onChange={() => {}}
                      disabled={false}
                      currentSize={12}
                    />

                    <Button
                      onClick={() => {}}
                      disabled={false}
                      className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <>
                        <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                        Compress Video
                      </>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <CompressFeatures />
        </div>
      </main>
    </div>
  );
}
