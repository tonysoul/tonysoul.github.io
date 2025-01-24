# Node Http 请求库 Got

## Got

got 是什么？一个基于 Node 的 http 请求库

市面上这么多的库，像我们常用的 axios，superagent，request（现已废弃，不再更新，[详细](https://github.com/request/request/issues/3142)）

## 同类比较

|                       | got | node-fetch   | ky       | axios        | superagent |
| --------------------- | --- | ------------ | -------- | ------------ | ---------- |
| HTTP/2 support        | ✔️¹ | ❌           | ❌       | ❌           | ✔️\*\*     |
| Browser support       | ❌  | ✔️\*         | ✔️       | ✔️           | ✔️         |
| Promise API           | ✔️  | ✔️           | ✔️       | ✔️           | ✔️         |
| Stream API            | ✔️  | Node.js only | ❌       | ❌           | ✔️         |
| Pagination API        | ✔️  | ❌           | ❌       | ❌           | ❌         |
| Request cancelation   | ✔️  | ✔️           | ✔️       | ✔️           | ✔️         |
| RFC compliant caching | ✔️  | ❌           | ❌       | ❌           | ❌         |
| Cookies (out-of-box)  | ✔️  | ❌           | ❌       | ❌           | ❌         |
| Follows redirects     | ✔️  | ✔️           | ✔️       | ✔️           | ✔️         |
| Retries on failure    | ✔️  | ❌           | ✔️       | ❌           | ✔️         |
| Progress events       | ✔️  | ❌           | ✔️\*\*\* | Browser only | ✔️         |
| Handles gzip/deflate  | ✔️  | ✔️           | ✔️       | ✔️           | ✔️         |
| Advanced timeouts     | ✔️  | ❌           | ❌       | ❌           | ❌         |
| Timings               | ✔️  | ❌           | ❌       | ❌           | ❌         |
| Errors with metadata  | ✔️  | ❌           | ✔️       | ✔️           | ❌         |
| JSON mode             | ✔️  | ✔️           | ✔️       | ✔️           | ✔️         |
| Custom defaults       | ✔️  | ❌           | ✔️       | ✔️           | ❌         |
| Composable            | ✔️  | ❌           | ❌       | ❌           | ✔️         |
| Hooks                 | ✔️  | ❌           | ✔️       | ✔️           | ❌         |

以上作为参考，选择你自己需要的那一款，这里我们选择 got，作为学习使用

## Typescript 项目配置

安装依赖

```tsx
pnpm add got
pnpm add ts-node -D
```

package.json

```tsx
"type": "module",
"scripts": {
  "test": "ts-node --esm src/index.ts"
},
```

初始化 ts 配置文件

```tsx
tsc --init
```

tsconfig.json

```tsx
"compilerOptions": {
	"target": "ES2017",
	"module": "Node16",
	"esModuleInterop": true,
	"forceConsistentCasingInFileNames": true,
	"strict": true,
	"skipLibCheck": true
}
```

## 基础用法

### GET

```ts
import got from "got";

const url = "https://httpbin.org/anything";

// GET
const res = got(url); // 返回一个Promise<Response>
console.log(res);

// 如果res的body是一个json，我们可以直接返回
const data = got(url).json();
```

返回的 json 数据库

```json
{
  "args": {},
  "data": "",
  "files": {},
  "form": {},
  "headers": {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Host": "httpbin.org",
    "User-Agent": "got (https://github.com/sindresorhus/got)",
    "X-Amzn-Trace-Id": "Root=1-646c7e58-7969646d74ef0b116ec0dbfb"
  },
  "json": null,
  "method": "GET",
  "origin": "14.106.204.51",
  "url": "https://httpbin.org/anything"
}
```

我们还有几种数据类型格式化可以使用

- json()
- text()
- buffer()

### 传入 options

```ts
const options: OptionsOfTextResponseBody = {
  headers: {
    "Custom-Header": "Quick start",
  },
  timeout: {
    send: 3500,
  },
};
const data = await got(url, options).json();
console.log(data);
```

### POST

```ts
// POST
const options = {
  json: {
    documentName: "Quick start",
  },
};
// post body 数据通过 json:{} 来传入
const data = await got.post(url, options).json();
console.log(data);
```

### Stream

```ts
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

// Stream
const options = {
  json: {
    documentName: "Quick Start",
  },
};

const gotStream = got.stream.post(url, options);
const outStream = fs.createWriteStream("anything.json");

try {
  await pipeline(gotStream, outStream);
} catch (error) {
  console.error(error);
}
```

### 重用 Options

```ts
import got, { OptionsInit } from "got";

const options: OptionsInit = {
  prefixUrl: "https://httpbin.org",
  headers: {
    Authorization: "my token",
  },
};
const client = got.extend(options);
export default client;
```

注意使用的时候，url 地址不能以 `/` 开头

```ts
import client from "./client.js";

// const url = '/aaaa'; 错误
const url = "anything";
const data = await client(url).json();
```

### 常用的 options

```ts
const data = await got(url, {
  // 请求url前缀
  prefixUrl: "https://httpbin.org",
  // 查询参数
  searchParams: {
    aa: 123,
    bb: "hello",
  },
  // 头
  headers: {
    custom: "xxx",
  },
  // 请求方法
  method: "post",
  // json body
  json: {
    name: "tony",
  },
  // form body 转换，使用URLSearchParams
  // 格式为 'hello=world'
  form: {
    username: "jay",
    age: 11,
  },
}).json();
console.log(data);
```

### 错误处理

可以使用 promise 的方式，也可以使用 async await 的方式

```ts
try {
  const res = await got.get("https://httpbin.org/status/404");
  console.log(res.url);
} catch (error: any) {
  console.error(error.options);
}
```

```ts
const stream = got
  .stream("https://httpbin.org/status/404")
  .once("error", (error) => {
    console.log(error.message);
    console.log(error.name);
    console.log(error.stack);
  });
```

## Promise API

got 方法返回一个 promise

```ts
// got(url:string | URL, options?:OptionsInit, defaults?:Options)

const data = await got(url, {
  headers: {
    foo: "bar",
  },
}).json();

console.log(data);
```

```ts
// got(options:OptionsInit)

const data2 = await got({
  url,
  headers: {
    name: "tony",
  },
}).json();
console.log(data2);
```

返回的 promise 有以下方法：

```ts
promise.json<T>()
promise.text()
promise.buffer()
promise.cancel(reason?: string)
```

属性：

```ts
promise.isCanceled;
```

事件：

```ts
promise.on(event, handler);
promise.off(event, handler);
```

详细内容参考文档：

- https://github.com/sindresorhus/got/blob/main/documentation/1-promise.md

### 监听事件

```ts
const readStrem = fs.createReadStream("a.txt");
const gotPost = got.post(url, {
  body: readStrem,
});

const eventListener = (progress: Progress) => {
  console.log(progress);
};

gotPost.on("uploadProgress", eventListener);

setTimeout(() => {
  gotPost.off("uploadProgress", eventListener);
}, 500);

const res = await gotPost.json();
console.log(res);
```

## Options

- 默认情况下，got 在失败时会重试，如果要禁用：options.retry to {limit:0}
- 合并行为，如果重新设置 option，在默认情况下，再次设置它将用深度克隆替换它。

```ts
const options = new Options({
  prefixUrl: "https://httpbin.org",
  headers: {
    foo: "bar",
  },
});

options.headers.foo = "hello";

// 如果options为Options对象， 需要把options，作为第三个参数传入got
const data = await got(undefined, undefined, options);
console.log(data);
```

```ts
// 如果options为普通对象，可以作为第二个参数传入
// 这里的options2类型可以使用 OptionsInit 类型
const options2 = {
  prefixUrl: "https://httpbin.org",
  headers: {
    foo: "bar",
    name: "123",
  },
};
options2.headers.name = "tony";
const data2 = await got("anything", options2).json();
console.log(data2);
```

- 区别，使用构造函数的方式创建 options，它会检测错误
- 使用普通对象，只有在执行的时候报错

### url

- 地址必须带上协议
- 如果有参选参数，通过`searchParams` 传入

```ts
await got("https://httpbin.org/anything", { searchParams: { query: "a b" } }); //=> ?query=a+b
```

### searchParams

```ts
const response = await got("https://httpbin.org/anything", {
  searchParams: {
    hello: "world",
    foo: 123,
  },
}).json();
```

### prefixUrl

```ts
const instance = got.extend({ prefixUrl: "https://httpbin.org" });
await instance("anything");
```

- method
- headers
- isStream
- body
- json
- form

更多内容参考文档：

https://github.com/sindresorhus/got/blob/main/documentation/2-options.md

## Stream API

```ts
// got.stream(url, options, defaults)
// got(url, {...options, isStream:true}, defaults)
// return a new instance of Request
```

把响应作为流写入到文件

```ts
try {
  await pipeline(
    got.stream("https://sindresorhus.com"),
    fs.createWriteStream("index.html")
  );
} catch (error) {}
```

通过流 post 数据到 url

```ts
try {
  await pipeline(
    fs.createReadStream("index.html"),
    got.stream.post("https://sindresorhus.com"),
    new stream.PassThrough()
  );
} catch (error) {}
```

- POST, PUT, PATCH, or DELETE without a request body
- 没有 body 的情况下，需要显示的指定一个空 body

```ts
try {
  await pipeline(
    got.stream.post("https://sindresorhus.com", { body: "" }),
    new stream.PassThrough()
  );
} catch (error) {}

// 避免使用 from.pipe(to) 因为它不转发错误。
```

### Events

- stream.on
  - **`downloadProgress`**
  - **`uploadProgress`**
  - **`retry`**
  - **`redirect`**

## Errors

```ts
import got from "got";

const instance = got.extend({
  hooks: {
    beforeError: [
      (error) => {
        console.log(error);

        return error;
      },
    ],
  },
});

try {
  await instance("https://httpbin.org/6655/fsdf", {
    timeout: {
      request: 5000,
    },
    retry: {
      limit: 0,
    },
  });
} catch (error) {
  // console.error(error);
}
```

## Hooks

hooks 钩子有以下几种使用场景

- init: InitHook[];
- beforeRequest: BeforeRequestHook[];
- beforeRedirect: BeforeRedirectHook[];
- beforeError: BeforeErrorHook[];
- beforeRetry: BeforeRetryHook[];
- afterResponse: AfterResponseHook[];

```ts
const instance = got.extend({
  hooks: {
    init: [
      (plain) => {
        if (plain.followRedirect) {
          console.log(plain);
        }
      },
    ],
  },
});

const response = instance("https://httpbin.org/anything", {
  followRedirect: true,
});
```

加入我们想在请求发送前做一些事

```ts
const instance = got.extend({
  hooks: {
    beforeRequest: [
      (options) => {
        // 每次请求前都把token带上
        if (!options.context || !options.context.token) {
          throw new Error("token is required");
        }

        options.headers = Object.assign(options.headers, {
          token: options.context.token,
        });

        // console.log(options.headers);
      },
    ],
  },
});

const data = await instance("https://httpbin.org/anything", {
  context: {
    username: "tony",
    token: "123",
  },
}).json();
console.log(data);
```

## Instances

如果你需要多个实例，并且可以单独配置不同的 options

```ts
import got from "got";

// client1
const client = got.extend({
  prefixUrl: "https://httpbin.org",
  headers: {
    "x-foo": "bar",
  },
});

const { headers } = await client.get("anything").json<{ headers: {} }>();

console.log(headers);

// client2
const client2 = client.extend({});
```

## 参考资料

- https://github.com/sindresorhus/got#readme
