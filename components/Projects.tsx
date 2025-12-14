import { motion } from "framer-motion";
import React from "react";
import { Project } from "../typings";

type Props = { projects: Project[] };

export default function Projects({ projects }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen md:h-screen relative flex overflow-hidden flex-col text-center md:text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0 px-4 sm:px-6"
    >
      <h3 className="absolute top-36 md:top-24 uppercase tracking-[0.25em] md:tracking-[20px] text-gray-500 text-xl md:text-2xl pl-[20px] font-medium md:font-normal">
          Projects
      </h3>

      <div className="relative w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory z-20 scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80">
        {projects?.map((project, i) => (
          <div
            key={project._id}
            className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[680px] flex-shrink-0 snap-center flex flex-col space-y-3 md:space-y-5 items-center justify-center p-4 pt-16 sm:pt-20 md:pt-32 md:px-12 min-h-[75vh]"
          >
            <motion.img
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-48 md:w-48 xl:h-64 xl:w-64 rounded-full object-cover shadow-lg ring-4 ring-darkGreen/30"
              src={project?.image}
              alt={project?.title}
            />

            <div className="space-y-5 md:space-y-10 px-0 md:px-10 max-w-6xl">
              <h4 className="text-lg md:text-2xl lg:text-4xl font-semibold text-center">
                <span className="underline decoration-darkGreen/50">
                  Project {i + 1}:
                </span>{" "}
                {project?.title}
              </h4>
              <div className="flex items-center space-x-2 justify-center flex-wrap gap-2">
                {project?.technologies?.map((technology, idx) => {
                  if (technology.title?.toLowerCase().includes("mpi")) return null;
                  // For the Split Learning thesis project, render PyTorch + MPI together
                  if (project.title?.toLowerCase().includes('split learning') || project.title?.toLowerCase().includes('slperf')) {
                    const titleLower = technology.title.toLowerCase();
                    const isPyTorch = titleLower.includes('pytorch');
                    const isMPI = titleLower.includes('mpi');

                    // Skip rendering MPI here; we'll render it together with PyTorch so it appears only once
                    if (isMPI) return null;

                    if (isPyTorch) {
                      return [
                        <img
                          key={technology._id}
                          className="h-8 w-8 rounded-full object-cover"
                          src={technology?.image}
                          alt={technology?.title}
                        />,
                        <img
                          key="slperf-extra"
                          className="h-8 w-8 rounded-full object-cover"
                          src="/images/slperf-extra.png"
                          alt="SLPerf Extra"
                        />
                      ].filter(Boolean);
                    }
                  }
                  // Default rendering for all other icons
                  return technology?.image ? (
                    <img
                      key={technology._id}
                      className="h-8 w-8 rounded-full object-cover"
                      src={technology?.image}
                      alt={technology?.title}
                    />
                  ) : null;
                })}
              </div>

              <p className="text-sm md:text-md lg:text-lg text-justify ">
                {project?.summary}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full absolute top-[30%] md:top-[30%] bg-darkGreen/40 left-0 h-[500px] -skew-y-12"></div>
    </motion.div>
  );
}
