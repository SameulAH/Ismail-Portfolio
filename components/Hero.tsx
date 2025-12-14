import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { PageInfo } from "../typings";
import BackgroundCircles from "./BackgroundCircles";

type Props = { pageInfo: PageInfo };

export default function Hero({ pageInfo }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [text] = useTypewriter({
    words: [
      `Hi, I'm ${pageInfo?.name}`,
      "Building AI-powered solutions 🤖",
      "Distributed Learning Researcher",
      "Coffee-fueled coder ☕️",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div className="min-h-screen md:h-screen flex flex-col space-y-6 sm:space-y-8 items-center justify-center text-center overflow-hidden px-4">
      <BackgroundCircles />

      <img
        className="relative rounded-full h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 mx-auto object-cover"
        src={pageInfo?.heroImage}
        alt={pageInfo?.name}
      />

      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-500 pb-2 tracking-[10px] md:tracking-[15px]">
          {pageInfo?.role}
        </h2>
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-semibold px-4 sm:px-10">
          <span className="mr-3">{mounted ? text : `Hi, I'm ${pageInfo?.name}`}</span>
          {mounted && <Cursor cursorColor="#68B2A0" />}
        </h1>

        <div className="pt-5">
          <Link href="#about">
            <button className="heroButton">About</button>
          </Link>
          <Link href="#experience">
            <button className="heroButton">Experience</button>
          </Link>
          <Link href="#skills">
            <button className="heroButton">Skills</button>
          </Link>
          <Link href="#projects">
            <button className="heroButton">Projects</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
