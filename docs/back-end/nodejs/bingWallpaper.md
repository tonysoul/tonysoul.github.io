# Bing 壁纸抓取

![](./images/wallpaper.jpg)

微软（巨硬）bing （3.03%）搜索引擎目前的（2023）市场份额已经全球第二了，但是距离 Google （92.9%）第一还有差距

不得不说，bing 搜索引擎的每日推荐的壁纸还是相当不错，既然每天都有一张高清 4k 的壁纸，那我们是不是可以通过 API 接口来获取呢？

肯定的，接下来我们就通过 Bing 的壁纸 API 来获取壁纸

## 技术要点

- Bing 壁纸 API
- markdown 语法
- GitHub Actions
- GitHub Pages

## Bing 壁纸 API

`https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN&uhd=1`
| 参数名称 | 值含义 |
| --- | --- |
| format （非必需） | 返回数据格式 js (一般使用这个，返回 json 格式) xml（返回 xml 格式） |
| idx  (非必需) | 请求图片截止天数，0 今天，最多获取到 7 天前的图片 |
| n （必需） | 1-8  返回请求数量，目前最多一次获取 8 张 |
| mkt  （非必需） | 地区 zh-CN |
|uhd（非必须）| 是否为高清图片 1 |

我们访问这个 API 接口会返回以下数据：

```json
{
  "images": [
    {
      "startdate": "20230506",
      "fullstartdate": "202305061600",
      "enddate": "20230507",
      "url": "/th?id=OHR.SealLaughing_ZH-CN5809094643_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1920&h=1080&rs=1&c=4",
      "urlbase": "/th?id=OHR.SealLaughing_ZH-CN5809094643",
      "copyright": "海豹幼崽，伦迪岛，英国 (© Henley Spiers/Minden Pictures)",
      "copyrightlink": "https://www.bing.com/search?q=%E7%81%B0%E6%B5%B7%E8%B1%B9&form=hpcapt&mkt=zh-cn",
      "title": "什么事这么好笑？",
      "quiz": "/search?q=Bing+homepage+quiz&filters=WQOskey:%22HPQuiz_20230506_SealLaughing%22&FORM=HPQUIZ",
      "wp": true,
      "hsh": "65512ffdbed720000736b6ebea22062c",
      "drk": 1,
      "top": 1,
      "bot": 1,
      "hs": []
    }
  ],
  "tooltips": {
    "loading": "正在加载...",
    "previous": "上一个图像",
    "next": "下一个图像",
    "walle": "此图片不能下载用作壁纸。",
    "walls": "下载今日美图。仅限用作桌面壁纸。"
  }
}
```

### 关于 uhd 参数

如果不加 uhd=1 参数的话，它会返回一张 1920x1080 大小的图片，可以对比一下他们的区别：

```js
// 加uhd=1参数
{
"url": "/th?id=OHR.SealLaughing_ZH-CN5809094643_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1920&h=1080&rs=1&c=4",
}

// 不加uhd=1参数
{
"url": "/th?id=OHR.MorroJable_ZH-CN7382027688_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"
}
```

- 区别在于加了 uhd=1 参数的话，它就返回一张高清的图片，默认尺寸为 1920x1080，图片尺寸可以通过后面的参数控制（&w=1920&h=1080）
- 不加 uhd=1，就返回一个固定大小的图片（1920x1080）

我们既然要获取 4k 高清的图片，当然要加上 uhd=1 参数了，然后通过修改参数来调整图片大小（&w=3840&h=2160）

修改后结果如下：

```js
// 原始高清图片地址
"/th?id=OHR.SealLaughing_ZH-CN5809094643_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1920&h=1080&rs=1&c=4";
// 修改图片尺寸为4k
"/th?id=OHR.SealLaughing_ZH-CN5809094643_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4";
```

### 关于缩略图

