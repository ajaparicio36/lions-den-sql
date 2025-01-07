import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import Image from "next/image";
import { createScrimLog } from "./scrimActions";

// Note: This is a mock representation - in a real app you'd handle actual file uploads
interface ScrimLogFormProps {
  onSubmit: () => void;
  isLoading?: boolean;
  teamId: string;
}

export const createScrimFormSchema = z.object({
  name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  scrimDate: z.date({
    required_error: "A date is required.",
  }),
  photos: z.array(z.any()).optional(),
});

type FormData = z.infer<typeof createScrimFormSchema>;

export function ScrimLogForm({
  onSubmit,
  isLoading,
  teamId,
}: ScrimLogFormProps) {
  const [selectedImages, setSelectedImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(createScrimFormSchema),
    defaultValues: {
      name: "",
      description: "",
      photos: [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImages((prev) => [
            ...prev,
            {
              file,
              preview: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: FormData) => {
    try {
      // Create a FormData object to handle file uploads
      const scrimData = {
        name: data.name,
        description: data.description,
        scrimDate: data.scrimDate,
        photos: selectedImages.map((img) => img.file),
      };

      const response = await createScrimLog(teamId, scrimData);

      if (!response) {
        throw new Error("Failed to create scrim log");
      }

      onSubmit();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter scrim log title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter scrim log description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scrimDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Photos</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="cursor-pointer"
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      width={200}
                      height={128}
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Upload one or multiple images for your scrim log
          </FormDescription>
          <FormMessage />
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Scrim Log"}
        </Button>
      </form>
    </Form>
  );
}

export default ScrimLogForm;
