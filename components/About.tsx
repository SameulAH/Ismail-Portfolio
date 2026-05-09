import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { PageInfo } from "../typings";

type Props = { pageInfo: PageInfo };

export default function About({ pageInfo }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative py-10 md:py-16 text-center md:text-left max-w-7xl px-4 sm:px-6 md:px-10 mx-auto items-center"
    >
      <h3 className="mb-6 md:mb-8 uppercase tracking-[0.25em] md:tracking-[20px] bg-clip-text text-transparent bg-gradient-to-r from-darkGreen to-lightGreen text-xl md:text-2xl font-bold text-center w-full">
        About
      </h3>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-6xl mx-auto gap-8 md:gap-16">
        <motion.div
        initial={{
          x: -200,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{
          x: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
      >
        <Image
          src="/images/ismail3.jpg"
          alt={pageInfo?.name}
          width={400}
          height={480}
          loading="lazy"
          className="mb-8 md:mb-0 mt-8 md:mt-0 flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-80 xl:w-[400px] xl:h-[480px] rounded-2xl object-cover object-top shadow-2xl bg-white/50 backdrop-blur-sm"
        />
      </motion.div>
      <div className="space-y-6 md:space-y-8 px-0 md:px-4 max-w-2xl flex-1 text-center md:text-left">
        <h4 className="text-2xl md:text-4xl font-semibold">
          Here is a{" "}
          <span className="underline decoration-darkGreen/50">little</span>{" "}
          background
        </h4>
        <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed text-left md:text-left">
          {pageInfo?.backgroundInformation?.replace(/_/g, ' ').replace(/—/g, ' ')}
        </p>
      </div>
      </div>
    </motion.div>
  );
}