我们拿到的图片不可能每张都是 4k 的吧，如果我们要展示图片列表，就需要用到小尺寸的图片了，那我们怎么获得固定尺寸的小图片呢？

同样也是通过修改宽高参数来实现的

```js
// 这是原始数据返回的urlbase地址，我们作一个参数的拼接
"urlbase": "/th?id=OHR.SealLaughing_ZH-CN5809094643",

// 访问高清图片，并设置w为1000，我们就可以拿到1000大小的图片了
'/th?id=OHR.SealLaughing_ZH-CN5809094643_UHD.jpg&w=1000'
```

> 我们访问图片的根路径为: cn.bing.com

## 目录结构

这是一个 node 项目，跑在 node 环境，我们先初始化，并安装依赖

```bash
pnpm init
pnpm add axios moment
```

```bash
- node_modules
- package.json
- picture // 生成数据：根据月份存放抓取的数据
  - 2023-05
    - README.md
- src
  - index.js
- README.md // 生成数据：存放当前月的最新数据
- wallpaper.json // 总数据：（其他文件都是通过这里的数据来生成）
```

package.json

```json
"type": "module"
```

## 具体实现

上面介绍了 API 接口，我们要使用 Node 来请求接口，Node 中发送请求的库有很多，我就使用最熟悉的 axios 来发送 ajax 请求

`src/index.js`

```js
class MyGenerator {
  baseApiUrl = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN&uhd=1`;
  baseBingUrl = "https://cn.bing.com";
  databaseName = "wallpaper.json";

  constructor() {
    this.init();
  }

  async init() {
    const results = await this.fetchData();

    results.forEach((item) => {
      this.writeData2Json(item);
    });

    this.storeData();
  }

  // 1 获取数据，通过API借口获取到的原始数据
  async fetchData() {}

  // 2 写入总数据到,wallpaper.json
  writeData2Json(data) {}

  // 3 通过数据生成README.md文件
  storeData() {}
}

