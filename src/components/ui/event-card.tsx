import * as React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar } from "lucide-react";

interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  date: string;
  description: string;
  href: string;
}

const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
  ({ className, imageUrl, title, date, description, href, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("group w-full h-full", className)} {...props}>
        <Link
          to={href}
          className="relative flex flex-col w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-white/20 hover:shadow-[0_0_36px_-5px_rgba(165,0,0,0.36)]"
        >
          {/* Full Background Image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {imageUrl && imageUrl.startsWith("linear-gradient") ? (
              <div
                className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-[1.2]"
                style={{ backgroundImage: imageUrl }}
              />
            ) : (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.2]"
              />
            )}
            {/* Crimson & Dark Gradient Overlay for optimal text legibility */}
            <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/95 via-black/60 to-black/20 group-hover:opacity-90" />
          </div>

          {/* Content area on top of background image */}
          <div className="relative flex flex-col justify-end flex-1 p-5 text-white z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8A020]/20 border border-[#E8A020]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#E8A020] mb-3">
                <Calendar className="h-3 w-3" />
                {date}
              </div>

              <h3 className="text-xl font-display uppercase tracking-tight text-white mb-2 line-clamp-2 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-white/80 font-sans font-light tracking-wide line-clamp-3 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 transition-all duration-300 group-hover:bg-white/10">
              <span className="text-[10px] uppercase tracking-widest font-bold">View Details</span>
              <ArrowRight className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    );
  },
);
EventCard.displayName = "EventCard";

export { EventCard };
