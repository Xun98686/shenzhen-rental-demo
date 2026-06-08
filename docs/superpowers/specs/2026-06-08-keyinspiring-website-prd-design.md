# KeyInspiring 官网优化与开发 PRD

日期：2026-06-08
状态：面试讨论版
定位：小范围、高影响、可讲清楚的官网优化方案

## 1. 背景

KeyInspiring 当前官网的业务方向较清晰，主要围绕国际学生、毕业生、高校/机构和企业，提供来华实习、早期职业机会、产业沉浸项目和雇主合作服务。

官网已经具备基本业务介绍和转化入口，但从用户决策角度看，仍存在几个会直接影响信任和转化的问题：

- 首页、About 页及部分旧页面的关键数据口径不一致，例如 placements、countries、university partnerships、visa approval、cities 等。
- 品牌与产品名称较分散，例如 KeyInspiring、Key&I、KeyInternship、KeyPlus、KeyImmersion、KeyInitiate 同时出现，新用户不容易理解层级关系。
- 旧版 `www.keyinspiring.com` 页面仍可能被访问或搜索到，且存在占位内容，会影响专业度和 SEO。
- 官网对真实案例、合作背书、服务流程、签证/退款/服务边界等信任内容表达不足。

本 PRD 不做大而全的视觉重构，而是聚焦三个高杠杆优化点：统一信息、清晰分流、增强信任。

## 2. 产品目标

将 KeyInspiring 官网从“业务介绍型网站”优化为“可信赖的国际人才来华机会转化网站”。

优化后，用户进入官网后应能快速回答三个问题：

1. KeyInspiring 是做什么的？
2. 我是否可以信任它处理职业、签证、行程或机构合作相关事项？
3. 我下一步应该点击哪里或提交什么信息？

## 3. 目标用户

### 3.1 核心用户

学生与近期毕业生：

- 目标：寻找中国实习、职业探索或早期全职机会。
- 关注点：岗位真实性、签证可行性、住宿、安全、费用、是否值得付费。

高校与机构：

- 目标：寻找中国本地合作方，设计产业考察、学术交流或学生职业体验项目。
- 关注点：合作方可靠性、行程质量、企业资源、学生安全、风险控制、项目成果。

### 3.2 次级用户

企业雇主：

- 目标：招聘或接收国际实习生/毕业生。
- 关注点：候选人质量、筛选效率、语言和文化适配、行政成本。

家长或资助方：

- 不作为一期主导航入口，但其关心的问题应体现在 FAQ 中，包括安全、签证、费用、退款和服务边界。

## 4. 核心问题诊断

### 问题 1：信任数据不一致

跨境实习、签证、收费服务天然依赖信任。如果官网不同页面出现不一致的数据，用户会怀疑信息真实性，进而降低咨询或申请意愿。

### 问题 2：首页用户路径不够直接

KeyInspiring 服务对象包含学生、毕业生、高校、企业。不同用户的决策问题不同。如果首页没有先做用户分流，访问者需要自行理解业务结构，认知成本较高。

### 问题 3：转化前的风险解释不足

用户在提交表单或付费前，会关心签证、住宿、岗位匹配、退款、项目取消、服务边界等问题。当前官网更偏营销表达，风险解释和可验证背书还不够。

## 5. 优化策略

本次优化采用“信任与转化优先”策略。

面试中可以用一句话概括：

先解决用户敢不敢信，再解决用户看不看得懂，最后解决用户愿不愿意提交线索。

### 优化点 1：统一可信信息

目标：

统一全站所有关键公开数据和业务声明，避免用户看到互相矛盾的信息。

需要统一的数据包括：

- Total placements。
- Countries represented。
- University / institution partnerships。
- Partner companies。
- Visa support 表述。
- Active cities。

产品要求：

- 首页、About、服务页、页脚使用同一套官方数据口径。
- 如果数据无法快速核实，使用保守表述，不使用绝对化承诺。
- 不建议继续使用类似 “100% visa approval” 的表达，除非公司可以合法、真实、持续证明。

验收标准：

- 全站同一指标不出现两个不同数字。
- 旧页面或占位页面被删除、重定向或设置 noindex。
- 所有涉及签证、岗位、结果承诺的文案都避免过度承诺。

### 优化点 2：首页按用户身份分流

目标：

让用户在 5 秒内判断自己应该进入哪个路径。

首页建议结构：

1. 首屏：一句清晰定位语 + 主 CTA。
2. 用户分流：Students & Graduates、Universities & Institutions、Employers。
3. 信任数据条：统一后的核心数据或保守可信表述。
4. 核心服务：Internship、Early-stage Career、Immersion Trip。
5. How it works：用 3-4 步说明服务流程。
6. Proof：案例、合作机构或项目示例。
7. FAQ 预览：展示高频疑问。
8. 最终 CTA：Contact / Apply / Request a Programme。

每个用户入口应包含：

- 一句价值主张。
- 一个该用户最关心的问题。
- 一个明确 CTA。

示例：

