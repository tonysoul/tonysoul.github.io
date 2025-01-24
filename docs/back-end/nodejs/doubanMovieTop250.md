# 豆瓣电影 Top250 爬虫

我们如何用 NodeJS 实现一个豆瓣 top250 爬虫，答案很简单：

- 使用 http 请求库抓取 url （http 请求，got）
  - 如果网页是动态内容生成，需要用到无头浏览器来获取 html 内容
- 获得到 html 页面数据后，分析想要爬取的内容（html 内容分析，cheerio）
- 把分析后想要的内容写入文件
- （可选）图片下载

## 技术要点

- node sleep（node 异步暂停，我们使用 async await）
- http 请求库
  - request 请求库 已经废弃了
  - superagent 发送 http 请求，获取 html 页面数据
    - [https://ladjs.github.io/superagent/docs/zh_CN/index.html#重试请求](https://ladjs.github.io/superagent/docs/zh_CN/index.html#%E9%87%8D%E8%AF%95%E8%AF%B7%E6%B1%82) 文档
  - got
    - https://github.com/sindresorhus/got/blob/HEAD/documentation/quick-start.md
- cheerio 类似 jq 语法来获取想要的内容
- node stream 下载图片
- json-server 本地快速的 json 服务器
- 无头浏览器 **Puppeteer**（需要页面动态生成时使用）
  - phantomjs
  - node webkit spider
  - **[playwright](https://github.com/microsoft/playwright)**

## 项目初始化

当前的 Node 开发环境版本

```tsx
node -v
v18.12.0
```

```tsx
pnpm init
```

`package.json`type 修改为 module

```tsx
"type": "module"
```

安装依赖

```tsx
pnpm add got cheerio
pnpm add json-server ts-node nodemon typescript -D
```

我们把https://movie.douban.com/top250 的 html 页面存到本地，就不用每次都请求真实的地址了，仅供测试使用`public/index.html`

新建一个空的 `db.json` 文件，作为 json-server 的入口，设置服务脚本

package.json

```tsx
"scripts": {
	"server": "json-server db.json"
}
```

它会自动开启一个静态文件服务器，内容为`public`文件夹里面的

配置 dev 脚本，服务自动重启

```tsx
"scripts": {
	"dev": "nodemon --exec ts-node --esm src/index.ts",
	"server": "json-server db.json"
}
```

```tsx
// 忽略文件
"nodemonConfig": {
  "ignore": [
    "data/*",
    "db.json"
  ]
},
```

我们新建 `src/index.ts` 测试一下

```tsx
const hello: string = "tony";
console.log(hello);
```

```tsx
pnpm dev
pnpm run server
```

这里可能会报错，因为我们是一个 ts 项目，还需要配置 tsconfig

```tsx
tsc --init
```

`tsconfig.json`

```tsx
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "Node16",
    "rootDir": "./src",
    "outDir": "./dist",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 目录结构

```bash
- node_modules
- public
  - index.html
- src
  - index.ts // 入口文件
  - crowller.ts  // 爬虫文件
  - doubanAnalyzer.ts  // 分析器
  - utils.ts  // 工具方法
- db.json
- package.json
- tsconfig.json;
```

## 爬虫

我们从爬虫类开始写 `crowller.ts`

```tsx
import got from "got";
import { load } from "cheerio";
import path from "path";

export class Crowller {
  private url = "http://localhost:3000";
  private destDir = "data";
  private dataFile = "movieData.json";
  private downLoadImg = false;

  // get 方法
  private get sourceDestDir(): string {
    return path.resolve(process.cwd(), this.destDir);
  }
  private get sourceDataFile(): string {
    return path.resolve(process.cwd(), this.destDir, this.dataFile);
  }

  // 构造函数
  constructor() {}

  // 1 获取爬虫url，html内容
  private async fetchUrl(): Promise<string> {}

  // 2 分析html内容，得到我们想要的
  private analyzerHtml(html: string) {}

  // 3 写入内容到文件
  private writeFile() {}

  // 4 （可选，下载图片
  private async saveImg() {}

  // 对外方法，启动爬虫
  public async bootstrap() {
    const html = await this.fetchUrl();
    const data = this.analyzerHtml(html);

    console.log("-------- start write file --------");
    this.writeFile(data);
    console.log("write file data end");
    if (this.downLoadImg) {
      console.log("-------- downLoading img --------");
      await this.saveImg(data);
      console.log("img downLoaded");
    }
  }
}
```

`fetchUrl`

```tsx
private async fetchUrl(): Promise<string> {
  const result = await got(this.url);
  return result.body;
}
```

`analyzerHtml`

```tsx
// 在头部声明类型
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

// ...
// 我们想要的数据结构为 [ {rank:1, pic: "xxxxx.jpg", alt:"xxx", extname: ".jpg", title: "xxx", url: "xxxx", star: 9.7, quote: "xxxx" } ]
private analyzerHtml(html: string) {
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
```

`writeFile`

```tsx
private writeFile(data: MovieItem[]) {
  // 判断文件路径是否存在，如果不能存在就创建
  checkFilePathAndMkDir(this.sourceDataFile);

  let fileContent: DateStructure = {};
  if (fs.existsSync(this.sourceDataFile)) {
    fileContent = JSON.parse(fs.readFileSync(this.sourceDataFile, "utf-8"));
  }

  data.forEach((item) => {
    fileContent[item.rank] = item;
  });

  fs.writeFileSync(this.sourceDataFile, JSON.stringify(fileContent));
}
```

`saveImg`

```tsx
// [{pic: "xxx.jpg", alt: "xxx", extname:".jpg"}]
private async saveImg(data: DownLoadImgItem[]) {
  await downLoadImg(this.sourceDestImgDir, data);
}
```

我们在这个类里面用到了几个工具方法，我们把他们放到 `src/utils.ts`

```tsx
import path from "node:path";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import got from "got";
import { DownLoadImgItem } from "./crowller.js";

export const sleep = (timeout = 2500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const replaceSpace = (str: string) => {
  return str.replace(/[\s\n]/gi, "");
};

/**
 * 判断文件是否存在，如果不存在，判断它的父级文件目录是否存在，不存在则创建
 * @date 2023/5/26 - 11:27:20
 *
 * @param {string} filePath 注意：是文件路径，不是文件夹
 */
export const checkFilePathAndMkDir = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    const tempDir = path.dirname(filePath);

    if (!fs.existsSync(tempDir)) {
      // 递归创建，无论有多少层文件夹嵌套
      fs.mkdirSync(tempDir, { recursive: true });
    }
  }
};

export const downLoadImg = async (imgDir: string, data: DownLoadImgItem[]) => {
  const failResult = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { pic, alt, extname } = item;
    const fileName = `${alt}${extname}`;
    const filePath = path.resolve(process.cwd(), imgDir, fileName);

    checkFilePathAndMkDir(filePath);
    if (!fs.existsSync(filePath)) {
      try {
        const gotStream = got.stream(pic);
        const writeImgStream = fs.createWriteStream(filePath);

        console.log(`- downLoad pic ${fileName}`);

        await pipeline(gotStream, writeImgStream);
        await sleep(5000);
      } catch (error) {
        failResult.push(item);

        if (fs.existsSync(filePath)) {
          fs.rmSync(filePath);
        }
      }
    }
  }

  if (failResult.length) {
    console.log("img downLoad fail:", failResult);
  }
};
```

`src/index.ts` 调用

```tsx
import { Crowller } from "./crowller.js";
import { sleep } from "./utils.js";

const instance = new Crowller();

console.log("========== start bootstrap ========== \n");
await instance.bootstrap();
await sleep(5000);
console.log("bootstrap end \n");
```

## 分析器

目前为止，好像我们的程序能够正常运转了，但是有个问题就是它的耦合性太高了，只能爬取豆瓣 top250 这个网址的内容，我们需要把分析内容这块单独抽离出来，其他的读取 url，写文件，下载图片作为爬虫公用的部分

`doubanAnalyzer.ts`

```tsx
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

// 只要是实现了 Analyzer 接口的,都是一个分析器
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
```

`src/crowller.ts`

要重构一下这个类,让它可以传入参数初始化,并且有默认值

```tsx
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
  private get sourceDataFile(): string {
    return path.resolve(
      process.cwd(),
      this.config.destDir,
      this.config.dataFile
    );
  }
  private get sourceDestImgDir(): string {
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
```

## README

我们可以把数据写入 README 文件

`utils.ts`

```tsx
export const writeReadMeFile = (
  sourceDataFile: string,
  relativeDestImgDir: string
) => {
  const fileName = "README.md";
  const jsonObj = JSON.parse(fs.readFileSync(sourceDataFile, "utf-8"));

  let content = ``;
  let head = `## doubanMovie-Top250`;
  let table = `
|---|---|---|---|---|
|:-:|:-:|:-:|:-:|:-:|
@table
`;

  const arr: any[] = Object.values(jsonObj);
  let tableStr = "";
  for (let i = 0; i < arr.length; i++) {
    const { rank, extname, alt, url } = arr[i];
    tableStr += `|![](${path.join(
      relativeDestImgDir,
      alt + extname
    )}) [${rank} - ${alt}](${url})`;

    if (i % 5 === 4 && i !== 0) {
      tableStr += "|\n";
    }
  }

  content += head;
  table = table.replace("@table", tableStr);
  content += table;

  fs.writeFileSync(fileName, content);
};
```

## 完整代码

::: details crowller
<<< @/back-end/nodejs/code/crowller.ts
:::
::: details doubanAnalyzer
<<< @/back-end/nodejs/code/doubanAnalyzer.ts
:::
::: details utils
<<< @/back-end/nodejs/code/utils.ts
:::
::: details index
<<< @/back-end/nodejs/code/index.ts
:::

## Got 配置问题

- https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
- https://github.com/TypeStrong/ts-node/issues/1007

## 参考地址

- https://movie.douban.com/top250 豆瓣 top250
- https://github.com/sindresorhus/got/blob/HEAD/documentation/quick-start.md
