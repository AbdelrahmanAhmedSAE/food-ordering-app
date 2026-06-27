"use client";
import { motion } from "motion/react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollAnimation = ({
  children,
  className,
  delay,
}: ScrollAnimationProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut", delay: delay ?? 0 }}
  >
    {children}
  </motion.div>
);
