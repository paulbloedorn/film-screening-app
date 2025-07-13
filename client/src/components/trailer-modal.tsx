import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <DialogContent className="max-w-none w-full h-full p-0 bg-black border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white border-none"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>
          
          {/* Video container */}
          <div className="w-full h-full max-w-7xl max-h-[80vh] aspect-video">
            <iframe
              src={trailerUrl}
              title="24 Days Without You - Official Trailer"
              className="w-full h-full"
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