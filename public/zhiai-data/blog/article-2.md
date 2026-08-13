# 我做了全球首个会「自进化」「自微调」的 Code Agent ：momo Code（V1.0.0）🤔

> 公众号：momo子讲AI ｜ 发布日期：2026-06-27 ｜ 原文：https://mp.weixin.qq.com/s/MWW8eczRSylEAoRELntS7Q

---

我做了全球首个 完全开源免费、会「自进化」「自微调」的 Code Agent

我把它命名为 MOMO CODE 。

" MOMO 代表了 每一个身处 AI 时代，心怀热爱、坚持微光，想要躬身创造价值的普通人。"

![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicDqqet9JtpibFPzDWDLP6of0pnJhDXcvJ0WBicGTcA8rQicgVomzoTicnribnnk7p9m4iataWM5icTx7ia4PLhyjCszYXhEGEb9uyr2ia2Q/640?wx_fmt=png&from=appmsg)

- 官网：https://momozi.cc

- 开源地址：https://github.com/momozi1996/momo-code

MOMO CODE：不只是代码Agent，它会「自进化」+ 「自微调」，它会自己变强。

一、为什么 Code Agent 需要"进化"？

过去半年，我高频使用了市面上许多 Code Agent 工具产品

——Claude Code、Codex、Hermes Agent、Kimi code、Cursor……

它们都很强，尤其是CC 和 Codex， 但有一个共同的问题：

> 模型是静态的。你教它一次，它记住了；你纠正它十次，它可能还会犯第十一次。

就像一个从不记笔记的学生。每次对话都是从零开始，昨天的经验今天全忘。

🤔 我一直在想：如果 Code Agent 能像人一样——从每次交互中学习、积累经验、持续进化——会怎样？

更进一步，每次的交互、每一轮对话，如果能吸纳为模型自我微调的养料——又会怎样？

于是我做了 MOMO CODE, 会「自进化」+ 「自微调」。

二、MOMO CODE 是什么？

一句话：MOMO CODE 是一个完全开源的、会自进化、会自微调的 AI 编程Agent 产品。

