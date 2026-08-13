# 我手搓了一个「多Agent智囊团」，打包了20位天涯“远古大神”，并连夜开源了它～【附Github地址】

> 公众号：momo子讲AI ｜ 发布日期：2026-05-06 ｜ 原文：https://mp.weixin.qq.com/s/86ajDWbXnZGDKXs29jQDBg

---

“一个人思考，是智慧；二十个人思考，是智囊团。”

作为一个长期和 AI 打交道的人，我做了一次疯狂的、有意义的“数字复古”。

我手搓了一个「天涯神贴大神 · 多 Agent 决策系统」,使用多 Agent 架构，打包提取了 20 位天涯传奇大神（大鹏金翅明王、KKNDME、当年明月等）的思想内核，将这些沉淀了深刻洞察的“远古互联网大脑”封装成了一个为你并行分析、综合决策的多agent 智囊团系统。

这是一个不再迎合流量、只讲底层规律的开源项目。（底层规律或许更接近残酷的真相）

我今天在github开源了它：

🔗 **GitHub 仓库地址：**

https://github.com/momozi1996/tianya-skills

> ![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicB9kKy1cM5cwdLNt5ibKbhjud0RJmbzexK79qtSch8x0nTUbTkeibsJELhPo3qtWyiaf2GJgcjE0QMJ3bxKzn1Keev1UibDtRh0tMU/640?wx_fmt=png&from=appmsg)

>

> 面对人生的十字路口，你是希望听通用 AI 讲放之四海而皆准的套话，还是想听 20 个在社会底层逻辑里摸爬滚打过的顶级大脑，为你来一场真实残酷的局势研判？

>

> 我选择后者。

>

> ![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicB89acG6Kf2JNZWcIT9LUpoYPia7IHmmiaMfIcvBmoB8ia0mg40Qdc15vvyXNngor7qQHhmdv7ksRVoxFgPnbV9FOCmZJicfESExLo/640?wx_fmt=png&from=appmsg)

---

### 我为什么要做这个？

### 对抗同质化，还原多维真相

我构建这个系统，并非是为了生成爆款文案或闲聊，它的核心目标非常纯粹：**提供复杂决策支持。**

真实世界的决策往往没有非黑即白的答案。

当你抛出一个问题（例如：“我现在该不该裸辞？”），我不希望系统给你灌鸡汤，我希望它能为你提供一个**立体的决策坐标系**：

- **权谋视角**的大神会帮你分析这背后的资源盘整与阶层跃迁的真实概率；

- **经济视角**的大神会为你冷酷地计算重置成本和未来资产的抗风险能力；

- **都市现实视角**的大神则会无情地撕开理想主义的面纱，告诉你即将面临的生存底线。

它不迎合流量，不制造情绪，只负责从不同的专业切面，还原规律与事实。

---

为什么是天涯大神？

在信息碎片化、情绪化表达泛滥的今天，我们每天都在被各种短平快的“结论”裹挟。

面对职业选择、资产配置、人际博弈等复杂的人生决策时，通用的 AI 往往只能给出四平八稳、甚至“绝对正确但毫无用处”的套话。

我们需要的，不是一个万能的端水大师，而是能够在特定领域一针见血、直击本质的**专业视角**。

熟悉中国互联网早期时代的人，一定对“天涯社区”的黄金年代记忆犹新。那里曾诞生过无数影响深远的“神贴”与“大神”：精准预判楼市走向的 KKNDME、将权力结构剖析得入木三分的大鹏金翅明王、用冷峻笔触刻画都市现实的慕容雪村……

**如果我们能用如今的 AI 技术，将这些沉淀了深刻洞察的“互联网远古大脑”提取出来，让它们并行运转，为你解答现实生活中的难题，会发生什么？**

这就是我最近开源的 GitHub 项目——「天涯神贴大神智囊团 · 多Agent决策系统」的核心初衷。

---

### 一、核心价值：对抗信息同质化，提供“多维切面”

这个系统并非用来生成爆款文案或闲聊，它的核心价值在于**复杂决策支持**。

真实世界的决策往往没有标准答案。当你抛出一个问题（例如：“我现在该不该辞去体制内的工作？”），系统不会给你一个简单的“是”或“否”，而是提供一个**立体的决策坐标系**：

- **权谋视角**会帮你分析这背后的权力让渡与阶层固化风险；

- **经济视角**会为你计算重置成本和未来资产的抗风险能力；

- **都市现实视角**则会无情地撕开理想主义的面纱，告诉你即将面临的生存压力。

它不迎合流量，不制造情绪，只负责还原不同视角下的规律与事实。

天涯大神-组1 天涯大神-组2

---

### 二、技术实现：不是 Prompt，而是多 Agent 协作

这套系统并非简单地把 20 个提示词堆砌在一起，而是基于 **ClawTeam 多 Agent 架构** 构建的协同网络。

系统的工作流高度模拟了真实的“专家智囊团”会议：

1. **🧠 智能协调者 (Coordinator Agent)：** 它是智囊团的“主持人”。当你输入目标后，协调者会自动理解问题本质，将其拆解，并分发给最对口的大神 Agent。

2. **⚙️ 并行分析 (Parallel Analysis)：**被唤醒的多个大神 Agent（如大鹏金翅明王、当年明月等）在各自设定的“思维DNA”和“领域知识”限制下，**同时、独立地**对问题展开分析，互不干扰，保证视角的纯粹性。

