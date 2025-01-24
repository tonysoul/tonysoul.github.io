import { Crowller } from "./crowller.js";
import { DoubanAnalyzer } from "./doubanAnalyzer.js";
import { sleep, writeReadMeFile } from "./utils.js";

async function init() {
  // const url = "http://localhost:3000";
  let n = 0;
  let page = 10;
  let url = `https://movie.douban.com/top250?start=${n}&filter=`;
  const analyzer = new DoubanAnalyzer();
  const instance = new Crowller(url, analyzer, {
    destDir: "data/doubanTop250",
    downLoadImg: true,
  });

  console.log("========== start bootstrap ========== \n");
  for (let i = 0; i < page; i++) {
    n = i * 25;
    url = `https://movie.douban.com/top250?start=${n}&filter=`;
    instance.setUrl = url;

    console.log(`start download ${url}`);

    await instance.bootstrap();
    await sleep(5000);
    console.log("bootstrap end \n");
  }

  writeReadMeFile(instance.sourceDataFile, "data/doubanTop250/imgs/");
}

init();
