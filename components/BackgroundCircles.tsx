import React from "react";
import { motion } from "framer-motion";

type Props = {};

export default function BackgroundCircles({}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        scale: [1, 2, 2, 3, 1],
        opacity: [0.1, 0.2, 0.4, 0.8, 0.1, 1.0],
        borderRadius: ["20%", "20%", "50%", "80%", "20%"],
      }}
      transition={{
        duration: 2.5,
      }}
      className="relative flex justify-center items-center"
    >
      <div
        className="absolute border border-grayColor opacity-30 rounded-full h-[140px] w-[140px] mt-48 md:mt-32 
            animate-ping"
      />
      <div
        className="absolute border border-grayColor opacity-30 rounded-full h-[210px] w-[210px] mt-48 md:mt-32 
            animate-ping"
      />
      <div
        className="absolute border border-grayColor  opacity-30 rounded-full h-[350px] w-[350px] mt-48 md:mt-32 
            animate-ping"
      />
      <div
        className="absolute border border-darkGreen opacity-20 h-[357px] w-[357px] md:h-[455px] md:w-[455px] 
            animate-pulse mt-48 md:mt-32 rounded-full"
      />
      <div
        className="absolute border border-grayColor opacity-30 rounded-full h-[560px] w-[560px] mt-48 md:mt-32 
            animate-ping"
      />
    </motion.div>
  );
}