new MyGenerator();
```

目前我们分为 3 步来实现：

1. 通过 API 接口获取原始数据
2. 把原始数据写入到总数据，wallpaper.json（不覆盖）
3. 通过总的数据，过滤条件，来生成按月划分的 README.md 文件

### 1 fetchData

```js
async fetchData() {
  const res = await axios.get(this.baseApiUrl);
  const wallpaperArr = [];
  res.data.images.forEach((item) => {
    const { enddate, url, urlbase, copyright, copyrightlink, title } = item;

    // 替换为4k的图片地址
    const four_k = url
      .replace("&w=1920", "&w=3840")
      .replace("&h=1080", "&h=2160");

    const wallpaper = {
      host: this.baseBingUrl, // host
      thumbil: urlbase + "_UHD.jpg&w=1000", // 缩略图
      enddate,
      url,
      urlbase,
      copyright,
      copyrightlink,
      title,
      "4k": four_k, // 4k的图片地址
    };

    wallpaperArr.push(wallpaper);
  });

  return wallpaperArr;
}
```

### 2 writeData2Json

我们需要用到`fs`和`path`，在头部引入

```js
import fs from "fs";
import path from "path";
import axios from "axios";
import moment from "moment";
// ...
```

```js
writeData2Json(data) {
  try {
    let fileContent = {};
    // 文件路径
    const fileName = path.resolve(process.cwd(), this.databaseName);
    // 判断文件是否存在，存在就获取它原来的内容
    if (fs.existsSync(fileName)) {
      fileContent = JSON.parse(fs.readFileSync(fileName, "utf-8"));
    }
    // 在原有的内容上添加新内容，这是一个json，我们使用 年月 作为key（202305）
    fileContent[data.enddate] = data;
    // 注意要序列化为字符串写入
    fs.writeFileSync(fileName, JSON.stringify(fileContent));
  } catch (error) {}
}
```

### 3 storeData

```js
// 这里用到了3个工具方法
storeData() {
  try {
    const data = this.readWallpaper();
    const { dateKey, monthData } = this.groupByMonth(data);

    this.writeMonthData(dateKey, monthData);
  } catch (error) {}
}
```

```js
// readWallpaper 读取wallpaper.json数据
readWallpaper(){
  try {
    const obj = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), this.databaseName), "utf-8")
    );

    return obj;
  }catch(error){}
}
```

```js
// groupByMonth 获取当前月的数据
groupByMonth(data) {
  // 获取当前年月 202305
  const dateKey = moment().format("YYYYMM");
  // 返回一个年月日期格式 2023-05
  const returned_dateKey = moment().format("YYYY-MM");
  const monthData = [];

  Object.keys(data).forEach((item) => {
    if (item.startsWith(dateKey)) {
      const current = data[item];
      monthData.push({
        date: current.enddate,
        thumbil: current.host + current.thumbil,
        url: current.host + current.url,
        "4k": current.host + current["4k"],
        copyright: current.copyright,
        title: current.title,
      });
    }
  });

  // 排序，根据日期（最新日期在前）
  monthData.sort((a, b) => {
    return Number(b.date) - Number(a.date);
  });

  return {
    dateKey: returned_dateKey,
    monthData,
  };
}
```

```js
// writeMonthData 写入当前月的数据到READMD.md
writeMonthData(dateKey, data) {
  // 这个要生成的路径文件夹名称 picture/2023-05
  const dirName = path.resolve(process.cwd(), `picture/${dateKey}`);
  // 要生成的README.md文件的具体路径 picture/2023-05/README.md
  const fileName = path.resolve(process.cwd(), dirName, "README.md");
  // 根目录README.md文件路径
  const rootFileName = path.resolve(process.cwd(), "README.md");


  // 工具方法，判断生成文件的路径是否存在，如果不存在，新建文件夹
  this.checkAndCreateDir(fileName);

  // // 写入markdown格式的内容
  const fileContent = this.writeMarkDownContent(dateKey, data);

  try {
    // 写入当前月的wallpaper到指定月份文件夹内 picture
    fs.writeFileSync(fileName, fileContent);
    // 写入当前月的wallpaper到根目录README.md
    fs.writeFileSync(rootFileName, fileContent);
  } catch (error) {}
}
```

```js
checkAndCreateDir(fileName) {
  // 如果文件不存在，
  if (!fs.existsSync(fileName)) {
    // picture/2023-05/README.md
    // 获取这个文件的上一级文件路径 picture/2023-05
    const temp = fileName.slice(0, fileName.lastIndexOf(path.sep));

    // 并且文件夹也不存在，就创建文件夹先
    if (!fs.existsSync(temp)) {
      // 递归创建文件夹，无论嵌套了多少层，无论根目录是否存在，都会创建
      fs.mkdirSync(temp, { recursive: true });
    }
  }
}
```

```js
writeMarkDownContent(dateKey, data) {
  // 获取数据的第一项
  const firstItem = data[0];

  let fileContent = `## Bing Wallpaper (${dateKey})
![](${firstItem.thumbil})Today: [${firstItem.copyright}](${firstItem.url})`;

  let tableHd = `
|      |      |      |
| :----: | :----: | :----: |
@table`;

  fileContent += tableHd;

  let tbody = "|";
  for (let i = 0; i < data.length; i++) {
    tbody += `![](${data[i].thumbil})${moment(data[i].date).format(
      "YYYY-MM-DD"
    )} [download 4k](${data[i]["4k"]})|`;

    if (i % 3 === 2 && i !== 0) {
      if (i !== data.length - 1) {
        tbody += "\n|";
      }
    }
  }

  fileContent = fileContent.replace("@table", tbody);

  return fileContent;
}
```

## markdown 语法

我们上面写入文件用到了 markdown 语法，简单介绍一下

### 标题

```md
# h1

## h2

### h3

#### h4

##### h5

