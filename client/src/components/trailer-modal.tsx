import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TrailerModalProps {
  children: React.ReactNode;
}

export default function TrailerModal({ children }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert YouTube URL to embeddable format
  const trailerUrl = "https://www.youtube.com/embed/Tl0rWrFLGeI?autoplay=1&rel=0&modestbranding=1";

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-none w-full h-full p-4 md:p-8 bg-black/90 border-none">
        <VisuallyHidden>
          <DialogTitle>24 Days Without You - Official Trailer</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button with text */}
          <Button
            variant="ghost"
            className="absolute top-2 right-2 md:top-6 md:right-6 z-50 bg-teal-600 hover:bg-teal-700 text-white border-none px-3 py-2 md:px-6 md:py-3 text-sm md:text-lg font-semibold flex items-center space-x-2 md:space-x-3 shadow-lg"
            onClick={handleClose}
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden sm:inline">Return to Site</span>
            <span className="sm:hidden">Close</span>
          </Button>
          
          {/* 24 Days branding overlay */}
          <div className="absolute top-2 left-2 md:top-6 md:left-6 z-50 text-white">
            <div className="bg-black/50 px-2 py-1 md:px-4 md:py-2 rounded-lg">
              <h2 className="text-sm md:text-xl font-display font-bold">24 Days Without You</h2>
              <p className="text-xs md:text-sm opacity-90">Official Trailer</p>
            </div>
          </div>
          
          {/* Video container - responsive with proper aspect ratio */}
          <div className="w-full h-full max-w-7xl max-h-[calc(100vh-2rem)] md:max-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-full" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={trailerUrl}
                title="24 Days Without You - Official Trailer"
                className="w-full h-full rounded-lg"
                style={{ minHeight: '200px', maxHeight: 'calc(100vh - 6rem)' }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}