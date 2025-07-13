import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

interface ConsultationModalProps {
  children: React.ReactNode;
  defaultRole?: string;
}

export default function ConsultationModal({ children, defaultRole = "conference" }: ConsultationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Simple redirect to consultation form for now
  const handleConsultation = () => {
    // For now, redirect to conference page with consultation intent
    window.location.href = '/conference?consultation=true';
  };

  return (
    <div onClick={handleConsultation} className="cursor-pointer">
      {children}
    </div>
  );
}