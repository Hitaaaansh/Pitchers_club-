import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GridPatternCardProps {
  children: React.ReactNode;
  className?: string;
  patternClassName?: string;
  gradientClassName?: string;
}

export function GridPatternCard({
  children,
  className,
  patternClassName,
  gradientClassName,
}: GridPatternCardProps) {
  return (
    <motion.div
      className={cn(
        "border w-full rounded-2xl overflow-hidden",
        "bg-[#1A1A1A] border-[#2A2A2A]",
        "p-0",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <div
        className={cn(
          "w-full h-full bg-repeat bg-[length:24px_24px]",
          "bg-grid-pattern-crimson",
          patternClassName,
        )}
      >
        <div
          className={cn(
            "w-full h-full bg-gradient-to-tr",
            "from-[#1A1A1A]/80 via-[#1A1A1A]/40 to-transparent",
            gradientClassName,
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function GridPatternCardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-left p-6 md:p-7", className)} {...props} />;
}
