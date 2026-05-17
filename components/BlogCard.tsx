import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BlogPost } from "../typings";

type Props = { post: BlogPost; index: number };

export default function BlogCard({ post, index }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="group h-full flex flex-col bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          {/* Cover image */}
          <div className="h-44 bg-white flex items-center justify-center p-4 overflow-hidden">
            <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5 md:p-6 space-y-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-darkGreen/8 text-darkGreen border border-darkGreen/15"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h4 className="text-base md:text-lg font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-darkGreen transition-colors duration-200">
              {post.title}
            </h4>

            {/* Excerpt */}
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">{formattedDate}</span>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
