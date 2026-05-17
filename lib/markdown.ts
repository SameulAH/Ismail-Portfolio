import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "../typings";

const postsDir = path.join(process.cwd(), "posts");

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title,
        date: data.date,
        readTime: data.readTime,
        excerpt: data.excerpt,
        tags: data.tags ?? [],
        coverImage: data.coverImage,
      } as BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): { meta: BlogPost; content: string } {
  const fullPath = path.join(postsDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: data.title,
      date: data.date,
      readTime: data.readTime,
      excerpt: data.excerpt,
      tags: data.tags ?? [],
      coverImage: data.coverImage,
    },
    content,
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
