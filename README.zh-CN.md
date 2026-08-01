# 普通话舌位示意图

*[English](README.md) · [Русский](README.ru.md)*

这是一个交互式口腔正中矢状面示意图，用来展示普通话声母、鼻音韵尾和儿化的舌位、接触位置及软腭状态。

项目提供三个语言版本：

- 简体中文：`zh-CN.html`
- 俄语：`ru.html`
- 英语：`en.html`

项目使用 TypeScript 编写。界面文字和发音说明分别保存在各语言的数据文件中，渲染与几何计算由所有语言共用。

## 项目结构

```text
index.html                 → GitHub Pages 根入口，跳转到俄语页面
ru.html                    → 俄语页面
en.html                    → 英语页面
zh-CN.html                 → 简体中文页面
assets/
  style.css                → 各语言共用样式
src/
  types.ts                 → Point、SoundGroup、AppData 等共享类型
  geometry.ts              → 舌形与软腭的几何计算，不依赖 DOM
  engine.ts                → 渲染与动画引擎，不包含界面文字
  data.ru.ts               → 俄语文字与发音数据
  data.en.ts               → 英语文字与发音数据
  data.zh-CN.ts            → 简体中文文字与发音数据
  main.ru.ts               → 俄语入口
  main.en.ts               → 英语入口
  main.zh-CN.ts            → 简体中文入口
tests/
  unit/                    → 几何与数据一致性测试
  e2e/                     → Playwright 浏览器测试
dist/                      → TypeScript 编译结果，不提交到仓库
.github/workflows/         → 代码检查、测试与 GitHub Pages 部署流程
```

`engine.ts` 不包含面向用户的文字。所有本地化内容都放在 `data.*.ts` 中，并由 `AppData` 接口统一检查类型。

## 中文术语

简体中文版本采用普通话语音教学中常见的术语：

- 声母、韵尾、儿化
- 双唇音、唇齿音
- 舌尖前音、舌尖中音、翘舌音
- 舌面音、舌根音
- 前鼻音韵尾、后鼻音韵尾、儿化韵
- 齿龈、硬腭、软腭（腭帆）、咽腔

说明文字侧重实际发音部位和舌位变化，不按英文术语逐字翻译。拼音字母只用于标示音类，不能代替对发音动作的说明。

## 添加或修改发音组

`initials` 和 `finals` 中的每个条目都采用以下结构：

```ts
{
  id: 'alveolar',
  pinyin: 'd · t · n · l',
  name: '舌尖中音',
  marker: { x: 133, y: 138 },
  noContact: false,
  velum: false,
  top: [
    { x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 },
    { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }
  ],
  title: '舌尖抵住上齿龈',
  body: '……',
  example: 'nǐ hǎo → 你好'
}
```

坐标使用 SVG 的 `viewBox="0 0 640 440"` 坐标系。`top` 必须包含六个控制点，依次表示舌尖、舌叶、舌面前部、舌面中部、舌面后部和舌根。

修改某一种语言的数据时，还应检查其他语言文件，确保各语言使用相同的发音组 ID、几何坐标和软腭状态。

## 本地运行

需要 Node.js **^22.22.0 或 >=24.8.0**。

```bash
npm install
npm run build
python3 -m http.server 8000
```

然后在浏览器中打开：

```text
http://localhost:8000/zh-CN.html
```

浏览器通常会阻止通过 `file://` 直接加载 ES 模块，因此需要使用本地 HTTP 服务器。

开发时可以启用持续编译：

```bash
npx tsc --watch
```

## 代码检查

```bash
npm run typecheck
npm run lint:ts
npm run lint:html
npm run lint
```

GitHub Actions 会在每次推送和 pull request 时自动运行相同的检查。

## 测试

```bash
npm run build
npm run test:unit
npx playwright install --with-deps chromium
npm run test:e2e
npm test
```

单元测试会检查舌形几何、坐标范围、各语言数据结构，以及鼻音和儿化的关键属性。端到端测试会在 Chromium 中检查页面加载、按钮交互、鼻腔气流提示和解剖标签布局。

## GitHub Pages 部署

代码推送到 `main` 后，`.github/workflows/deploy.yml` 会自动执行类型检查、单元测试、构建和发布。

首次部署时，请在仓库设置中选择：

```text
Settings → Pages → Source → GitHub Actions
```

部署后的简体中文页面地址为：

```text
https://<用户名>.github.io/<仓库名>/zh-CN.html
```

## 贡献

提交修改前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。新增或调整中文语音术语时，请优先采用现代汉语语音学和普通话教学中通行的说法，并从学习者的角度说明发音动作，避免生硬直译。

## 许可证

本项目采用 [MIT License](LICENSE)。

## 致谢

特别感谢 ZhuHeng 朱恒 `<zhuheng0627@qq.com>` 对项目内容的核验。
