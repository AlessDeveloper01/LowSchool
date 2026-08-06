export type FloatingSide = "top" | "bottom" | "left" | "right";
export type FloatingAlignment = "start" | "center" | "end";

interface FloatingPositionOptions {
  anchor: DOMRect;
  floating: DOMRect;
  preferredSide: FloatingSide;
  alignment?: FloatingAlignment;
  gap?: number;
  margin?: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface FloatingCoordinates {
  top: number;
  left: number;
  side: FloatingSide;
  maxWidth: number;
  maxHeight: number;
}

const oppositeSides: Record<FloatingSide, FloatingSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function availableSpace(
  anchor: DOMRect,
  side: FloatingSide,
  viewportWidth: number,
  viewportHeight: number,
  gap: number,
  margin: number,
): number {
  if (side === "top") return anchor.top - gap - margin;
  if (side === "bottom") return viewportHeight - anchor.bottom - gap - margin;
  if (side === "left") return anchor.left - gap - margin;
  return viewportWidth - anchor.right - gap - margin;
}

function requiredSpace(floating: DOMRect, side: FloatingSide): number {
  return side === "top" || side === "bottom"
    ? floating.height
    : floating.width;
}

function resolveSide(options: FloatingPositionOptions): FloatingSide {
  const {
    anchor,
    floating,
    preferredSide,
    gap = 8,
    margin = 8,
    viewportHeight,
    viewportWidth,
  } = options;
  const oppositeSide = oppositeSides[preferredSide];
  const preferredSpace = availableSpace(
    anchor,
    preferredSide,
    viewportWidth,
    viewportHeight,
    gap,
    margin,
  );
  const oppositeSpace = availableSpace(
    anchor,
    oppositeSide,
    viewportWidth,
    viewportHeight,
    gap,
    margin,
  );

  if (
    preferredSpace < requiredSpace(floating, preferredSide) &&
    oppositeSpace > preferredSpace
  ) {
    return oppositeSide;
  }

  return preferredSide;
}

function crossAxisPosition(
  start: number,
  end: number,
  floatingSize: number,
  alignment: FloatingAlignment,
): number {
  if (alignment === "start") return start;
  if (alignment === "end") return end - floatingSize;
  return start + (end - start - floatingSize) / 2;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function calculateFloatingPosition(
  options: FloatingPositionOptions,
): FloatingCoordinates {
  const {
    anchor,
    floating,
    alignment = "center",
    gap = 8,
    margin = 8,
    viewportWidth,
    viewportHeight,
  } = options;
  const side = resolveSide(options);
  let top = anchor.bottom + gap;
  let left = crossAxisPosition(
    anchor.left,
    anchor.right,
    floating.width,
    alignment,
  );

  if (side === "top") {
    top = anchor.top - floating.height - gap;
  } else if (side === "left") {
    top = crossAxisPosition(
      anchor.top,
      anchor.bottom,
      floating.height,
      alignment,
    );
    left = anchor.left - floating.width - gap;
  } else if (side === "right") {
    top = crossAxisPosition(
      anchor.top,
      anchor.bottom,
      floating.height,
      alignment,
    );
    left = anchor.right + gap;
  }

  const maxWidth = Math.max(0, viewportWidth - margin * 2);
  const maxHeight = Math.max(0, viewportHeight - margin * 2);

  return {
    top: clamp(top, margin, viewportHeight - floating.height - margin),
    left: clamp(left, margin, viewportWidth - floating.width - margin),
    side,
    maxWidth,
    maxHeight,
  };
}
