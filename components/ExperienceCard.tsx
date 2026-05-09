import { motion } from "framer-motion";
import React from "react";
import { Experience } from "../typings";

type Props = { experience: Experience };

// Format date string consistently to avoid hydration mismatch
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Present";
  try {
    const date = new Date(dateString);
    // Use UTC to ensure server/client consistency
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  } catch {
    return "Present";
  }
}

export default function ExperienceCard({ experience }: Props) {
  const logoSrc = experience?.companyImage?.trim() || "/images/placeholder.svg";

  return (
    <article className="flex flex-col rounded-3xl flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[600px] xl:w-[700px] snap-center bg-white/40 backdrop-blur-lg border border-white/60 shadow-xl shadow-darkGreen/5 p-6 md:p-8 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/60 cursor-pointer transition-all duration-300 md:min-h-[450px]">
      <div className="w-full flex flex-col items-start text-left space-y-4">
        {/* Header Section: Logo + Titles */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="shrink-0"
          >
            <div className="h-16 w-16 md:h-20 md:w-20 xl:h-24 xl:w-24 rounded-full overflow-hidden shadow-md bg-white ring-2 ring-darkGreen/20">
              <img
                src={logoSrc}
                alt={`${experience?.company} logo`}
                className="h-full w-full object-contain p-2 bg-white rounded-full"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </div>
          </motion.div>

          <div className="flex flex-col justify-center">
            <h4 className="text-lg md:text-xl xl:text-2xl font-semibold text-slate-800 leading-tight">
              {experience?.jobTitle}
            </h4>
            <p className="font-bold text-sm md:text-base xl:text-lg text-darkGreen mt-1 leading-tight">
              {experience?.company}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {experience?.technologies?.map((technology) => (
                <img
                  key={technology._id}
                  className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover shadow-sm"
                  src={technology?.image}
                  alt={technology?.title}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Section: Bullet Points */}
        <div className="w-full mt-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-darkGreen/80">
          <ul className="list-disc text-slate-700 space-y-2 text-sm md:text-base leading-relaxed pl-5 marker:text-darkGreen/60 text-justify">
            {experience?.points.map((point, i) => (
              <li key={i}>{point.replace(/\s+/gu, " ").replace(/\u00A0/g, " ").trim()}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
