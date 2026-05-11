"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ───

type ImageSource = "local" | "sanity" | "cloudinary" | "external";

interface SanityImageProps {
  source: "sanity";
  sanityRef: string;
  sanityProjectId?: string;
  sanityDataset?: string;
}

interface CloudinaryImageProps {
  source: "cloudinary";
  cloudName: string;
  publicId: string;
  transformations?: string[];
}

interface LocalImageProps {
  source?: "local" | "external";
  src: string;
}

type ImageSourceProps =
  | SanityImageProps
  | CloudinaryImageProps
  | LocalImageProps;

interface ArtDirection {
  media: string;
  width: number;
  height: number;
}

interface OptimizedImageProps {
  /** Image source configuration */
  imageSource: ImageSourceProps;
  /** Alt text for accessibility */
  alt: string;
  /** Width of the image */
  width?: number;
  /** Height of the image */
  height?: number;
  /** Aspect ratio as "width/height" string, e.g. "16/9" */
  aspectRatio?: string;
  /** Placeholder type */
  placeholderType?: "blur" | "skeleton" | "dominant-color" | "none";
  /** Blur placeholder data URL (for local images) */
  blurDataURL?: string;
  /** Priority loading for above-fold images */
  priority?: boolean;
  /** Art direction for responsive images */
  artDirections?: ArtDirection[];
  /** Custom className for the image */
  className?: string;
  /** Custom className for the wrapper */
  wrapperClassName?: string;
  /** Custom className for the skeleton placeholder */
  skeletonClassName?: string;
  /** Object fit style */
  objectFit?: "contain" | "cover" | "fill" | "none";
  /** Border radius */
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  /** Enable hover zoom effect */
  hoverZoom?: boolean;
  /** Lazy loading threshold */
  lazyThreshold?: number;
  /** Fallback content when image fails */
  fallbackContent?: React.ReactNode;
  /** Callback when image loads */
  onLoadComplete?: (naturalWidth: number, naturalHeight: number) => void;
  /** Callback on error */
  onError?: (error: string) => void;
  /** Fill the container instead of using width/height */
  fill?: boolean;
  /** Custom sizes string for responsive images */
  sizes?: string;
  /** Image loading strategy */
  loading?: "lazy" | "eager";
  /** ID attribute */
  id?: string;
}

// ─── Constants ───

const ROUNDED_CLASSES = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

const OBJECT_FIT_CLASSES = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
} as const;

const DEFAULT_SIZES = [
  "(max-width: 640px) 100vw",
  "(max-width: 1024px) 50vw",
  "33vw",
].join(", ");

// ─── Utility Functions ───

function buildSanityUrl(
  sanityRef: string,
  projectId?: string,
  dataset?: string,
  width?: number,
  height?: number,
  format?: string
): string {
  const pid = projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
  const ds = dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  if (format) params.set("fm", format);
  params.set("q", "80");
  params.set("fit", "max");
  params.set("auto", "format");

  return `https://cdn.sanity.io/images/${pid}/${ds}/${sanityRef}?${params.toString()}`;
}

function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  transformations?: string[],
  width?: number,
  height?: number,
  format?: string
): string {
  const baseTransforms = ["f_auto", "q_auto:good"];
  if (width) baseTransforms.push(`w_${width}`);
  if (height) baseTransforms.push(`h_${height}`);
  if (format && format !== "auto") baseTransforms.push(`f_${format}`);

  const allTransforms = [...(transformations || []), ...baseTransforms].join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${allTransforms}/${publicId}`;
}

function generateLQIP(width: number = 20, height: number = 20): string {
  // Generates a minimal base64 SVG placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="%231a1a2e"/></svg>`;
  return `data:image/svg+xml;base64,${typeof btoa !== "undefined" ? btoa(svg) : Buffer.from(svg).toString("base64")}`;
}

function resolveImageSource(
  imageSource: ImageSourceProps,
  width?: number,
  height?: number,
  format?: string
): string {
  switch (imageSource.source) {
    case "sanity": {
      return buildSanityUrl(
        imageSource.sanityRef,
        imageSource.sanityProjectId,
        imageSource.sanityDataset,
        width,
        height,
        format
      );
    }
    case "cloudinary": {
      return buildCloudinaryUrl(
        imageSource.cloudName,
        imageSource.publicId,
        imageSource.transformations,
        width,
        height,
        format
      );
    }
    case "external":
    case "local":
    default: {
      return imageSource.src;
    }
  }
}

// ─── Component ───

