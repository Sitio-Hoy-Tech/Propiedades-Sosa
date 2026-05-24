"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === "up" ? 32 : 0,
        x: direction === "left" ? -32 : direction === "right" ? 32 : 0,
      }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
