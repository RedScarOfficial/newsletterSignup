import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FullWidthImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: number;
  overlay?: boolean;
  overlayColor?: string;
  className?: string;
  containerClassName?: string;
}

export function FullWidthImage({
  src,
  alt,
  aspectRatio = 16 / 9,
  overlay = false,
  overlayColor = "rgba(0, 0, 0, 0.4)",
  className,
  containerClassName,
  ...props
}: FullWidthImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        containerClassName
      )}
      {...props}
    >
      <AspectRatio ratio={aspectRatio} className="w-full">
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover",
            className
          )}
          loading="lazy"
        />
        {overlay && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
          />
        )}
      </AspectRatio>
    </div>
  );
}
