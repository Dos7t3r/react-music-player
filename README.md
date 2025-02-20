# React music Player

react Player 是一个功能强大的音乐播放器项目，它使用 React 构建，集成了多种功能，如音乐搜索、歌词显示等，为用户提供了一个流畅的音乐播放体验。

### Demo
<a href="https://kzmquc3rxa8u19e66s79.lite.vusercontent.net/" tatget="_blank">https://kzmquc3rxa8u19e66s79.lite.vusercontent.net/</a>

### 项目概述
- **名称**：React Music Player（ RMP )
- **功能**：使用 React 构建，集成了音乐搜索、歌词显示等功能，为用户提供流畅的音乐播放体验。

### 项目结构
项目主要目录结构如下：
```
vue-player-master
├─ tailwind.config.js
├─ .DS_Store
├─ music-player.tsx
├─ components
│  ├─ player-header.tsx
│  ├─ now-playing.tsx
│  ├─ search-dialog.tsx
│  ├─ player-controls.tsx
│  ├─ playlist.tsx
│  ├─ lyrics.tsx
│  ├─ audio-player.tsx
│  ├─ header.tsx
│  ├─ loading-screen.tsx
│  ├─ player-cover.tsx
│  └─ player-lyrics.tsx
├─ utils
│  ├─ lyric.ts
│  ├─ lyric-parser.ts
│  ├─ audio.ts
│  ├─ color.ts
│  └─ color-extractor.ts
└─ types
   └─ music.ts
```

#### 主要目录说明
- **`components` 目录**：包含项目中使用的各种 React 组件。
  - `header.tsx`：项目的头部组件，有搜索功能，用户输入关键词可搜索音乐，结果以列表展示，点击歌曲可播放。
  - `lyrics.tsx`：显示歌词的组件，会根据当前播放的歌词行自动滚动到对应位置，当前歌词有高亮效果。
  - `player-header.tsx`：播放器的头部信息组件，显示当前播放歌曲的标题和艺术家信息。
  - `player-lyrics.tsx`：专门用于在播放器中显示歌词，根据播放进度高亮当前歌词。
- **`utils` 目录**：包含一些工具函数，用于处理歌词解析等任务。
  - `lyric-parser.ts`：包含 `parseLyrics` 函数，用于解析歌词文件（LRC 格式），将歌词文本转换为包含时间戳和歌词内容的数组。
  - `lyric.ts`：也包含一个 `parseLyric` 函数，用于解析歌词。
- **`tailwind.config.js`**：Tailwind CSS 的配置文件，用于定义项目中使用的样式规则、颜色、动画等。
- **`music-player.tsx`**：音乐播放器的主要逻辑文件，包含播放器的状态管理、音频加载、播放控制等功能。

### 主要功能

#### 音乐搜索
在头部组件 `header.tsx` 中，用户可以输入关键词进行音乐搜索。搜索功能会调用外部 API（`https://metingapi.nanorocky.top/`）获取搜索结果，并将结果展示在搜索框下方的列表中。用户点击搜索结果中的歌曲，即可选择播放。

#### 歌词显示
- **歌词解析**：通过 `lyric-parser.ts` 或 `lyric.ts` 中的函数，将 LRC 格式的歌词文件解析为包含时间戳和歌词内容的数组。
- **歌词滚动**：在 `lyrics.tsx` 和 `player-lyrics.tsx` 组件中，会根据当前播放的歌词行，自动滚动到对应的歌词位置，并且当前播放的歌词会有高亮效果，让用户可以清晰地看到当前播放的歌词。

#### 播放器头部信息
`player-header.tsx` 组件会显示当前播放歌曲的标题和艺术家信息，如果没有歌曲在播放，则显示“未在播放”。


### 技术栈
- **React**：用于构建用户界面。
- **Tailwind CSS**：用于样式设计。
- **Fetch API**：用于发起网络请求，获取音乐搜索结果。

### 许可证
本项目使用 [MIT 许可证](https://opensource.org/licenses/MIT)，你可以自由使用、修改和分发本项目的代码。

### 联系信息
如果你有任何问题或建议，可以通过以下方式联系：
- GitHub：[Dos7t3r](https://github.com/dos7t3r)

希望你能喜欢这个音乐播放器项目，如果你发现任何问题或有任何改进建议，欢迎随时提出！

# Special Thanks:
音乐解析用到的api 
- https://github.com/NanoRocky/meting-api
- https://github.com/metowolf/Meting
- https://github.com/metowolf/MetingJS

# Notice
this project was powered by v0dev & ChatGPT
