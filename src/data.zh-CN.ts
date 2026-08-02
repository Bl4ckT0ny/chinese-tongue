import type { AppData } from './types.js';

const data: AppData = {
  lang: 'zh-CN',
  meta: {
    htmlTitle: '普通话发音：舌位示意图'
  },
  ui: {
    eyebrow: '舌位 · 普通话',
    h1: '说普通话时，舌头应该放在哪里',
    sub: '口腔正中矢状面示意图。可在声母、韵尾与儿化之间切换；图中的舌位会随之变化，发鼻音韵尾时软腭会下降，打开通往鼻腔的气流通道。',
    tabInitials: '声母（辅音）',
    tabFinals: '韵尾与儿化',
    diagramTitle: '正中矢状面',
    legend: { tongue: '舌头', contactPoint: '接触点', anatomy: '发音器官' },
    labels: {
      nasalCavity: '鼻腔',
      softPalate: '软腭',
      velumSub: '（腭帆）',
      alveolarRidge: '齿龈',
      hardPalate: '硬腭',
      lips: '嘴唇',
      teeth: '牙齿',
      pharynx: '咽腔'
    },
    hintInitials: '提示：对着镜子依次读 z/c/s、zh/ch/sh/r 和 j/q/x，观察舌尖的位置。关键区别在于舌尖是向前伸、向上翘，还是始终贴近下齿背。',
    hintFinals: '-n 和 -ng 听起来容易混淆，但发音时舌头的位置不同：发 -n 时，舌尖抵住上齿龈；发 -ng 时，舌根抵住软腭。可把手指轻放在下巴下方；发 -ng 时，应能感觉到舌根抬起。'
  },

  initials: [
    { id: 'labial', pinyin: 'b · p · m · f', name: '双唇音与唇齿音', marker: { x: 56, y: 187 }, noContact: false,
      top: [{ x: 112, y: 288 }, { x: 158, y: 279 }, { x: 203, y: 276 }, { x: 248, y: 280 }, { x: 293, y: 289 }, { x: 338, y: 298 }],
      title: '双唇或唇齿参与发音', velum: false,
      body: '这组音主要靠嘴唇完成，舌头不主动参与：发 <b>b、p、m</b> 时双唇闭合；发 <b>f</b> 时下唇接触上齿。舌头保持放松，自然平放在口腔底部。',
      example: 'māma → 妈妈' },
    { id: 'alveolar', pinyin: 'd · t · n · l', name: '舌尖中音', marker: { x: 133, y: 138 }, noContact: false,
      top: [{ x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 }, { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }],
      title: '舌尖抵住上齿龈', velum: false,
      body: '舌尖抬起并接触<b>上齿龈</b>，也就是上门齿后方微微隆起的位置。发 d、t 时接触短促并迅速解除；发 n、l 时，舌尖在该处停留得更久。',
      example: 'nǐ hǎo → 你好' },
    { id: 'dental', pinyin: 'z · c · s', name: '舌尖前音', marker: { x: 110, y: 149 }, noContact: false,
      top: [{ x: 112, y: 154 }, { x: 158, y: 221 }, { x: 205, y: 257 }, { x: 249, y: 274 }, { x: 294, y: 288 }, { x: 338, y: 298 }],
      title: '舌尖靠近上齿背，舌面保持平展', velum: false,
      body: '舌尖靠近<b>上齿背</b>，舌身保持平展，不要明显抬高。舌尖与牙齿之间留出狭窄缝隙，气流从中摩擦而出。不要像发 d、t 那样让舌尖抵住齿龈。',
      example: 'sìshí → 四十' },
    { id: 'retroflex', pinyin: 'zh · ch · sh · r', name: '翘舌音', marker: { x: 158, y: 120 }, noContact: false,
      top: [{ x: 160, y: 118 }, { x: 132, y: 198 }, { x: 202, y: 251 }, { x: 249, y: 273 }, { x: 294, y: 287 }, { x: 338, y: 298 }],
      title: '舌尖上翘并略向后卷', velum: false,
      body: '舌尖向上、向后翘起，接近齿龈后部与硬腭前部的交界处，形成狭窄通道，但不完全闭塞。与舌尖平直、朝前的 z、c、s 相比，这组音的舌尖明显后卷。',
      example: 'zhōngguó → 中国' },
    { id: 'palatal', pinyin: 'j · q · x', name: '舌面音', marker: { x: 226, y: 96 }, noContact: false,
      top: [{ x: 108, y: 226 }, { x: 163, y: 148 }, { x: 204, y: 98 }, { x: 248, y: 96 }, { x: 291, y: 150 }, { x: 334, y: 250 }],
      title: '舌面前部接近硬腭，舌尖保持低位', velum: false,
      body: '起主要作用的不是舌尖，而是<b>舌面前部</b>：它大面积抬向硬腭。舌尖应保持低位，抵住或靠近下齿背。常见错误是把舌尖也抬起来，发成近似 zh、ch、sh 的音。',
      example: 'xièxie → 谢谢' },
    { id: 'velar', pinyin: 'g · k · h', name: '舌根音', marker: { x: 302, y: 114 }, noContact: false,
      top: [{ x: 110, y: 290 }, { x: 152, y: 286 }, { x: 196, y: 274 }, { x: 238, y: 238 }, { x: 285, y: 146 }, { x: 328, y: 200 }],
      title: '舌根抬向软腭', velum: false,
      body: '舌尖不参与发音，放松地停在下齿后方。<b>舌根</b>抬起并接近或接触软腭，发音部位在口腔后部。',
      example: 'gōngzuò → 工作' }
  ],

  finals: [
    { id: 'n', pinyin: '-n', name: '前鼻音韵尾', marker: { x: 133, y: 138 }, noContact: false,
      top: [{ x: 131, y: 143 }, { x: 172, y: 203 }, { x: 210, y: 249 }, { x: 252, y: 272 }, { x: 296, y: 287 }, { x: 338, y: 298 }],
      velum: true,
      title: '舌位同 n，软腭下降',
      body: '舌尖抵住<b>上齿龈</b>，位置与声母 n 相同；同时软腭（腭帆）下降，打开通向鼻腔的气流通道，气流主要从鼻腔排出。这是 an、en、in、uan 等韵母末尾的 -n。',
      example: 'chī <b>fàn</b> → 吃饭，其中 fàn 以 -n 收尾' },
    { id: 'ng', pinyin: '-ng', name: '后鼻音韵尾', marker: { x: 302, y: 114 }, noContact: false,
      top: [{ x: 110, y: 290 }, { x: 152, y: 286 }, { x: 196, y: 274 }, { x: 238, y: 238 }, { x: 285, y: 146 }, { x: 328, y: 200 }],
      velum: true,
      title: '舌位同 g、k，软腭下降',
      body: '舌根抬起并抵住软腭，位置与发 <b>g、k</b> 时相同；与此同时，软腭下降，气流转而通过鼻腔。舌尖不要参与发音。',
      example: 'Zhōngguó → 中国，其中 Zhōng 以 -ng 收尾' },
    { id: 'r', pinyin: '-r（儿化）', name: '儿化韵', marker: { x: 150, y: 190 }, noContact: true,
      top: [{ x: 150, y: 185 }, { x: 138, y: 218 }, { x: 198, y: 256 }, { x: 246, y: 272 }, { x: 292, y: 286 }, { x: 338, y: 298 }],
      velum: false,
      title: '舌尖轻微上翘，不形成接触',
      body: '舌尖像发 zh、ch、sh 时那样向上、向后翘起，但幅度更小，<b>不接触上腭，也不要抬得过高</b>。儿化不是在词尾另加一个独立辅音，而是让前面的韵母带上卷舌色彩；口腔通道仍保持开放。',
      example: 'yīdiǎnr → 一点儿' }
  ]
};

export default data;
