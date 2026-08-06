export function normalizeChartValue(
  value: number,
  minimum: number,
  maximum: number,
): number {
  if (maximum <= minimum) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, ((value - minimum) / (maximum - minimum)) * 100),
  );
}
