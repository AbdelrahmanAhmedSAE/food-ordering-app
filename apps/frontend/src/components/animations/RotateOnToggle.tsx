"use client";
import { motion } from "motion/react";

interface RotateOnToggleProps {
  toggled: boolean;
  children: React.ReactNode;
  degrees?: number;
  duration?: number;
}

export const RotateOnToggle = ({
  toggled,
  children,
  degrees = 90,
  duration = 0.2,
}: RotateOnToggleProps) => (
  <motion.div
    animate={{ rotate: toggled ? degrees : 0 }}
    transition={{ duration }}
  >
    {children}
  </motion.div>
);
