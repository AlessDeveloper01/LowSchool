"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import {
  mediaDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface CarouselProps {
  items: ReactNode[];
  loop?: boolean;
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  showIndicators?: boolean;
  design?: DesignPreset;
  className?: string;
}

export function Carousel({ items, loop = true, autoplay = false, interval = 4500, pauseOnHover = true, showIndicators = true, design, className }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  function goTo(index: number): void {
    if (loop) setActiveIndex((index + items.length) % items.length);
    else setActiveIndex(Math.min(items.length - 1, Math.max(0, index)));
  }

  useEffect(() => {
    if (!autoplay || paused || items.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex((current) => loop ? (current + 1) % items.length : Math.min(items.length - 1, current + 1)), interval);
    return () => window.clearInterval(timer);
  }, [autoplay, interval, items.length, loop, paused]);

  if (items.length === 0) return null;

  return (
    <div className={cn("relative max-w-full overflow-hidden rounded-2xl", design && mediaDesignStyles[design], className)} onMouseEnter={() => pauseOnHover && setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex min-w-0 transition-transform duration-300" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>{items.map((item, index) => <div key={index} className="min-w-0 w-full shrink-0">{item}</div>)}</div>
      {items.length > 1 && <><button type="button" onClick={() => goTo(activeIndex - 1)} disabled={!loop && activeIndex === 0} className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-surface/85 text-foreground backdrop-blur disabled:opacity-30 sm:left-3 sm:size-9" aria-label="Anterior"><LuChevronLeft /></button><button type="button" onClick={() => goTo(activeIndex + 1)} disabled={!loop && activeIndex === items.length - 1} className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-surface/85 text-foreground backdrop-blur disabled:opacity-30 sm:right-3 sm:size-9" aria-label="Siguiente"><LuChevronRight /></button></>}
      {showIndicators && items.length > 1 && <div className="absolute bottom-3 left-1/2 flex max-w-[calc(100%-1rem)] -translate-x-1/2 gap-1.5">{items.map((_, index) => <button key={index} type="button" onClick={() => goTo(index)} className={cn("relative h-1.5 shrink-0 rounded-full transition-[width,background-color] before:absolute before:-inset-2", index === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-white/60")} aria-label={`Ir a diapositiva ${index + 1}`} aria-current={index === activeIndex} />)}</div>}
    </div>
  );
}