export function OptimizedImage({
  imageSource,
  alt,
  aspectRatio,
  placeholderType = "skeleton",
  blurDataURL,
  priority = false,
  artDirections,
  wrapperClassName,
  skeletonClassName,
  objectFit = "cover",
  rounded = "none",
  hoverZoom = false,
  lazyThreshold,
  fallbackContent,
  onLoadComplete,
  onError,
  className,
  width,
  height,
  fill,
  sizes: sizesProp,
  loading: loadingProp,
  id,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  // Resolve the image source URL
  const resolvedSrc = useMemo(() => resolveImageSource(imageSource), [imageSource]);

  // Generate responsive sizes based on art directions
  const responsiveSizes = useMemo(() => {
    if (sizesProp) return sizesProp;
    if (artDirections && artDirections.length > 0) {
      return artDirections
        .map((ad) => `${ad.media} ${ad.width}px`)
        .concat("100vw")
        .join(", ");
    }
    return DEFAULT_SIZES;
  }, [artDirections, sizesProp]);

  // Compute aspect ratio style
  const aspectRatioStyle = useMemo(() => {
    if (!aspectRatio) return undefined;
    const [w, h] = aspectRatio.split("/").map(Number);
    if (!w || !h) return undefined;
    return { aspectRatio: `${w}/${h}` };
  }, [aspectRatio]);

  // Determine if we should use blur placeholder
  const shouldUseBlurPlaceholder =
    placeholderType === "blur" && (blurDataURL || imageSource.source === "local");

  const placeholderBlurDataURL = useMemo(() => {
    if (blurDataURL) return blurDataURL;
    if (placeholderType === "blur") {
      const w = typeof width === "number" ? Math.max(1, Math.round(width / 50)) : 20;
      const h = typeof height === "number" ? Math.max(1, Math.round(height / 50)) : 20;
      return generateLQIP(w, h);
    }
    return undefined;
  }, [blurDataURL, placeholderType, width, height]);

  // Handle image load
  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      if (onLoadComplete) {
        const img = event.currentTarget;
        onLoadComplete(img.naturalWidth, img.naturalHeight);
      }
    },
    [onLoadComplete]
  );

  // Handle image error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError(`Failed to load image: ${resolvedSrc}`);
    }
  }, [onError, resolvedSrc]);

  // Intersection observer for lazy loading
  const intersectionCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || priority || isInView) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          threshold: lazyThreshold ?? 0.1,
          rootMargin: "200px 0px",
        }
      );
      observer.observe(node);
    },
    [priority, isInView, lazyThreshold]
  );

  // Error state with fallback
  if (hasError) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-accent/10",
          ROUNDED_CLASSES[rounded],
          wrapperClassName
        )}
        style={aspectRatioStyle}
        role="img"
        aria-label={alt}
      >
        {fallbackContent || (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <svg
              className="w-8 h-8 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z"
              />
            </svg>
            <span className="text-xs opacity-50">Image unavailable</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={intersectionCallback}
      className={cn(
        "relative overflow-hidden",
        ROUNDED_CLASSES[rounded],
        wrapperClassName
      )}
      style={aspectRatioStyle}
    >
      {/* Skeleton / Placeholder while loading */}
      {isLoading && placeholderType !== "none" && (
        <Skeleton
          className={cn(
            "absolute inset-0 z-10",
            placeholderType === "dominant-color" && "bg-accent/20",
            skeletonClassName
          )}
          aria-hidden="true"
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <Image
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={responsiveSizes}
          priority={priority}
          loading={loadingProp || (priority ? "eager" : "lazy")}
          placeholder={shouldUseBlurPlaceholder ? "blur" : "empty"}
          blurDataURL={shouldUseBlurPlaceholder ? placeholderBlurDataURL : undefined}
          onLoad={handleLoad}
          onError={handleError}
          id={id}
          className={cn(
            "transition-all duration-700",
            OBJECT_FIT_CLASSES[objectFit],
            ROUNDED_CLASSES[rounded],
            isLoading && "scale-105 blur-sm opacity-0",
            !isLoading && "scale-100 blur-0 opacity-100",
            hoverZoom && "group-hover:scale-110 duration-1000",
            className
          )}
          style={{
            ...(aspectRatioStyle ? { width: "100%", height: "100%" } : {}),
          }}
        />
      )}
    </div>
  );
}

// ─── Convenience Presets ───

interface PresetImageProps extends Omit<OptimizedImageProps, "aspectRatio" | "rounded" | "objectFit"> {
  src: string;
}

export function HeroImage(props: PresetImageProps) {
  return (
    <OptimizedImage
      {...props}
      imageSource={{ source: "local", src: props.src }}
      aspectRatio="16/9"
      rounded="none"
      objectFit="cover"
      priority
      placeholderType="blur"
    />
  );
}

export function GalleryImage(props: PresetImageProps) {
  return (
    <OptimizedImage
      {...props}
      imageSource={{ source: "local", src: props.src }}
      aspectRatio="1/1"
      rounded="sm"
      objectFit="cover"
      hoverZoom
    />
  );
}

export function PortraitImage(props: PresetImageProps) {
  return (
    <OptimizedImage
      {...props}
      imageSource={{ source: "local", src: props.src }}
      aspectRatio="3/4"
      rounded="md"
      objectFit="cover"
    />
  );
}

export function AvatarImage(props: PresetImageProps) {
  return (
    <OptimizedImage
      {...props}
      imageSource={{ source: "local", src: props.src }}
      aspectRatio="1/1"
      rounded="full"
      objectFit="cover"
    />
  );
}

export function SanityImage({
  sanityRef,
  projectId,
  dataset,
  ...props
}: Omit<OptimizedImageProps, "imageSource"> & {
  sanityRef: string;
  projectId?: string;
  dataset?: string;
}) {
  return (
    <OptimizedImage
      {...props}
      imageSource={{
        source: "sanity",
        sanityRef,
        sanityProjectId: projectId,
        sanityDataset: dataset,
      }}
    />
  );
}

export function CloudinaryImage({
  cloudName,
  publicId,
  transformations,
  ...props
}: Omit<OptimizedImageProps, "imageSource"> & {
  cloudName: string;
  publicId: string;
  transformations?: string[];
}) {
  return (
    <OptimizedImage
      {...props}
      imageSource={{
        source: "cloudinary",
        cloudName,
        publicId,
        transformations,
      }}
    />
  );
}
