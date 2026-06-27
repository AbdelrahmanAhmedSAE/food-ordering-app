// components/animations/FadeSlide.tsx
"use client";
import { AnimatePresence, motion } from "motion/react";

type Direction = "up" | "down" | "left" | "right";

interface FadeSlideProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  duration?: number;
  distance?: number;
}

const getInitial = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { opacity: 0, y: distance };
    case "down":
      return { opacity: 0, y: -distance };
    case "left":
      return { opacity: 0, x: distance };
    case "right":
      return { opacity: 0, x: -distance };
  }
};

export const FadeSlide = ({
  show,
  children,
  className,
  direction = "down",
  duration = 0.2,
  distance = 10,
}: FadeSlideProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={getInitial(direction, distance)}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={getInitial(direction, distance)}
        transition={{ duration }}
        className={className}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
