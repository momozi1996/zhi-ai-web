# 集结31位顶级导演｜一个开源“多agent导演智囊团”的诞生 ：张艺谋、周星驰、王家卫、诺兰、卡梅隆、宫崎骏、朴赞郁...    (附GitHub)

> 公众号：momo子讲AI ｜ 发布日期：2026-05-11 ｜ 原文：https://mp.weixin.qq.com/s/0AE-09BgvquuBPx8K7uXrA

---

**🎬 我把31位顶级导演装进了集结号：一个开源“ 多agent 导演智囊团”的诞生 🎬**

这是我基于 Multi-Agent （clawteam）框架搭建的 DirectorAgents，尝试用 31 位大师的视野，重构叙事逻辑。

![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicAXf0ZVkVfN4YZwn8QVFce2jia4uzR0o7vexskXqoK8iaQNH1F42I1ELdbzlQmZNYHl4TIpo5Al7iaaPX3mXMiciaK8o0pcsFMeWlI8/640?wx_fmt=png&from=appmsg)

DirectorAgents，开源“多agent导演智囊团”包含 ：张艺谋、陈凯歌、姜文、贾樟柯、王家卫、徐克、杜琪峰、吴宇森、周星驰、陈可辛、杨德昌、侯孝贤、李安15位华语导演，斯皮尔伯格、诺兰、昆汀、科波拉、卡梅隆、大卫·芬奇、伍迪·艾伦**8位好莱坞导演，**伯格曼、费里尼、安东尼奥尼、黑泽明、小津安二郎、宫崎骏、是枝裕和、奉俊昊、朴赞郁、布努埃尔、塔可夫斯基**11位欧亚艺术导演，共31位世界顶级导演。

