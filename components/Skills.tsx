import { motion } from "framer-motion";
import React from "react";
import { Skill as SkillType } from "../typings";
import Skill from "./Skill";

type Props = { skills: SkillType[] };

export default function Skills({ skills }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen md:h-screen flex relative flex-col text-center md:text-left xl:flex-row max-w-[2000px] xl:px-10 justify-center xl:space-y-0 mx-auto items-center px-4 sm:px-6"
    >
      <h3 className="absolute top-36 md:top-24 uppercase tracking-[0.25em] md:tracking-[20px] text-gray-500 text-xl md:text-2xl pl-[20px] font-medium md:font-normal">
          Skills
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5 md:mt-24">
        {skills?.slice(0, skills.length / 2).map((skill) => (
          <Skill key={skill._id} skill={skill} />
        ))}

        {skills?.slice(skills.length / 2, skills.length).map((skill) => (
          <Skill key={skill._id} skill={skill} directionLeft />
        ))}
      </div>
    </motion.div>
  );
}
