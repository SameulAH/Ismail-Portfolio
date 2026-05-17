import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HomeIcon } from "@heroicons/react/24/solid";
import { BlogPost } from "../../typings";
import { getAllSlugs, getPostBySlug } from "../../lib/markdown";
import BlogHeader from "../../components/BlogHeader";

type Props = { meta: BlogPost; content: string };

export default function BlogPostPage({ meta, content }: Props) {
  const formattedDate = new Date(meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gradient-to-br from-[#F8F8F8] via-white to-[#e8f1ef] text-slate-800 min-h-screen overflow-x-hidden scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80">
      <Head>
        <title>{meta.title} — Ismail Ahouari</title>
        <meta name="description" content={meta.excerpt} />
      </Head>

      <BlogHeader showBackToBlog />

      {/* Cover image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden"
      >
        <Image
          src={meta.coverImage}
          alt={meta.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F8F8] via-transparent to-transparent" />
      </motion.div>

      {/* Article */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10 pb-20">
        {/* Post header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-8 md:pt-10 mb-10"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-darkGreen/8 text-darkGreen border border-darkGreen/15"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-semibold text-gray-800 leading-tight mb-5">
            {meta.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-gray-400 pb-8 border-b border-gray-200">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{meta.readTime}</span>
          </div>
        </motion.div>

        {/* Markdown content */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="prose prose-slate max-w-none
            prose-headings:font-semibold prose-headings:text-darkGreen
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-4
            prose-a:text-darkGreen prose-a:no-underline hover:prose-a:text-lightGreen
            prose-strong:text-gray-800
            prose-code:text-darkGreen prose-code:bg-[#e8f4f1] prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
            prose-pre:bg-[#EFF6FF] prose-pre:text-slate-700 prose-pre:rounded-xl prose-pre:text-sm prose-pre:border prose-pre:border-blue-100 prose-pre:shadow-none
            [&_pre_code]:bg-transparent [&_pre_code]:text-slate-700 [&_pre_code]:p-0 [&_pre_code]:border-0
            prose-blockquote:border-lightGreen prose-blockquote:text-gray-500
            prose-ul:my-4 prose-li:my-1
            prose-table:text-sm
            prose-th:text-darkGreen prose-th:font-semibold
            prose-hr:border-gray-200"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <figure className="my-10 not-prose">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src ?? ""}
                    alt={alt ?? ""}
                    className="w-full rounded-2xl border border-gray-200/70 shadow-md object-contain"
                  />
                  {alt && (
                    <figcaption className="text-center text-sm text-gray-400 mt-3 italic leading-relaxed">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </motion.article>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-darkGreen hover:text-lightGreen font-medium transition-colors duration-200"
          >
            ← Back to all posts
          </Link>
          <Link
            href="/#contact"
            className="text-sm text-gray-400 hover:text-darkGreen transition-colors duration-200"
          >
            Get in touch →
          </Link>
        </motion.div>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { meta, content } = getPostBySlug(params!.slug as string);
  return { props: { meta, content } };
};
