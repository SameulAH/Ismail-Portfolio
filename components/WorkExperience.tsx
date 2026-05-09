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
      className="py-10 md:py-16 flex relative overflow-hidden flex-col text-left max-w-full px-4 sm:px-6 md:px-10 mx-auto items-center"
    >
      <h3 className="mb-6 md:mb-8 uppercase tracking-[0.25em] md:tracking-[20px] bg-clip-text text-transparent bg-gradient-to-r from-darkGreen to-lightGreen text-xl md:text-2xl font-bold text-center w-full">
        Experience
      </h3>

      {/* Experience cards */}
      <div className="w-full text-left pb-5 md:pb-10 flex space-x-4 md:space-x-5 overflow-x-auto p-4 sm:p-6 md:p-8 snap-x snap-mandatory scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80">
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
