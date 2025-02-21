import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export const AdaptiveImage = ({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  aspectRatio = 'square',
  fill = false,
  width,
  height,
}: AdaptiveImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const aspectRatioClass = {
    'square': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
  }[aspectRatio] || aspectRatio;

  if (fill) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-lg",
        aspectRatioClass,
        className
      )}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover duration-700 ease-in-out",
            isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "overflow-hidden rounded-lg",
      aspectRatioClass,
      className
    )}>
      <Image
        src={src}
        alt={alt}
        width={width || 1920}
        height={height || 1080}
        className={cn(
          "w-full h-full object-cover duration-700 ease-in-out",
          isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
};