import { GetStaticProps } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { BlogPost } from "../../typings";
import { getAllPosts } from "../../lib/markdown";
import BlogCard from "../../components/BlogCard";
import BlogHeader from "../../components/BlogHeader";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";

type Props = { posts: BlogPost[] };

export default function BlogIndex({ posts }: Props) {
  return (
    <div className="bg-gradient-to-br from-[#F8F8F8] via-white to-[#e8f1ef] text-slate-800 min-h-screen overflow-x-hidden scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80">
      <Head>
        <title>Blog — Ismail Ahouari</title>
        <meta name="description" content="Technical writing on distributed ML, LLM systems, and AI engineering by Ismail Ahouari." />
      </Head>

      <BlogHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 md:py-20">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 mb-4">
            Blog
          </h1>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl">
            Technical writing on distributed machine learning, LLM systems, and AI engineering.
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-darkGreen/30 to-transparent" />
        </motion.div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </main>

      {/* Sticky home button */}
      <Link href="/">
        <footer className="sticky bottom-5 w-full cursor-pointer z-10">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 bg-darkGreen/80 rounded-full flex items-center justify-center">
              <HomeIcon className="h-7 w-7 pb-0.5 text-white animate-pulse" />
            </div>
          </div>
        </footer>
      </Link>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPosts();
  return { props: { posts } };
};
