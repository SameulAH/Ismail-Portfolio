import { motion } from "framer-motion";
import React from "react";
import { Experience } from "../typings";
import ExperienceCard from "./ExperienceCard";

type Props = { experiences: Experience[] };

export default function WorkExperience({ experiences }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen md:h-screen flex relative overflow-hidden flex-col text-left md:flex-row max-w-full px-4 sm:px-6 md:px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-24 md:top-24 uppercase tracking-[0.25em] md:tracking-[20px] text-gray-500 text-xl md:text-2xl pl-[20px] font-medium md:font-normal">
          Experience
      </h3>

      {/* Experience cards */}
      <div className="w-full h-3/4 md:h-2/3 text-left pb-5 md:pb-10 flex space-x-4 md:space-x-5 overflow-x-auto p-6 sm:p-8 md:p-10 snap-x snap-mandatory scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80">
        {experiences
          ?.slice() // make a shallow copy so we don't mutate the original array
          .sort(
            (a, b) =>
              new Date(b.dateStarted).getTime() -
              new Date(a.dateStarted).getTime()
          )
          .map((experience) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
      </div>
    </motion.div>
  );
}
