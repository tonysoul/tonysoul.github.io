import fs from "node:fs";
import path from "node:path";

import got from "got";
import { checkFilePathAndMkDir, downLoadImg } from "./utils.js";

interface CrowllerOptions {
  destDir: string;
  destImgDir: string;
  dataFile: string;
  downLoadImg: boolean;
  timeout: number;
}

export interface DownLoadImgItem {
  pic: string;
  alt: string;
  extname: string;
}

export interface AnalyzerResult {
  fileContent: string;
  downLoadImgList: DownLoadImgItem[];
}

export interface Analyzer {
  analyze: (filePath: string, html: string) => AnalyzerResult;
}

export class Crowller {
  private config: CrowllerOptions = {
    destDir: "data",
    destImgDir: "imgs",
    dataFile: "movieData.json",
    downLoadImg: false,
    timeout: 5000,
  };

  // get 方法
  public get sourceDataFile(): string {
    return path.resolve(
      process.cwd(),
      this.config.destDir,
      this.config.dataFile
    );
  }
  public get sourceDestImgDir(): string {
    return path.resolve(
      process.cwd(),
      this.config.destDir,
      this.config.destImgDir
    );
  }

  public set setUrl(url: string) {
    this.url = url;
  }

  // 构造函数
  constructor(
    private url: string,
    private analyzer: Analyzer,
    config?: Partial<CrowllerOptions>
  ) {
    this.config = Object.assign(this.config, config);
  }

  // 1 获取爬虫url，html内容
  private async fetchUrl(): Promise<string> {
    const result = await got(this.url);
    return result.body;
  }

  // 3 写入内容到文件
  private writeFile(fileContent: string) {
    // 判断文件路径是否存在，如果不能存在就创建
    checkFilePathAndMkDir(this.sourceDataFile);

    fs.writeFileSync(this.sourceDataFile, fileContent);
  }

  // 4 （可选，下载图片
  // [{pic: "xxx.jpg", alt: "xxx", extname:".jpg"}]
  private async saveImg(data: DownLoadImgItem[]) {
    await downLoadImg(this.sourceDestImgDir, data, this.config.timeout);
  }

  // 对外方法，启动爬虫
  public async bootstrap() {
    const html = await this.fetchUrl();
    const { fileContent, downLoadImgList } = this.analyzer.analyze(
      this.sourceDataFile,
      html
    );

    console.log("-------- start write file --------");
    this.writeFile(fileContent);
    console.log("write file data end");
    if (this.config.downLoadImg) {
      console.log("-------- downLoading img --------");
      await this.saveImg(downLoadImgList);
      console.log("img downLoaded");
    }
  }
}
