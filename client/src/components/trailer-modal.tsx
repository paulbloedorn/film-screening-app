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
      <DialogContent className="max-w-none w-full h-full p-0 bg-black/90 border-none">
        <VisuallyHidden>
          <DialogTitle>24 Days Without You - Official Trailer</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button with text */}
          <Button
            variant="ghost"
            className="absolute top-6 right-6 z-50 bg-teal-600 hover:bg-teal-700 text-white border-none px-6 py-3 text-lg font-semibold flex items-center space-x-3 shadow-lg"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
            <span>Return to Site</span>
          </Button>
          
          {/* 24 Days branding overlay */}
          <div className="absolute top-6 left-6 z-50 text-white">
            <div className="bg-black/50 px-4 py-2 rounded-lg">
              <h2 className="text-xl font-display font-bold">24 Days Without You</h2>
              <p className="text-sm opacity-90">Official Trailer</p>
            </div>
          </div>
          
          {/* Video container */}
          <div className="w-full h-full max-w-7xl max-h-[80vh] aspect-video">
            <iframe
              src={trailerUrl}
              title="24 Days Without You - Official Trailer"
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}