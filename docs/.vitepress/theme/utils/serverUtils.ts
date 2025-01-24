import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";

async function getPosts() {
  let paths = await globby(["docs/**.md"]);

  let posts = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, "utf-8");
      const { data } = matter(content);
      return {
        frontMatter: data,
        regularPath: `/${item.replace(".md", ".html")}`,
      };
    })
  );

  return posts;
}

export { getPosts };
