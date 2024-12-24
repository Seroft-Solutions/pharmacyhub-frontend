import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Image {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

interface ImageCarouselProps {
  images: Image[];
}

export default function CarouselImage({ images }: ImageCarouselProps) {
  return (
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-96">
                  <img
                      src={image.src}
                      alt={image.alt}
                      className={`object-cover rounded-lg ${image.className || ""}`}
                      style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
  );
}