3. **📊 综合决策 (Integrator Agent)：**最后，综合决策 Agent 会收集所有大神的输出，提取**共识点**与**分歧点**，揭示潜在的**风险**，并最终输出一份结构化的《最终决策报告》和可执行的行动方案。系统架构开源的仓库文件

![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicAM7aImIHLemWxkDyz8vJicKj54Mlf4Uujn7TKxpo4kMjPUNSsYozB4B6Eia1m68BeeDw5IJ47Nkwhttk6kzPh48kW3UQp9pIEB0/640?wx_fmt=png&from=appmsg)

![](https://mmbiz.qpic.cn/sz_mmbiz_png/iazCrKuBFsicBRt6uHXCUUdIegxbqdMLzHoniaF31icAtpVARNUAXViaqFefiaOp6BoWKgxkiam80jxhZhN3Ic9ibb8Cxia5PbfTkiaJiaahU2ibBNbkpm4/640?wx_fmt=png&from=appmsg)

---

### 三、首批入驻的“传奇大脑”

目前，系统已在 gods/ 目录下完成了 5 位核心大神的单独 Skill 封装（支持一键安装到 OpenClaw），涵盖了最关键的决策领域。其余 15 位大神（如天下霸唱、猫腻、法医秦明等）正在持续构建中。

- **🤴 大鹏金翅明王（权谋分析组）：** 洞察权力本质，专治职场与官场的天真。

- **🏠 KKNDME（经济预言组）：** 基于稀缺资源论，穿透货币金融与房产经济的迷雾。

- **📚 当年明月（历史解读组）：** 从宏大的历史周期律中，寻找当下事件的相似投影。

- **🎭 宁财神（文化解构组）：** 剥开荒诞的社会外衣，用毒舌说真话。

- **🌃 慕容雪村（都市情感组）：** 直面都市生存的冷峻现实与人性幽暗。

---

### 四、四种灵活的使用模式

为了适应不同的使用场景，系统提供了灵活的调用方式（支持触发词、命令行、Python API）：

- **全团分析（面对重大人生决策）：**输入 「启动天涯智囊团」我现在该不该买房？，唤醒全员进行宏观与微观的综合研判。

- **精选小组（面对专业领域问题）：**输入 「召集权谋组」该如何处理目前的职场困境？，只让相关领域的专家介入。

- **对比分析（面对两难选择）：**输入 「对比大神」大鹏金翅明王 + 慕容雪村 + 留在大城市还是回老家？，直观呈现不同价值观的碰撞。

- **单点咨询（快速寻求特定视角）：**输入 「KKNDME视角」分析当前的宏观经济政策对个人的影响。，单独调用某位大神的 Skill。

![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicDc5q0mqWgC5N7Wk1M7S6nLQbuh2tye3nkcaAqXVYSRviaTCpIgpwC6EyO2ibVTAxt4op3ibnq136nJnBnqmnf3xCvyvf4olicSIUM/640?wx_fmt=png&from=appmsg)

---

### 写在最后

在敲下这些代码、提炼这些大神思维模型的过程中，我感觉自己就像是在进行一场数字时代的“思想考古与炼金”。

把古老的智慧、早期的互联网洞察与最前沿的 AI Agent 技术结合起来，是一件非常有意思的事情。

我希望这个多 Agent 系统能成为你在面对复杂世界时的一个**私域参谋部**。

它可能不会给你最温柔的安慰，但它会尽量给你最接近社会底层逻辑的残酷真相。

项目目前已完全开源，欢迎感兴趣的开发者、产品经理以及同样怀念天涯神贴的朋友们前来体验。

如果这个项目对你有启发，欢迎在 GitHub 上为它点亮一颗 **Star ⭐️**。

同时也非常欢迎大家提交 PR，共同完善这 20 位大神的思想内核。

**👇 点击阅读原文，直达 GitHub 仓库，一键部署你的私人智囊团。**

> *( https://github.com/momozi1996/tianya-skills)*

🔗 **GitHub 仓库地址：**

https://github.com/momozi1996/tianya-skills

📚 相关文章：

[12 位 AI自媒体顶流大V的skill仓库：github开源（秋芝、卡兹克、赛文乔伊、赛博禅心、量子位、新智元、极客公园、硅星人、机器之心）](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485457&idx=1&sn=2e00689b3bfb993213e6d84723af12e4&scene=21#wechat_redirect)

[我蒸馏了永乐大典.skill， AI让中华文明瑰宝永生 （附带原著） | AI 也可以让文明永存](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485421&idx=1&sn=0eeed13025fe3944d532d29489e68aef&scene=21#wechat_redirect)

[全网最全、持续更新的 AI 人格蒸馏 Skill 合集｜ 自我蒸馏、职场关系、名人思维、情感陪伴、玄学术数、二次元角色、SBTI测试等7大场景](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485406&idx=1&sn=65cf04a4fb068142f205406f9e44dc60&scene=21#wechat_redirect)

[开源: 蒸馏作家&小说家Skill 库  (刘慈欣，余华，莫言，张爱玲，李碧华，琼瑶..)](https://mp.weixin.qq.com/s?__biz=MzkzOTA2MjQ2Mg==&mid=2247485400&idx=1&sn=40478a59d582bb371072e4b6c3d68776&scene=21#wechat_redirect)
