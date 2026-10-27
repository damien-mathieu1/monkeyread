"use client";

import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { remainingParts } from "@/lib/format";

/** Remaining reading time with digits that roll as they change. */
export function RemainingTime({ ms }: { ms: number }) {
  return (
    <NumberFlowGroup>
      {remainingParts(ms).map(({ value, unit }, i) => (
        <span key={unit}>
          {i > 0 && " "}
          <NumberFlow value={value} /> {unit}
        </span>
      ))}
    </NumberFlowGroup>
  );
}
