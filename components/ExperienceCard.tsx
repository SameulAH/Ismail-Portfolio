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
    <article className="flex drop-shadow-xl flex-col rounded-3xl items-center space-y-0 flex-shrink-0 w-80 md:w-[600px] xl:w-[700px] snap-center bg-[#FFFFFF] bg-gradient-to-tr from-white to-darkGreen/20 p-5 md:p10 hover:opacity-100 opacity-100 cursor-pointer transition-opacity duration-200 overflow-hidden md:min-h-[540px]">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="flex justify-center items-center mb-2"
      >
        <div className="h-24 w-24 md:h-28 md:w-28 xl:h-[150px] xl:w-[150px] rounded-full overflow-hidden shadow-md bg-white ring-2 ring-darkGreen/20">
          <img
            src={logoSrc}
            alt={`${experience?.company} logo`}
            className="h-full w-full object-contain p-3 bg-white rounded-full"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/placeholder.svg";
            }}
          />
        </div>
      </motion.div>
      <div className="w-full px-0 md:px-10 flex-1 flex flex-col overflow-hidden">
        <div className="md:flex md:justify-between items-center">
          <div>
            <h4 className="text-lg md:text-3xl font-light text-black">
              {experience?.jobTitle}
            </h4>
            <p className="font-bold text-md md:text-2xl mt-1 text-lightGreen">
              {experience?.company}
            </p>
            <div className="flex flex-wrap gap-2 my-2">
              {experience?.technologies?.map((technology) => (
                <img
                  key={technology._id}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                  src={technology?.image}
                  alt={technology?.title}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 md:pr-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-darkGreen/80">
          <ul className="px-0 md:px-10 list-disc text-black space-y-2 text-justify ml-0 text-sm md:text-lg pl-5">
            {experience?.points.map((point, i) => (
              <li key={i}>{point.replace(/\s+/gu, " ").replace(/\u00A0/g, " ").trim()}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
