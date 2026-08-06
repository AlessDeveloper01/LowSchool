"use client";

import { useState, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import { LuImageOff, LuMaximize2, LuX } from "react-icons/lu";

import {
  mediaDesignStyles,
  overlayDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type ImageFit = "cover" | "contain";
export type ImageVariant = "rounded" | "circle" | "thumbnail" | "blurred" | "framed" | "grayscale";

export interface ResponsiveImageProps extends Omit<ImageProps, "fill" | "alt"> {
  alt: string;
  aspectRatio?: string;
  fit?: ImageFit;
  variant?: ImageVariant;
  fallback?: ReactNode;
  containerClassName?: string;
  design?: DesignPreset;
}

export function ResponsiveImage({ alt, aspectRatio = "16 / 9", fit = "cover", variant = "rounded", fallback, containerClassName, design, className, onError, ...props }: ResponsiveImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={cn(
        "relative block overflow-hidden bg-surface-hover",
        variant === "circle" ? "rounded-full" : "rounded-xl",
        variant === "thumbnail" && "rounded-lg border border-border p-1",
        variant === "framed" && "border-4 border-surface ring-1 ring-border",
        design && mediaDesignStyles[design],
        containerClassName,
      )}
      style={{ aspectRatio }}
    >
      {failed ? (
        <span className="grid size-full place-items-center text-muted">{fallback ?? <LuImageOff />}</span>
      ) : (
        <Image
          {...props}
          alt={alt}
          fill
          className={cn(
            fit === "cover" ? "object-cover" : "object-contain",
            variant === "blurred" && "scale-105 blur-sm",
            variant === "grayscale" && "grayscale transition duration-200 hover:grayscale-0",
            className,
          )}
          onError={(event) => {
            setFailed(true);
            onError?.(event);
          }}
        />
      )}
    </span>
  );
}

export function Thumbnail(props: ResponsiveImageProps) {
  return <ResponsiveImage aspectRatio="1 / 1" variant="thumbnail" {...props} />;
}

export interface ImagePreviewProps extends ResponsiveImageProps {
  zoomable?: boolean;
}

export function ImagePreview({ zoomable = true, ...props }: ImagePreviewProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => zoomable && setOpen(true)} className="group relative block w-full text-left" aria-label={`Ampliar ${props.alt}`}>
        <ResponsiveImage {...props} />
        {zoomable && <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-lg bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100"><LuMaximize2 /></span>}
      </button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[80] grid max-h-dvh place-items-center overflow-y-auto bg-black/80 p-3 sm:p-6" onClick={() => setOpen(false)}>
          <button type="button" className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white sm:top-5 sm:right-5 sm:size-10" onClick={() => setOpen(false)} aria-label="Cerrar"><LuX /></button>
          <div className={cn("relative h-[min(80dvh,calc(100dvh-1.5rem))] w-full max-w-5xl overflow-hidden", props.design && overlayDesignStyles[props.design])} onClick={(event) => event.stopPropagation()}>
            <Image src={props.src} alt={props.alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}

export interface ImageGalleryProps {
  images: Array<{ src: ImageProps["src"]; alt: string }>;
  design?: DesignPreset;
  className?: string;
}

export function ImageGallery({ images, design, className }: ImageGalleryProps) {
  return <div className={cn("grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 [&>*]:min-w-0", design && mediaDesignStyles[design], className)}>{images.map((image) => <ImagePreview key={String(image.src)} {...image} design={design} />)}</div>;
}

export interface ImageOverlayProps extends ResponsiveImageProps {
  children: ReactNode;
  position?: "top" | "center" | "bottom";
}

export function ImageOverlay({ children, position = "bottom", design, containerClassName, ...props }: ImageOverlayProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", design && mediaDesignStyles[design], containerClassName)}>
      <ResponsiveImage variant="rounded" design={design} containerClassName={containerClassName} {...props} />
      <div className={cn("absolute inset-0 flex min-w-0 break-words bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 text-white sm:p-4", position === "top" && "items-start", position === "center" && "items-center justify-center text-center", position === "bottom" && "items-end")}>{children}</div>
    </div>
  );
}
