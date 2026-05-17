import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "../typings";
import BlogCard from "./BlogCard";

type Props = { posts: BlogPost[] };

export default function Blog({ posts }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="py-12 md:py-20 flex relative flex-col text-center max-w-7xl px-4 sm:px-6 md:px-10 mx-auto items-center"
    >
      <h3 className="mb-8 md:mb-10 uppercase tracking-[0.25em] md:tracking-[20px] bg-clip-text text-transparent bg-gradient-to-r from-darkGreen to-lightGreen text-xl md:text-2xl font-bold text-center w-full">
        Blog
      </h3>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} />
        ))}
      </div>

      <Link href="/blog">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 px-8 py-3 border border-darkGreen/30 text-darkGreen rounded-xl text-sm font-semibold tracking-wide hover:border-darkGreen hover:bg-darkGreen/5 hover:shadow-sm transition-all duration-300"
        >
          View all posts →
        </motion.button>
      </Link>
    </motion.div>
  );
}
