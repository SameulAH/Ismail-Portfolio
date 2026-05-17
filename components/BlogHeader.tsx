import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

type Props = {
  showBackToBlog?: boolean;
};

export default function BlogHeader({ showBackToBlog = false }: Props) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Left — back navigation */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {showBackToBlog ? (
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-darkGreen transition-colors duration-200 group"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Blog
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-darkGreen transition-colors duration-200 group"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Portfolio
            </Link>
          )}
        </motion.div>

        {/* Center — logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Link href="/" className="text-sm font-semibold text-darkGreen tracking-widest uppercase hover:opacity-80 transition-opacity">
            Ismail Ahouari
          </Link>
        </motion.div>

        {/* Right — portfolio link */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#contact"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-darkGreen transition-colors duration-200"
          >
            Get in touch
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