- Students & Graduates：Find internships and early career opportunities in China.
- Universities & Institutions：Design China immersion programs with local industry access.
- Employers：Host or hire international early-career talent with support.

验收标准：

- 首页首屏能说明 KeyInspiring 的业务，不只依赖品牌口号。
- 用户分流卡片点击后进入对应落地页。
- 移动端用户无需横向滚动即可完成路径选择。

### 优化点 3：增强信任与风险说明

目标：

在用户提交表单或进一步咨询前，降低对收费、签证、岗位、行程和服务边界的不确定性。

新增或强化模块：

- 真实案例或匿名案例。
- 合作企业/高校/行业类别展示。
- 服务流程时间线。
- FAQ 与政策说明。
- 费用包含与不包含。
- 签证、住宿、退款、岗位匹配、项目取消的说明。

验收标准：

- 每个核心落地页至少包含一个 proof module。
- FAQ 明确说明 KeyInspiring 能控制什么、不能控制什么。
- 付费项目必须说明包含项、排除项、关键风险和下一步沟通方式。

## 6. 页面范围

### 6.1 首页

页面目的：

帮助首次访问者理解业务，并快速选择正确路径。

核心模块：

- Hero：清晰定位，例如 “China opportunities for global talent, universities, and employers.”
- 用户分流卡片。
- 统一数据 / 信任条。
- 核心服务展示。
- How it works。
- 案例或合作背书。
- FAQ 预览。
- 最终 CTA。

主 CTA：

- Start your China opportunity。
- Find my path。

次 CTA：

- Talk to our team。

### 6.2 Students & Graduates 页面

页面目的：

转化对中国实习和早期职业机会感兴趣的学生/毕业生。

核心模块：

- 价值主张。
- 服务选项：Internship、Early-stage Career、KeyPlus support。
- 包含内容。
- 行业与城市示例。
- 申请流程。
- 费用或费用说明。
- 学生案例。
- FAQ。
- Apply CTA。

必须回答的问题：

- 我能获得什么类型的机会？
- 这个服务包含哪些支持？
- 费用是多少？
- 签证、住宿和抵达后如何安排？
- 如果没有匹配成功怎么办？

### 6.3 Universities & Institutions 页面

页面目的：

转化高校、学院、学生组织或机构类项目咨询。

核心模块：

- 面向机构的价值主张。
- 项目主题，例如制造供应链、创业投资、数字科技、金融商业、绿色科技。
- 示例行程。
- 安全与后勤支持。
- 定制流程。
- 项目案例或合作证明。
- Request a Programme CTA。

必须回答的问题：

- KeyInspiring 可以设计什么类型的项目？
- 企业参访、讲者和场地如何选择？
- 如何管理学生安全和行程风险？
- 大致人数和预算范围是什么？

### 6.4 Employers 页面

页面目的：

让企业理解接收或招聘国际人才的价值和流程。

核心模块：

- 企业价值主张。
- 候选人画像。
- 合作流程。
- KeyInspiring 提供的行政和沟通支持。
- Contact CTA。

必须回答的问题：

- 企业可以获得什么类型的候选人？
- 候选人如何筛选？
- 企业需要承担哪些职责？
- KeyInspiring 如何降低企业沟通和行政成本？

### 6.5 About 页面

页面目的：

建立公司层面的可信度。

核心模块：

- Mission。
- 公司模式。
- 团队或创始人介绍。
- 统一数据。
- 城市与合作网络。
- 为什么选择中国，为什么选择 KeyInspiring。

要求：

- About 页不得出现与首页或服务页冲突的数据。

### 6.6 Case Studies 页面

页面目的：

用具体案例承接信任问题。

案例模板：

- 用户类型。
- 初始目标。
- 使用的服务。
- 城市和行业。
- 项目过程。
- 结果。
- 经授权的评价或匿名反馈。

一期最小内容：

- 一个学生/毕业生案例。
- 一个高校/机构项目案例。
- 一个企业合作案例。

### 6.7 FAQ / Policy 页面

页面目的：

回答用户在提交表单或付费前最关心的风险问题。

FAQ 分类：

- Eligibility。
- Internship / job matching。
- Visa support。
- Housing and arrival。
- Pricing and payment。
- Refunds and cancellations。
- Safety and emergency support。
- Employer responsibilities。
- Programme customization。

要求：

- 用清楚、克制的语言说明服务边界。
- 避免“保证录取”“保证签证”“保证高薪”等绝对化表达。

### 6.8 Contact / Application 表单

页面目的：

收集合格线索，并按用户类型分流给内部团队。

基础字段：

- User type。
- Name。
- Email。
- Country / region。
- Interested service。
- Desired start date / programme date。
- Short message。

条件字段：

- Students：education level、target industry、target city。
- Universities：institution name、group size、programme theme。
- Employers：company name、hiring / hosting needs。

验收标准：

- 表单有必填校验和邮箱格式校验。
- 提交成功后展示明确成功提示。
- 提交失败时展示错误提示。
- 移动端可正常填写。
- 后台或接收端能看到 user type 与 interested service。

