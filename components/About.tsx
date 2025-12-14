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
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-28 md:top-24 uppercase tracking-[0.25em] md:tracking-[20px] text-gray-500 text-xl md:text-2xl pl-[20px] font-medium md:font-normal">
          About
      </h3>

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
          className="-mb-24 mt-8 md:mt-0 md:mb-0 flex-shrink-0 w-56 h-56 rounded-full object-cover object-top md:rounded-xl md:w-72 md:h-80 xl:w-[400px] xl:h-[480px] shadow-xl ring-2 ring-darkGreen/20"
        />
      </motion.div>
      <div className="space-y-6 md:space-y-8 px-0 md:px-10 max-w-xl">
        <h4 className="text-2xl md:text-4xl font-semibold">
          Here is a{" "}
          <span className="underline decoration-darkGreen/50">little</span>{" "}
          background
        </h4>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed text-justify">
          {pageInfo?.backgroundInformation?.replace(/_/g, ' ').replace(/—/g, ' ')}
        </p>
      </div>
    </motion.div>
  );
}
