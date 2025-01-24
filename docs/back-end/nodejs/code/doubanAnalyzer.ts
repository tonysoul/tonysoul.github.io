import path from "node:path";
import fs from "node:fs";
import { load } from "cheerio";
import { replaceSpace } from "./utils.js";
import { Analyzer, DownLoadImgItem } from "./crowller.js";

interface DateStructure {
  [key: string]: MovieItem;
}

interface MovieItem {
  rank: number;
  pic: string;
  alt: string;
  extname: string;
  title: string;
  url: string;
  star: number;
  quote: string;
}

export class DoubanAnalyzer implements Analyzer {
  // 2 分析html内容，得到我们想要的
  // 我们想要的数据结构为 [ {rank:1, pic: "xxxxx.jpg", alt:"xxx", extname: ".jpg", title: "xxx", url: "xxxx", star: 9.7, quote: "xxxx" } ]
  private getMovieInfoData(html: string) {
    const $ = load(html);
    const movieList = $(".grid_view > li");
    const resultArr: MovieItem[] = [];

    movieList.each((i, el) => {
      const $el = $(el);
      const rank = Number($el.find(".pic > em").text());
      const pic = $el.find(".pic img").attr("src") as string;
      const alt = replaceSpace($el.find(".pic img").attr("alt") as string);
      const extname = path.extname(pic);
      const title = replaceSpace($el.find(".info .hd > a").text());
      const url = $el.find(".info .hd > a").attr("href") as string;
      const star = Number($el.find(".info .bd .star .rating_num").text());
      const quote = replaceSpace($el.find(".info .bd .quote").text());

      resultArr.push({
        rank,
        pic,
        alt,
        extname,
        title,
        url,
        star,
        quote,
      });
    });

    return resultArr;
  }

  private generatorContent(filePath: string, data: MovieItem[]) {
    let fileContent: DateStructure = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    data.forEach((item) => {
      fileContent[item.rank] = item;
    });

    return fileContent;
  }

  private getDownLoadImgList(data: MovieItem[]) {
    return data.map((item) => {
      const { pic, alt, extname } = item;
      return {
        pic,
        alt,
        extname,
      };
    });
  }

  public analyze(filePath: string, html: string) {
    const data = this.getMovieInfoData(html);
    const fileContent = JSON.stringify(this.generatorContent(filePath, data));
    const downLoadImgList: DownLoadImgItem[] = this.getDownLoadImgList(data);

    return { fileContent, downLoadImgList };
  }
}
