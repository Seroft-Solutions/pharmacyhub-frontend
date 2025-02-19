import React from 'react';
import {Carousel, CarouselContent, CarouselItem,} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

const CarouselImage = ({images}: ImageCarouselProps) => {
  const plugin = React.useRef(
    Autoplay({delay: 2000, stopOnInteraction: true})
  );

  return (
    <Carousel
      className="w-full"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full">
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px] object-cover ${image.className ||
                ""}`}
                style={{
                  maxHeight: 'calc(100vh - 200px)',
                  objectPosition: 'center'
                }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

    </Carousel>
  );
};

export default CarouselImage;