## 7. 信息架构

推荐顶部导航：

- For Students
- For Universities
- For Employers
- Case Studies
- FAQ
- About
- Contact

推荐页脚内容：

- Main services。
- Company information。
- Contact information。
- Privacy policy。
- Terms / service policy。
- Active social links。

旧页面处理：

- 旧版 `www.keyinspiring.com` 如已过时，应重定向到当前主站。
- 有占位内容的页面应删除、重定向或 noindex。
- 主页面应设置 canonical URL。

## 8. 内容规范

整体语气：

- 专业。
- 可信。
- 国际化。
- 克制，不夸大。

文案原则：

- 先回答用户担忧，再推动 CTA。
- 每个重要声明都应有数据、案例、流程或政策支持。
- 涉及第三方结果时使用保守表达，例如签证、雇主录用、学校审批。

建议替换：

- 将 “100% visa approval” 改为 “Visa guidance and document support for eligible applicants.”
- 将 “guaranteed internship” 改为 “Structured matching support with clear eligibility and placement conditions.”
- 将 “top companies” 改为具体企业名或已验证行业类别。

## 9. 开发需求

### 9.1 前端

- 支持桌面、平板、移动端响应式布局。
- 复用组件：用户分流卡片、数据条、案例卡片、FAQ 折叠面板、CTA、表单。
- 支持基础可访问性：按钮状态、表单 label、键盘焦点、错误提示。
- 生产环境不得出现占位内容。

### 9.2 内容管理

一期可使用静态内容文件或轻量 CMS。

至少需要结构化管理：

- Global metrics。
- Service pages。
- Case studies。
- FAQ entries。
- Programme themes。
- CTA labels and destinations。

### 9.3 表单

- 必填校验。
- 邮箱格式校验。
- 按用户类型分流。
- 成功和失败状态。
- 公开上线时增加基础防垃圾提交机制。

### 9.4 SEO

- 每个核心页面有唯一 title 和 meta description。
- 设置 canonical URL。
- 设置 Open Graph 信息。
- 使用清晰 heading 结构。
- 提供 sitemap 与 robots 配置。
- 对旧页面设置重定向或 noindex。

### 9.5 埋点

建议跟踪：

- 首页用户分流卡片点击。
- 主 CTA 点击。
- FAQ 展开。
- 案例点击。
- 表单开始填写。
- 表单提交成功。
- 表单提交失败。

## 10. 优先级与上线计划

### Phase 1：信任与转化基础

必须完成：

- 统一全站数据和关键声明。
- 重构首页用户分流。
- 建立 Students、Universities、Employers 三个落地页。
- 新增 FAQ / Policy 页面。
- 优化 Contact / Application 表单。
- 清理旧页面和占位页面。

### Phase 2：证明材料扩展

可后续完成：

- 增加更多案例。
- 增加合作企业或项目示例。
- 增加机构项目 brochure。
- 增加更完整的行业主题页面。

### Phase 3：平台能力扩展

长期考虑：

- 学生申请后台。
- 企业合作后台。
- 岗位或项目 marketplace。
- 支付或预约流程。

本次面试测试只建议讨论 Phase 1，Phase 2 和 Phase 3 用于说明长期路线，不进入首期开发范围。

## 11. 风险与应对

风险：公司历史数据短期无法核实。

应对：先使用保守表述，不使用精确数字或绝对化承诺。

风险：真实案例需要授权。

应对：一期可使用匿名案例或项目类型案例，后续替换为正式授权案例。

风险：用户误解为结果保证。

应对：FAQ 和政策页明确说明服务范围、用户责任和第三方变量。

风险：产品名称过多导致理解困难。

应对：统一以 KeyInspiring 作为母品牌，子产品仅作为服务包出现，不在首页制造过多品牌入口。

## 12. 验收标准

上线前应满足：

- 所有公开数据和关键声明全站一致。
- 旧页面、占位页面已删除、重定向或 noindex。
- 首页能清楚分流学生、高校/机构、企业三类用户。
- 每个核心落地页包含价值主张、流程、证明、FAQ 和 CTA。
- FAQ 解释签证、费用、退款、岗位匹配、住宿和服务边界。
- 表单可以按用户类型收集合格线索。
- 移动端和桌面端均可正常阅读和操作。
- 每个核心页面都有 SEO metadata 和 canonical URL。
- 基础埋点事件已配置。

## 13. 面试讲述主线

这份 PRD 的核心不是“把网站做得更好看”，而是解决影响业务转化的三个问题：

1. 先修信任：统一数据和声明，避免用户怀疑真实性。
2. 再修理解：按用户身份分流，让用户快速找到自己的路径。
3. 最后修转化：用案例、流程、FAQ 和服务边界降低提交表单前的不确定性。

一句话总结：

KeyInspiring 这个业务卖的不是简单网页流量，而是信任。因为用户决策涉及职业、签证、行程、费用和学校/企业声誉，所以官网优化必须优先解决可信度和决策风险。
