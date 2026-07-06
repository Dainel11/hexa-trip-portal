"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef } from "react";

/** Uniform Bike Bear reveal on every route: fade in + slide up on each navigation.
 *  Transform is cleared once the animation completes so sticky/fixed children
 *  (search bars, modals) behave normally at rest. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={() => { if (ref.current) ref.current.style.transform = "none"; }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
