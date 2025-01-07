import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrimLog } from "@prisma/client";
import ScrimImage from "./ScrimImage";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const ScrimPageCard = ({ scrim }: { scrim: ScrimLog }) => {
  return (
    <Card className="h-[90vh]">
      <CardHeader>
        <div className="flex flex-row justify-between w-full">
          <div>
            <CardTitle>{scrim.name}</CardTitle>
            <CardDescription>{scrim.scrimDate.toISOString()}</CardDescription>
          </div>
          <div>
            <Link href={"/hub/scrims"}>
              {" "}
              <Button variant="destructive" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Carousel className="max-w-[90vh]">
            <CarouselContent>
              {scrim.photos.map((photo, index) => (
                <CarouselItem key={index}>
                  <ScrimImage
                    imageUrl={photo.toString()}
                    altText={`${scrim.name} Image ${index}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-8" />
            <CarouselNext className="mr-8" />
          </Carousel>
        </div>
        <div>
          <p>{scrim.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <p>Last updated: {scrim.lastUpdated.toISOString()}</p>
      </CardFooter>
    </Card>
  );
};

export default ScrimPageCard;