###### h6
```

### 链接

```md
[文字](url地址)
[Markdown 语法](https://markdown.com.cn)
```

### 图片

```md
![图片alt](图片链接 "图片title")
![这是图片](/assets/img/philly-magic-garden.jpg "Magic Gardens")
```

### table

```md
| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |
```

## 运行

代码已经完成，我们来跑一下，先写一个运行脚本
package.json

```json
"scripts": {
  "start": "node src/index.js"
}
```

```bash
npm start
```

## GitHub Actions

很好，理想情况下，我们每天手动执行一次脚本，就可以把当天的数据壁纸数据抓取，然后写入文件里，有什么办法能够自动帮我们执行脚本呢？

Github Actions，可以帮我们来完成这一任务

新建文件 `.github/workflows/ci.yml`

```yaml
name: update wallpaper daily # 任务名称
run-name: ${{github.actor}} update wallpaper # 执行脚本的名称
on:
  schedule: # 计划任务
    - cron: "5 0 * * *" # 每天的 0 点 5分 执行

jobs: # 有哪些jobs
  fetchAndWrite: # job名称
    runs-on: ubuntu-latest # 运行在ubuntu系统上
    steps: # 步骤
      - uses: actions/checkout@v3 # 我们使用现有的actions，来检出repo
        with: # token参数哪里获取，在项目的setting里面设置
          token: ${{secrets.GIT_ACTION_TOKEN}}
      - uses: actions/setup-node@v3 # 使用现有的actions，初始化node环境
        with: # 版本为18
          node-version: "18"
      - name: install # 任务名称 install
        run: npm install # 运行 npm install
      - name: build&write # 任务名称 build&write
        run: npm start # 运行 npm start
      - name: Commit and push # 任务名称 提交并推送
        run: |
          git config --global user.name 'lostyu'
          git config --global user.email 'lostyu789@163.com'
          git add wallpaper.json
          git add README.md
          git add picture/*
          git commit -am "update README"
          git push
```

上面文件里面我们使用了两个变量参数

- `github.actor` 系统 github 上下文自带
- `secrets.GIT_ACTION_TOKEN` 需要配置

我们需要先到 `https://github.com/settings/tokens`，生成 token，然后再到项目 `https://github.com/<yourName>/<yourRepo>/settings/secrets/actions`里面添加生成的 token

我们把代码提交到 github 仓库，它就会根据定时任务，每天在 0 点 5 分执行脚本

### cron

关于定时任务的时间格式写法

```bash
分 时 天 月 周
*  *  *  *  *

分(0-59)
时(0-23)
天(1-31)
月(1-12)
周(0-6)

5 0 * * *
```

```bash
// 任意值
15 * * * * 在每天每小时的每个第 15 分钟运行

// ，间隔
2,10 4,5 * * * 在每天第 4 和第 5 小时的第 2 和第 10 分钟运行。

// 范围值
30 4-6 * * * 在第 4、5 和 6 小时的第 30 分钟运行。

// 步骤值（20分钟开始到59，每15分钟执行一次）
20/15 * * * * 在第 20 分钟到第 59 分钟每隔 15 分钟运行一次（第 20、35 和 50 分钟）。
```

## GitHub Pages

TODO

数据有了，生成了 README.md 文件，我们还可以进一步通过 Github Pages 生成一个静态的 HTML 页面来浏览我们抓取的图片

## 总结

我们做了些什么，使用 Bing 壁纸 API，来获取每日高清壁纸，把它存入本地 json 文件，我们再通过数据生成，按月生成抓取来的图片，写入到 README.md，然后通过 Github Actions，来完成定时执行任务

## 参考资料

- https://markdown.com.cn/basic-syntax/
- https://docs.github.com/zh/actions
- https://docs.github.com/zh/pages
- https://crontab.guru/examples.html
- https://bing.ioliu.cn/
- https://bing.wdbyte.com/
