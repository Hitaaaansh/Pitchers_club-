"use client";

import * as React from "react";
import { Calendar, DollarSign, Megaphone, Palette, Share2, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const domains = [
  {
    id: "events",
    title: "Events",
    description:
      "Plan and execute everything from intimate workshops to flagship competitions. You run the show.",
    imgSrc:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80&fm=webp",
    icon: <Calendar size={24} />,
  },
  {
    id: "finance",
    title: "Finance",
    description:
      "Manage club budgets, sponsorships, and the financial backbone of every venture we run.",
    imgSrc:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80&fm=webp",
    icon: <DollarSign size={24} />,
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "Craft campaigns, build partnerships, and tell the story that puts Pitchers on the map.",
    imgSrc:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80&fm=webp",
    icon: <Megaphone size={24} />,
  },
  {
    id: "design",
    title: "Design",
    description:
      "Own the visual identity — posters, decks, merch, and every pixel that represents Pitchers.",
    imgSrc:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80&fm=webp",
    icon: <Palette size={24} />,
  },
  {
    id: "media",
    title: "Media",
    description:
      "Photography, videography, and managing our social media presence (Instagram, LinkedIn) to archive and share every Pitchers moment.",
    imgSrc:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80&fm=webp",
    icon: <Video size={24} />,
  },
];

export default function DomainExpandingCards() {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="w-full bg-[#0F0F0F] py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        {/* LEFT — Heading */}
        <div className="lg:w-2/5 flex-shrink-0">
          <p className="text-[#E8A020] text-sm uppercase tracking-widest mb-4">Five Domains</p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-wide text-white">
            Find
            <br />
            Your
            <br />
            <span className="text-[#A50000]">Domain.</span>
          </h2>
          <p className="mt-6 text-[#A0A0A0] text-base leading-relaxed max-w-sm">
            Whatever you are good at — or want to get good at — there is a place for you in
            Pitchers. Pick your lane and own it.
          </p>
        </div>

        {/* RIGHT — Expanding Cards */}
        <div className="lg:w-3/5 w-full">
          <ul className="w-full gap-2 flex flex-col md:flex-row h-[550px] md:h-[500px]">
            {domains.map((domain, index) => (
              <li
                key={domain.id}
                style={{ flexGrow: activeIndex === index ? 6 : 1 }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 transition-[flex-grow,transform] duration-500 ease-out md:min-w-[60px] will-change-[flex-grow,transform]"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                data-active={activeIndex === index}
              >
                {/* Background Image */}
                <img
                  src={domain.imgSrc}
                  alt={domain.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-500 ease-out group-data-[active=true]:scale-100 group-data-[active=true]:grayscale-0 scale-110 grayscale will-change-[transform,filter]"
                />

                {/* Crimson Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(165,0,0,0.92), rgba(30,30,30,0.5) 50%, transparent 80%)",
                  }}
                />

                {/* Collapsed state — domain name */}
                <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center text-sm sm:text-xl font-bold uppercase tracking-[0.25em] text-[#E8A020] whitespace-nowrap transition-all duration-300 group-data-[active=true]:opacity-0 md:-rotate-90">
                  {domain.title}
                </h3>

                {/* Expanded state — icon, title, description */}
                <article className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
                  <div className="text-[#E8A020] opacity-0 transition-all duration-300 delay-75 ease-out group-data-[active=true]:opacity-100">
                    {domain.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white opacity-0 transition-all duration-300 delay-150 ease-out group-data-[active=true]:opacity-100">
                    {domain.title}
                  </h3>
                  <p className="text-sm text-white/80 max-w-xs opacity-0 transition-all duration-300 delay-200 ease-out group-data-[active=true]:opacity-100">
                    {domain.description}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
