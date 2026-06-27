"use client";

import { cn } from "@/lib/utils";

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export const QuantityControl = ({
  value,
  onChange,
  min = 0,
  max,
  disabled = false,
  className,
}: QuantityControlProps) => (
  <div className={cn("flex items-center gap-3", className)}>
    <button
      disabled={disabled || value <= min}
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-80 disabled:opacity-40"
    >
      −
    </button>
    <span className="font-bold w-6 text-center">{value}</span>
    <button
      disabled={disabled || (max !== undefined && value >= max)}
      onClick={() =>
        onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)
      }
      className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-80 disabled:opacity-50"
    >
      +
    </button>
  </div>
);
