"use client";
import React, { Fragment, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

const ScrimImage = ({
  imageUrl,
  altText = "Image",
}: {
  imageUrl: string;
  altText?: string;
}) => {
  const [scale, setScale] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  return (
    <Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="hidden" />

        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <div className="p-2 flex justify-between items-center border-b sticky top-0 bg-white z-50">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="text-xs"
              >
                Reset ({Math.round(scale * 100)}%)
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto relative">
            <Image
              src={imageUrl}
              alt={altText}
              width={1920}
              height={1080}
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.2s ease-in-out",
              }}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
      <Image
        onClick={() => setIsOpen(true)}
        src={imageUrl}
        alt={altText}
        width={600}
        height={600}
      />
    </Fragment>
  );
};

export default ScrimImage;