![](https://mmbiz.qpic.cn/sz_mmbiz_png/OVWJaEKibWuRQFczPUmt4Kic8HBVj4yBOXiaibM29A1cSFFKX0p4M6PibrNGdnYh6ibYjic2EbUF8LkFBGMicYDp7LHIBQy1UaDfNrTl4lPLEe8psbs/640?from=appmsg)

![](https://mmbiz.qpic.cn/mmbiz_png/QArOMrfy7iczic0AFvUpHwVZo54RLm1lYqybKtPeABTF8h9qvQ4QYwiao7LQuIstUqngf7NCoW2LmWBgdZATZnibMo9vIa0kb8svTPtx8xjiciaiaQ/640?from=appmsg)

---

### 引言

在这个 AI 浪潮翻涌的时代，我们见证了文字生成、图片生成，乃至视频生成的爆发。

但作为一名长期身处 AI 行业的局中人（同时也作为一名内容创作者），我一直在思考一个问题：**当生成的门槛降到极低，我们真正缺失的是什么？**

是**审美**，是**品味**，是那种能穿透屏幕的**叙事张力**。

AI 懂概率，但它不懂什么叫“王家卫式的暧昧”，不懂“诺兰式的时空折叠”，更不懂“姜文式的荒诞浪漫”。

于是，为了解决这个“灵魂难题”，我手搓了一个多智能体（Multi-Agent）创意协作系统——**DirectorAgents 导演智囊团**，我把它打包放在了 GitHub 上，**完全开源**。

今天，我决定把它，送给每一位热爱讲故事的人。

**项目地址：**

`https://github.com/momozi1996/DirectorAgents`

---

#### 🎬 为什么是“导演”？

在电影工业中，导演不仅仅是现场的指挥者，更是整部作品的**审美总监**和**逻辑架构师**。

我选取的这 31 位世界级导演，涵盖了从东方禅意到好莱坞高概念，从暴力美学到社会学凝视的多元风格。

在 **DirectorAgents** 中，我尝试将这些大师的风格进行了结构化的解构：

- **王家卫**的感官诗学与时间变奏；

- **克里斯托弗·诺兰**的高概念时空逻辑；

- **姜文**的荒诞天才与魔幻现实主义；

- **小津安二郎**的宁静禅意与日常凝视。

这不仅仅是简单的 Prompt 堆砌，而是深度提取了他们的**视觉语言**（光影、构图）、**叙事手法**（节奏、视角）以及背后的**艺术哲学**。

## 📚 理论基础

### 多智能体系统（Multi-Agent Systems）

- 基于DirectorAgents框架

- 参考Mixture of Agents (MoA) 研究

- 顺序链、辩论投票、主席团三种协作模式

电影理论基础

- **作者论**（Auteur Theory）：导演是电影的主要创作者

- **类型片理论**：类型惯例与创新突破

- **叙事学**：结构主义叙事分析

- **电影符号学**：影像语言的编码解码

### 导演风格分析

- 核心创作思想提取

- 视觉签名识别

- 叙事手法归纳

- 人物塑造特点

---

#### 🤖 三种模式：像“智囊团”一样思考

为了让这些 AI Agent 不仅仅是孤立的模版，我为系统设计了三种协作逻辑，模拟现实中人类顶尖智囊团的决策过程：

1. **顺序链模式 (Sequential Chain)**：模拟创作接力。例如，让张艺谋先定下色彩基调，再由李安注入细腻的人文关怀，最后由诺兰把关叙事结构。

2. **辩论投票模式 (Debate & Voting)**：针对一个创意点，让风格迥异的导演进行“灵魂辩论”。在不同艺术观念的碰撞中，往往能发现最独特的叙事切口。

3. **主席团/专家模式 (Presidium)**：引入跨领域专家与导演共同评审。这对于需要在艺术表达与商业执行之间寻找平衡的复杂项目尤为有效。

系统架构 | 使用场景 | 高级功能

---

#### 📝 使用

#### 触发词：激活系统后，使用以下触发词：

- `导演智囊团 - 启动完整系统`

- `DirectorAgents - 快捷调用`

- `多导演协作 - 强调协作模式`

- `剧本创作- 聚焦剧本场景`

- `影像风格- 聚焦视觉设计`

#### 使用示例

#### 示例1：科幻悬疑片

```
用户：我想创作一部关于时间循环的科幻悬疑片，需要一个既有视觉冲击力又有哲学深度的开场。系统：📌 匹配导演组合：  🎬 克里斯托弗·诺兰 - 时空叙事专家  🎬 大卫·芬奇 - 悬疑氛围大师  🎬 詹姆斯·卡梅隆 - 视觉奇观先驱🎭 协作模式：顺序链📝 创意提案：【诺兰视角】时间循环的核心是"选择"与"后果"的永恒纠缠...【大卫·芬奇视角】色调应该是被污染的青绿色与暗橙色...【卡梅隆视角】时间循环的视觉化需要技术创新...🎯 最终方案：场景设定：凌晨3:33，废弃钟楼内部视觉方案：IMAX画幅开场，青绿色主调，旋转走廊实拍叙事结构：倒叙开场，交叉剪辑展示循环片段...
```

**示例2：都市爱情片**

```
用户：写一个关于错过与遗憾的都市爱情故事，要有文艺气息。系统：📌 匹配导演组合：  🎬 王家卫 - 感官诗学  🎬 侯孝贤 - 真实长镜  🎬 是枝裕和 - 日常温情🎭 协作模式：主席团（王家卫统筹）📝 创意提案：【王家卫视角】时间是均匀的噪音，掩盖了城市的每一次心跳...【侯孝贤视角】用固定长镜头拍摄，让观众自己感受时间流逝...【是枝裕和视角】开场应该是一个普通的家庭场景...🎯 最终方案：雨夜便利店，霓虹闪烁，两人坐在吧台两侧却始终错位...
```

## 🤖 协作模式详解

## ![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicC2R9bglbiclj7iaz6HaDZfWtxWFVLsbNl7aNNBjp3CbXM4PJgllqCmQcpIJicAI8Cm3G0HlSQKcX033Rh8zpfsZxfjngJfH1G910/640?wx_fmt=png&from=appmsg)

模式A：顺序链（Sequential Chain）

## 适用场景：创意接力，风格叠加

**流程**：

1. 视觉导演定基调（色彩、光影、构图）

2. 叙事导演改结构（节奏、时间线、视角）

3. 对白导演润色台词（语言风格、潜台词）

4. 整合导演最终把关

**示例**：张艺谋（视觉） → 王家卫（叙事） → 昆汀（对白）

### ![](https://mmbiz.qpic.cn/sz_mmbiz_png/iazCrKuBFsicAKoAVxfPWATka8rzDiazjxmLV0Qxx2PuiafSqXd5L45yicSsVTejIgk6XeA3yibLNlhRrepbclJiaQwAZXEbu6GosvLSNyII40PVvA/640?wx_fmt=png&from=appmsg)

模式B：辩论投票（Debate & Voting）

### 适用场景：方案比选，集思广益

**流程**：

1. 中央Agent收集创意需求

2. 3-5位导演分别提出方案

3. 导演间辩论、质疑、补充

4. 投票选出最佳方案或融合方案

5. 输出最终创意决策

**示例**：奉俊昊 vs 朴赞郁 vs 杜琪峰 就犯罪片结局展开辩论

### ![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicAdg686LliaLsBgDsCyFpn3liaFHcndwVVVXxFDkZ2ict6ic2YlW0oYwGaicLic4IXwC1gWiciapHDn0PCztmSn4BXS50lUZnKGjjDs8Gc/640?wx_fmt=png&from=appmsg)

模式C：主席团/专家混合（MoA）

### 适用场景：复杂决策，首席统筹

**流程**：

1. 设定"首席导演"（如李安或斯皮尔伯格）

2. 首席听取各领域专家导演建议

3. 首席整合形成最终方案

4. 输出带有首席风格的融合创意

**示例**：李安（首席）+ 诺兰（科幻）+ 奉俊昊（阶级）+ 是枝裕和（家庭）

---

#### 📝 核心价值：从“生成”到“塑造”

我并不希望这个项目只是另一个“好玩的工具”。

它的核心价值在于**辅助创作流程的专业化迭代**：

- **剧本创作支持**：从模糊的概念出发，利用大师的视角对台词和情节进行深度雕琢。

- **影像风格设计**：提供关于色彩、构图、甚至具体镜头运动的专业建议，为分镜设计提供美学指导。

- **叙事结构优化**：利用 AI 模拟大师对时间线和节奏的把控，打破平铺直叙。

---

#### 💡 开发者手记：代码中的美学复活

建立 **DirectorAgents** 的初衷，是希望通过数字媒介，让那些伟大的生命意识和美学遗产在算法中得到延续。

作为开发者，我深知底层模型（如openclaw/Hermes agent）的能力上限，但通过合理的 Agent 编排，我们可以让 AI 在垂直领域展现出惊人的“品味”。

这个项目不仅是一份代码，更是一份我写给电影艺术和开源社区的情书。我希望它能帮助专业创作者突破思维定式，也能让每一个普通人，在 AI 的辅助下，拥有属于自己的“大师级创作顾问”。

---

#### 🚀 快速开启你的“导演室”

目前项目已经完全开源在 GitHub。你可以通过 `OpenClaw/claw类产品/agent类产品` 技能包直接安装，也可以手动 clone 部署。

**项目地址：**

`https://github.com/momozi1996/DirectorAgents`

（可以通过github访问项目。如果这个项目对你有启发，欢迎点亮一颗 **Star** ✨，或者在仓库中提交你的建议。）

---

**写在最后：**

**
**

代码是冰冷的，但内容和审美是有温度的。

希望这个“智囊团”，能陪你在 🎬 光影的缝隙里，发现更多可能。

---

**[全网最全、持续更新的 AI 人格蒸馏 Skill 合集｜ 自我蒸馏、职场关系、名人思维、情感陪伴、玄学术数、二次元角色、SBTI测试等7大场景](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485406&idx=1&sn=65cf04a4fb068142f205406f9e44dc60&scene=21#wechat_redirect)**

**[我手搓了一个「多Agent智囊团」，打包了20位天涯“远古大神”，并连夜开源了它～【附Github地址】](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485468&idx=1&sn=406283457c0673709425d6b2590a6e13&scene=21#wechat_redirect)**

**[12 位 AI自媒体顶流大V的skill仓库：github开源（秋芝、卡兹克、赛文乔伊、赛博禅心、量子位、新智元、极客公园、硅星人、机器之心）](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485457&idx=1&sn=2e00689b3bfb993213e6d84723af12e4&scene=21#wechat_redirect)**

[我蒸馏了永乐大典.skill， AI让中华文明瑰宝永生 （附带原著） | AI 也可以让文明永存](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485421&idx=1&sn=0eeed13025fe3944d532d29489e68aef&scene=21#wechat_redirect)

[gpt image 2 生成连续的多个游戏界面，OpenAI这次真的封神了！](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485432&idx=1&sn=767cb94b2baea2a0da40d1f5888af6d6&scene=21#wechat_redirect)
