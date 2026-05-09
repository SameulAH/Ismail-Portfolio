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
      className="py-10 md:py-16 relative flex overflow-hidden flex-col text-center md:text-left max-w-full mx-auto items-center z-0 px-4 sm:px-6"
    >
      <h3 className="mb-6 md:mb-8 uppercase tracking-[0.25em] md:tracking-[20px] bg-clip-text text-transparent bg-gradient-to-r from-darkGreen to-lightGreen text-xl md:text-2xl font-bold text-center w-full">
        Projects
      </h3>

      <div className="relative w-full flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory z-20 scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80">
        {projects?.map((project, i) => (
          <div
            key={project._id}
            className="w-[90vw] sm:w-full max-w-[360px] sm:max-w-[420px] md:max-w-[680px] flex-shrink-0 snap-center flex flex-col space-y-4 md:space-y-6 items-center justify-center p-6 pt-10 sm:pt-16 md:pt-20 md:px-12 bg-white/40 backdrop-blur-lg border border-white/60 shadow-xl shadow-darkGreen/5 rounded-3xl hover:-translate-y-2 hover:shadow-2xl hover:bg-white/60 transition-all duration-300"
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

      <div className="w-full absolute top-[30%] md:top-[30%] bg-gradient-to-r from-lightGreen/20 to-darkGreen/20 backdrop-blur-3xl left-0 h-[500px] -skew-y-12"></div>
    </motion.div>
  );
}
