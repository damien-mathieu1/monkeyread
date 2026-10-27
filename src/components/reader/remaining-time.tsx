"use client";

import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { remainingParts } from "@/lib/format";

/** Remaining reading time with digits that roll as they change. */
export function RemainingTime({ ms, animated }: { ms: number; animated: boolean }) {
  return (
    <NumberFlowGroup>
      {remainingParts(ms).map(({ value, unit }, i) => (
        <span key={unit}>
          {i > 0 && " "}
          <NumberFlow value={value} animated={animated} /> {unit}
        </span>
      ))}
    </NumberFlowGroup>
  );
}
