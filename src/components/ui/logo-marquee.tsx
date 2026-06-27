import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  className?: string;
};

type LogoMarqueeProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoMarquee({ className, logos, ...props }: LogoMarqueeProps) {
  return (
    <section className="relative py-8">
      <h2 className="mb-4 text-center font-medium text-sm text-[#666666] uppercase tracking-widest">
        Our Partners & Collaborators
      </h2>
      <div className="mx-auto mb-4 h-px max-w-sm bg-[#2A2A2A] [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

      <div
        {...props}
        className={cn(
          "overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
          className,
        )}
      >
        <InfiniteSlider gap={56} reverse speed={60}>
          {logos.map((logo) => (
            <img
              alt={logo.alt}
              className={cn(
                "pointer-events-none h-8 md:h-10 select-none opacity-80 hover:opacity-100 brightness-[1.4] transition-all duration-300 object-contain",
                logo.className,
              )}
              key={`logo-${logo.alt}`}
              loading="lazy"
              src={logo.src}
            />
          ))}
        </InfiniteSlider>
      </div>

      <div className="mx-auto mt-4 h-px max-w-sm bg-[#2A2A2A] [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
    </section>
  );
}
