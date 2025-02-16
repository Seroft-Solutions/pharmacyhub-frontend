import Image from 'next/image';
import {cn} from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function OptimizedImage({
                                 src,
                                 alt,
                                 width,
                                 height,
                                 className
                               }: OptimizedImageProps) {
  return (
    <div className={cn('relative', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      />
    </div>
  );
}
