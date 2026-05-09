import React from "react";
import { motion } from "framer-motion";
import { Skill as mySkill } from "../typings";

type Props = {
  skill: mySkill;
  directionLeft?: boolean;
};

export default function Skill({ skill, directionLeft }: Props) {
  return (
    <div className="group relative flex cursor-pointer">
      <motion.img
        initial={{
          x: directionLeft ? -80 : 80,
          opacity: 0,
        }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        src={skill?.image}
        alt={skill?.title}
        className="rounded-full border border-gray-200 object-cover w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-28 xl:h-28 filter group-hover:grayscale transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-lg bg-white p-2"
      />
    </div>
  );
}
