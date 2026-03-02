import { useState } from "react";
import { Upload as UploadIcon, FolderPlus, CheckCircle2 } from "lucide-react";

type Props = {
  onPressSelectFile: () => void;
  onDropFiles: (files: FileList | null) => void;
};

const Upload = (props: Props) => {
  const { onPressSelectFile, onDropFiles } = props;
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if leaving the container itself, not child elements
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPressSelectFile();
    }
  };

  return (
    <div id="upload-section" className="w-full mx-auto flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        onClick={onPressSelectFile}
        className={`flex flex-col items-center justify-center min-h-[400px] sm:min-h-[480px] py-12 px-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[0.99] border-solid shadow-inner"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/5"
        }`}
      >
        <div
          className={`mb-6 sm:mb-8 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl transition-all duration-500 shadow-lg pointer-events-none ${isDragging ? "bg-primary text-primary-foreground rotate-12 scale-110" : "bg-muted border border-border text-muted-foreground"}`}
        >
          <UploadIcon 
            className="w-8 h-8 sm:w-10 sm:h-10" 
            aria-hidden="true"
            strokeWidth={2.5}
          />
        </div>

        <div className="text-center pointer-events-none space-y-2 sm:space-y-3 px-4">
          <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
            Drag & drop your videos here
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Supported: MP4, MOV, MKV, AVI and 50+ more
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPressSelectFile();
          }}
          className="group/btn relative mt-8 sm:mt-10 flex h-12 md:h-14 min-w-[200px] sm:min-w-[240px] items-center justify-center rounded-xl sm:rounded-2xl bg-primary px-8 sm:px-10 text-sm sm:text-base font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <span className="relative flex items-center gap-2">
            <FolderPlus 
              className="w-5 h-5" 
              aria-hidden="true"
              strokeWidth={2.5}
            />
            Select Files
          </span>
        </button>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground pointer-events-none">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 
              className="w-4 h-4 text-primary" 
              aria-hidden="true"
              strokeWidth={2.5}
            />
            No File Limits
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 
              className="w-4 h-4 text-primary" 
              aria-hidden="true"
              strokeWidth={2.5}
            />
            Local Processing
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
