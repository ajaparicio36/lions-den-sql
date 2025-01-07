"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface ScrimCardProps {
  scrim: {
    id: string;
    name: string;
    description: string | null;
    photos: string[];
    scrimDate: Date;
    lastUpdated: Date;
    teamId: string;
    teamMemberId: string;
    teamMember: {
      user: {
        ign: string;
      };
    };
  };
}

const ScrimCard: React.FC<ScrimCardProps> = ({ scrim }) => {
  const router = useRouter();
  return (
    <Card
      className="flex flex-row w-full"
      onClick={() => router.push(`/hub/scrims/${scrim.id}`)}
    >
      <CardHeader className="flex flex-row gap-4">
        <Image
          className="border border-primary w-48 h-48 object-cover object-center"
          alt={scrim.name}
          width={250}
          height={250}
          src={
            scrim.photos.length > 0
              ? scrim.photos[0]
              : "https://via.placeholder.com/250"
          }
        />
        <div className="flex flex-col gap-4 items-start">
          <div className="flex flex-col">
            <CardTitle>{scrim.name}</CardTitle>
            <CardDescription>
              {format(scrim.scrimDate, "dd MMMM yyyy")}
            </CardDescription>
          </div>
          <CardContent className="flex items-start">
            <p>{scrim.description}</p>
          </CardContent>
          <CardFooter className="flex items-start">
            <p>Created by: {scrim.teamMember.user.ign}</p>
          </CardFooter>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ScrimCard;
