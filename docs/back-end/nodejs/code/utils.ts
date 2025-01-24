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

export const downLoadImg = async (
  imgDir: string,
  data: DownLoadImgItem[],
  timeout = 5000
) => {
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
        await sleep(timeout);
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
