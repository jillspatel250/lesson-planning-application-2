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
  {
    name: "SOP of Lesson Planning Document(LPD)",
    url: "https://drive.google.com/file/d/1svag1XlHe8okdnbM6xPPPfDRFqLrsK6c/view?usp=drive_link",
  },
  {
    name: "LPD_Annexure I_Guidelines for learning materials",
    url: "https://drive.google.com/file/d/1-PYM0JUeljwhxf-xYq6jNh4bkeym6CUS/view?usp=drive_link",
  },
  {
    name: "LPD_Annexure II_List of teaching pedagogy",
    url: "https://drive.google.com/file/d/1Q0YIEHyrIKf-UnAIygTHYXNyJU1gThL7/view?usp=drive_link",
  },
  {
    name: "LPD_Annexure III_List of practical evaluation method and pedagogy",
    url: "https://drive.google.com/file/d/1OUHWPL_HOp1vb2RkXhs6E3sVPuO9gy46/view?usp=drive_link",
  },
  {
    name: "LPD_Annexure IV_List of evaluation pedagogy",
    url: "https://drive.google.com/file/d/1hLpCHtIWDEZfyXGmBSXzL3ICBotq6WXM/view?usp=drive_link",
  },
  {
    name: "LPD_Annexure V_Additional guidelinesinstructions",
    url: "https://drive.google.com/file/d/1iy7yU4drcS5huA_wGRWCvY8V3jSqoZ5d/view?usp=drive_link",
  },
  {
    name: "LPD_Annexure VI_Event Planning details",
    url: "https://drive.google.com/file/d/1F5v_RDfrqUa2yrAUTsLWOSBVybgEvU1S/view?usp=drive_link",
  },
  {
    name: "LPD_Annexure VII_Tasks for fast learner, medium learner and slow learner",
    url: "https://drive.google.com/file/d/1VtEZ5ngwX8439DrciwHj-TM_YX4t03ri/view?usp=drive_link",
  },
];

function GuidelineModel({ isOpen, onClose }: GuidelineModalProps) {
  const [link, setLink] = useState<Links[]>([]);

  useEffect(() => {
    setLink(dummyLinks);
  }, []);

  return (
    <div>
     <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent
    className="!w-[43vw] !max-w-none px-8 py-6 overflow-y-auto"
  >
    <DialogHeader>
      <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[23px] leading-[25px]">
        Guidelines
      </DialogTitle>
      <DialogDescription className="pt-3">
        <div className="text-[17px] leading-[24px] overflow-x-auto">
          <ul className="list-disc pl-5 min-w-full">
            {link.map((item, index) => (
              <li
                key={index}
                className="mb-3 text-black whitespace-nowrap"
              >
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
