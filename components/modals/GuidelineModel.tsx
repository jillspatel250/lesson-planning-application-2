"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Links {
  name: string;
  url: string;
}

const dummyLinks: Links[] = [
  { name: "PSO/PEO Guideline", url: "https://example.com/guidelines" },
  { name: "Lesson-Plan Guideline", url: "https://example.com/policies" },
  { name: "Annexure-I Guideline", url: "https://example.com/resources" },
  { name: "Annexure-II Guideline", url: "https://example.com/resources" },
  { name: "Annexure-III Guideline", url: "https://example.com/resources" },
];

function GuidelineModel({ isOpen, onClose }: GuidelineModalProps) {
  const [link, setLink] = useState<Links[]>([]);

  useEffect(() => {
    setLink(dummyLinks);
  }, []);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[23px] leading-[25px]">
              Guidelines
            </DialogTitle>
            <DialogDescription className="pt-3">
              <div className="text-[17px] leading-[24px] mb-4">
                <ul className="list-disc pl-5">
                  {link.map((item, index) => (
                    <li key={index} className="mb-3 text-black">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GuidelineModel;