![](https://mmbiz.qpic.cn/mmbiz_gif/dTxkmqQ6SznicxdpxUKbBLoJzSlpvNfyfeGn8PIB1Wx5kSbhECECnibDwEYfQrkyyjQibSo1zMUX5sJo4KzcibF9GQ/640)

🔥 MOMO CODE 🔥 V1.0.0版本

它基于Opencode框架而衍生，创新增加了 【自进化】 /evolve 和 【自微调】/fine-tune 模块

- 支持 25+ 大模型（DeepSeek、智谱 GLM、Moonshot Kimi、豆包、MiniMax、Claude、GPT-4、Gemini、……）。

- 支持自定义 OpenAI协议类 API，接入任意模型。

- 核心差异：每次会话后自动积累经验，通过 /evolve 快环和 /fine-tune 慢环持续自我进化。

- 开源地址：https://github.com/momozi1996/momo-code

- 官网：https://momozi.cc

三、【自进化+自微调】双速进化：让它真正"越用越聪明"

这是 MOMO CODE 最核心的设计。

我叫它 "Two-Speed Evolution"——双速进化。

![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicARyt6ATYHHzUIoYCef3Ygv0c88SGYFq3P53FicKeKF8CNchPtpntFZvOZfnFuZc7BXR3TlBVtl94DicDNTOicpNsyBqMyQ8o2ZpY/640?wx_fmt=png&from=appmsg)

灵感来自生物学：细菌有快速适应（应激反应）和长期进化（自然选择），两个时间尺度并行。

我也给 MOMO CODE 设计了两条进化回路：

01

🔥 快环 /evolve —— 【自进化】秒级经验积累

每次你完成一个任务，MOMO CODE 会观察整个过程中的信号：

- 测试通过了？✅ 记一笔

- 编辑被你接受了？✅ 记一笔

- 编译报错了？❌ 记一笔

- 你手动纠正了它？❌ 记一笔

当同一个模式出现 3 次以上（比如"bash 命令成功了"），系统会自动 提炼出一条经验策略（tactic）。

下次你做类似任务时，这些策略会通过 Thompson 采样（一种贝叶斯方法，兼顾"用已知最好的方法"和"给新方法尝试机会"）自动注入到系统提示里。

> 打个比方：就像新手医生第一次做某种手术，失败了；第三次成功了，前辈就会提醒"下次注意这个步骤"。MOMO CODE 的 /evolve 就是这个"前辈"，而且不需要人工干预。

02

🧬 慢环 /fine-tune ——【自微调】 周期性能力跃迁

快环解决的是"经验记忆"。慢环解决的是"能力升级"。

当积累的经验足够多时，/fine-tune 会触发一个 完整的训练管线：

```
课程合成（Curriculum）→ 基线评估（Baseline）→ 训练（Train）→ 候选评估（Candidate）→ 棘轮门控（Ratchet Gate）→ 晋升（Promote）
```

每一步都有严格的数学保证：

```
-课程合成：  
-- 把成功经验（gold）、高胜率策略回放（replay）、失败教训（hard-negative）组合成训练课程-棘轮门控（Ratchet Gate）：  
-- 候选模型必须在所有测试集上 至少和基线一样好（允许 2% 的噪声容差），且不能有任何"之前能做对、现在做错了"的回归。
这是我保证"只进不退"的核心机制-原子晋升：  
-- 通过 Ratchet 后，新策略原子替换旧策略，旧版本自动备份，一键可回滚
```

默认驱动器是 Priors（贝叶斯先验更新），纯 CPU、秒级完成、不依赖任何外部系统。如果你需要真正的 LoRA 微调，也可以接入 PEFT/Transformers。

四、算法架构：Bayesian + Thompson + Ratchet

进化算法基于三个核心数学工具：

1. Beta(α, β) 贝叶斯追踪

每条策略维护一个 Beta 分布。α = 1 + wins，β = 1 + losses。胜率 = α / (α + β)。

这不是静态计数——每次有新数据，整个后验概率分布都会更新。

2. Thompson 采样

选择策略时，从每条策略的 Beta 分布中随机采样一个值，按采样值排序选取前 6 条注入。

这样做的好处是：高胜率策略通常会被选中，但新策略（数据少、方差大）也有机会被"抽中"尝试。自然平衡了"利用"和"探索"。

3. Ratchet Gate（棘轮门控）

```
PASS iff candidate.passAt1 >= baseline.passAt1 - 0.02 AND #regressions == 0
```

即：新模型必须至少和旧模型一样好（允许 2pp 噪声），且不能有任何倒退。这个名字来源于机械棘轮——只能单向转动。

五、系统架构：四层 + 25+ 模型

MOMO CODE 采用四层架构：

![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicBY2yV6Hl2K8Hv91wbSnWgNNCm0SicnKjkF1NicJ4Vea03A3AxHodUxYUziaSNuC9hSzkI7SsFFS85nTwVicq4ice3wOC42Xu7AzHUs/640?wx_fmt=png&from=appmsg)

四层架构

```
**基础设施层**：
--- 25+ LLM Provider Hub，统一 OpenAI-compatible API 接入。
--- 包括 Claude、GPT-4、Gemini、智谱 GLM-4、Moonshot Kimi、豆包、MiniMax、StepFun、OpenRouter、Groq 等，还支持自定义 Provider（填 key + url 即可）。

**Agent 核心层**：
--- SSE 流式输出、系统提示动态组合（身份 + 安全 + 工具指引 + 注入策略）、会话管理、git 快照回滚。

**经验层**：
--- 双速进化引擎 + 统一贝叶斯追踪存储（tactics.json + ledger.jsonl）。

**UI 层**：
--- ASCII 艺术横幅、彩色终端输出、`--json` 模式（方便 CI 集成）。
```

六、一个完整的进化 Demo

你可以 5 分钟跑完整个进化流程：

终端里实际运行效果：

（1）安装：

![](https://mmbiz.qpic.cn/sz_mmbiz_png/iazCrKuBFsicAU2ZkYDpdKjmfKNSDqlJ3bww4fz4vaJoMKKu6Xn4WcicgicaT8ticmE2Ktc0bSvib0Xjic2E1fhzqpwh76C9VXLcIE3V4zHS2Wzl9M/640?wx_fmt=png&from=appmsg)

（2）🔥 快环 /evolve —— 【自进化】秒级经验积累

```
% momo /evolve 相关
```

![](https://mmbiz.qpic.cn/mmbiz_png/iazCrKuBFsicANx0OSm5ianI4J8N9nIPSyDggvWHjJkqibJGTge7P7ZfYkU9iadXwAv72vmln6gic3xjteqOUWW7FlHsLqR7wKmhj6p9oxoL1ibc4Q/640?wx_fmt=png&from=appmsg)

（3）🧬 慢环 /fine-tune ——【自微调】 周期性能力跃迁

```
 % momo /fine-tune
```

![](https://mmbiz.qpic.cn/sz_mmbiz_png/iazCrKuBFsicAF7BRYS2kNibzUpeYw0EYqcaZiaicI3H0YgRPA77gQnp4K2CViaeMvgQ1vEKV3UGjHlkgzmTc230Bx1IG2Z5kTQ6AMQibf5Kbicbmyo/640?wx_fmt=png&from=appmsg)

七、为什么是"首个"？

实际上，MOMO CODE 不是世界上第一个 Code Agent。

但它是：

首个将"经验快环（KEP）+ 训练慢环（MCGS）"作为核心架构内置的开源 Code Agent。

其他工具的进化要么是手动 prompt engineering（人力），要么是端到端微调（贵且慢）。

我做的是 两速并行 ——秒级的经验注入 + 周期性的能力跃迁，且默认完全免费。

![](https://mmbiz.qpic.cn/mmbiz_png/DhnckOVNkgSQXMHlPicUDicrONc2lqWQ4YI446J5Zompu8Ao51GrXmoB8dKk70kg7icwkR0OFIpFq8K20J2hHARxkKico9rwQW3zPGcJVHQ0ul4/640?from=appmsg)

写在最后

![](https://mmbiz.qpic.cn/sz_mmbiz_png/FMoWqUOicKtD7K24HOkeXBp3KjMX3HiciaqcjN4rYsOB8J4M6TbdVzKica6Cx7icjztyFwmr8TkHO2sXQcbelhB0lA0Pm6JtAWHibM3mGicPcUVr94/640?from=appmsg)

![](https://mmbiz.qpic.cn/sz_mmbiz_png/JIJ3XmcmokCIG4sa1ZK5pxcw2bjicpKqmCX8RY4EiaPHs3sSJEL564WN1ocjz6schHDJAJWKM0cbD4oprch9jgp1Tfz7m3wwYwwwqLF7zNrx0/640?from=appmsg)

MOMO CODE 刚刚开源，V1.0.0 版本。代码还很年轻，有很多粗糙的地方。

但我相信，Code Agent 的下一个大方向不仅是"更强的coding模型"，而是"更会学习的系统"。

❤️ 征集：开源共建者 ❤️

MOMO CODE 当前只完成的 V1.0.0版本，目前是我一人完成的，很初步页很粗糙，或许还有很多bug， 还有很多需要优化和提升的地方。🤔

我也希望有更多人参与这个开源项目，让它持续迭代，持续成长，越用越好。

有感兴趣的朋友，欢迎联系我，一起参与项目共建 🎉 👏

模型会越来越同质化（大家都朝着 Claude Opus/GPT-5.5 ），但 谁能在实际编程中不断积累经验、记住教训、持续进化，或许才是真正的壁垒。

这就是我做 MOMO CODE 的初心。

推荐

RECOMMENDATIONS

GitHub：https://github.com/momozi1996/momo-code

官网：https://momozi.cc

安装 ：`curl -fsSL https://momozi.cc/install | bash`

![](https://mmbiz.qpic.cn/mmbiz_png/vZdSVAoGkT1XYPHNsh5tNt9TDxnzSAUjkIyibObHh1a9KP9oQrzrAMGVVDY49fOhP3CpeEY6DEzHPoP5dOZdPGRNf0lia8vUQDkOmHH1QVgLo/640?from=appmsg)

如果你在用它，遇到 bug 或有想法，欢迎来 GitHub 开 Issue。

我们一起把它做得更强。

*作者：MOMOZI*

*架构图、算法详解、完整文档见 GitHub 仓库*
