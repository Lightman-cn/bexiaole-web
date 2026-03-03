import type { Company, Job, Category, Stats } from '@/types';

// 公司数据 - 使用真实公司信息
export const companies: Company[] = [
  {
    id: '1',
    name: '钉钉',
    logo: '/logo-dingding.png',
    type: 'internet',
    industry: 'tob',
    description: '阿里巴巴集团专为中国企业打造的免费沟通和协同的多端平台',
    jobCount: 15,
    reportAvailable: true,
    reportImage: '/report-dingding.jpg',
    reportContent: {
      preview: '钉钉（DingTalk）是阿里巴巴集团专为中国企业打造的免费沟通和协同的多端平台，提供PC版、Web版和手机版，支持手机和电脑间文件互传。钉钉因中国企业而生，帮助中国企业通过系统化的解决方案（微应用），全方位提升中国企业沟通和协同效率。',
      fullContent: `
## 公司概况

钉钉（DingTalk）是阿里巴巴集团专为中国企业打造的免费沟通和协同的多端平台，于2015年1月份正式发版上线。截至2016年12月31日，钉钉的企业组织数量突破500万家，成为中国企业社交知名品牌。

**公司全称**：钉钉（中国）信息技术有限公司 / 浙江天猫供应链管理有限公司  
**总部地址**：浙江省杭州市余杭区文一西路969号  
**所属集团**：阿里巴巴集团  
**成立时间**：2014年（1.0测试版），2015年1月正式发版上线

## 核心业务

1. **即时通讯**：企业级沟通工具，支持单聊、群聊、DING消息
2. **协同办公**：日程、审批、考勤、签到等一站式办公应用
3. **在线会议**：视频会议、直播、屏幕共享
4. **应用生态**：开放平台，支持第三方应用接入
5. **AI能力**：钉钉AI助理、AI听记、AI表格等智能办公功能

## 团队文化

- **使命**：让工作更简单
- **价值观**：客户第一、团队合作、拥抱变化、诚信、激情、敬业
- **工作氛围**：扁平化管理，鼓励创新，技术驱动

## 发展前景

钉钉作为企业数字化转型的基础设施，在AI时代迎来新的发展机遇。2024年推出AI助理功能，进一步巩固行业领先地位。目前钉钉正在打造7亿用户的AI工作方式，从数字化到智能化，重塑协作范式。

## 薪酬福利

- 具有竞争力的薪资水平
- 阿里体系完善的福利体系
- 股票期权激励
- 丰富的培训发展机会
      `,
      highlights: [
        '阿里巴巴核心子公司',
        '7亿+用户组织数',
        '企业数字化领导者',
        'AI转型前沿阵地'
      ]
    }
  },
  {
    id: '2',
    name: '腾讯元宝',
    logo: '/logo-yuanbao.png',
    type: 'internet',
    industry: 'toc',
    description: '腾讯基于自研混元大模型开发的AI助手',
    jobCount: 12,
    reportAvailable: true,
    reportImage: '/report-yuanbao.jpg',
    reportContent: {
      preview: '腾讯元宝是腾讯基于自研混元大模型开发的AI助手，于2024年5月30日正式上线。依托腾讯混元大模型及全生态流量入口，元宝把强大的AI能力装进微信、QQ等国民级应用，覆盖文本、文件、图片、代码全场景。',
      fullContent: `
## 公司概况

腾讯元宝是腾讯公司基于自研混元大模型推出的AI助手应用，于2024年5月30日正式上线。作为腾讯在AI C端赛道的重要布局，元宝承载着腾讯连接用户与AI技术的使命。

**开发者**：深圳市腾讯计算机系统有限公司  
**官网**：https://yuanbao.tencent.com/  
**上线时间**：2024年5月30日  
**技术底座**：腾讯混元大模型T1、DeepSeek-R1

## 核心业务

1. **AI搜索**：整合微信搜一搜、搜狗搜索等引擎，覆盖微信公众号等腾讯生态内容
2. **文档解析**：支持同时解析10个PDF/Word/TXT文件或公众号链接，原生支持256K上下文
3. **AI写作**：生成报告、文案等，支持结构化输出和多轮对话整理
4. **多模态交互**：支持图片OCR识别、语音输入、文件解读
5. **智能体中心**：内置200+AI工具，支持创建个人专属AI助手

## 团队文化

- **使命**：让AI普惠每一个人
- **价值观**：用户为本、科技向善
- **工作氛围**：创新导向，快速迭代，数据驱动

## 发展前景

AI助手市场是下一个互联网入口的争夺焦点。依托腾讯庞大的用户基础和混元大模型的技术实力，元宝具有巨大的发展潜力。截至2025年4月，MAU突破2800万，服务企业超15万家。

## 收费方式

- **免费版**：基础对话/每日5次网页解析/简单代码生成
- **Pro版**：无限制创作+4K图像生成+专业级代码调试（¥39/月）
- **企业版**：私有化部署+API调用+专属顾问（¥19999/年起）

## 薪酬福利

- 腾讯体系薪资水平
- 完善的五险一金
- 弹性工作制
- 丰富的团队活动
      `,
      highlights: [
        '腾讯AI战略核心产品',
        '混元大模型技术支撑',
        'C端AI赛道头部玩家',
        'MAU突破2800万'
      ]
    }
  },
  {
    id: '3',
    name: '瓴羊',
    logo: '/logo-lingyang.png',
    type: 'internet',
    industry: 'tob',
    description: '阿里巴巴全资子公司，主营数据要素服务',
    jobCount: 8,
    reportAvailable: true,
    reportImage: '/report-lingyang.jpg',
    reportContent: {
      preview: '瓴羊是阿里巴巴全资子公司，主营数据要素服务。提供一整套数字化产品和服务，涵盖数据生产、数据消费以及数据流通等三大环节，帮助企业有效利用数据资源，促进数据与企业实际运营的深度融合。',
      fullContent: `
## 公司概况

瓴羊是阿里巴巴全资子公司，也是阿里云智能集团的重要业务，成立于2021年12月1日。致力于将阿里巴巴沉淀十余年的数字化服务经验，系统化、产品化地全面对外输出给千行百业。

**公司全称**：瓴羊智能科技有限公司 / 杭州瓴羊智能服务有限公司  
**官网**：https://www.lydaas.com/  
**成立时间**：2021年12月1日  
**所属集团**：阿里巴巴集团（阿里云智能集团）  
**总部地址**：浙江省杭州市余杭区仓前街道万和路6号A1幢1093室

## 核心业务

1. **Dataphin**：企业级数据建设、治理、消费一体化平台
2. **Quick BI**：连续6年进入Gartner ABI魔力象限的BI产品
3. **智能用户运营**：新一代数据与AI驱动的智能用户运营专家
4. **智能客服**：Quick Service升级大模型在智能客服的应用

## 品牌定位

瓴羊将其核心产品服务定位为"DaaS"——Data intelligence as a Service，其本质是以数据驱动为增长引擎，打通整合企业的商业流、数据流和工作流，让数据智能在企业的生产和经营中发挥最大价值。

## 服务客户

瓴羊已服务了上百家知名企业和众多中小企业的数字化建设，其中包括：
- 制造业：一汽红旗、现代斗山、极氪
- 跨国企业：宝洁、星巴克、麦当劳
- 新国货品牌：伽蓝、三只松鼠

## 团队文化

- **使命**：让数据创造价值
- **价值观**：客户成功、数据驱动、持续创新
- **工作氛围**：技术氛围浓厚，鼓励数据思维

## 薪酬福利

- 行业领先薪资
- 阿里体系福利
- 技术成长空间
- 股权激励计划
      `,
      highlights: [
        '阿里数据中台嫡系',
        '数据智能赛道领先',
        'DaaS服务开创者',
        '服务5万+企业'
      ]
    }
  },
  {
    id: '4',
    name: '某头部国央企',
    logo: '/logo-state.png',
    type: 'state',
    industry: 'state',
    description: '金融科技领域国有大型企业',
    jobCount: 20,
    reportAvailable: true,
    reportImage: '/report-dingding.jpg',
    reportContent: {
      preview: '国内领先的金融科技集团，专注于数字金融服务，业务涵盖支付、理财、信贷等多个领域。由国资委直接监管，是国家级金融科技创新的重要力量。',
      fullContent: `
## 公司概况

作为国内领先的金融科技集团，公司由国资委直接监管，是国家级金融科技创新的重要力量。公司致力于用科技手段提升金融服务效率，服务实体经济。

**公司类型**：国有大型金融科技企业  
**监管单位**：国资委  
**业务领域**：数字支付、智能理财、普惠金融、金融云

## 核心业务

1. **数字支付**：覆盖C端和B端的支付解决方案
2. **智能理财**：AI驱动的财富管理服务
3. **普惠金融**：小微企业信贷服务
4. **金融云**：金融机构数字化转型服务

## 团队文化

- **使命**：科技赋能金融，服务实体经济
- **价值观**：稳健经营、合规先行、创新驱动
- **工作氛围**：稳重务实，注重合规，福利完善

## 发展前景

金融科技是国家战略重点方向，公司在政策支持下持续扩张。数字化转型需求旺盛，业务增长稳定。

## 薪酬福利

- 具有竞争力的薪酬
- 完善的福利体系（六险二金）
- 稳定的工作环境
- 良好的职业发展通道
      `,
      highlights: [
        '国资委直接监管',
        '金融科技国家队',
        '业务稳定福利好',
        '职业发展通道清晰'
      ]
    }
  },
  {
    id: '5',
    name: '某AI创业公司',
    logo: '/logo-ai.png',
    type: 'startup',
    industry: 'toc',
    description: '专注大模型应用的AI初创企业',
    jobCount: 10,
    reportAvailable: false,
    reportImage: '/report-yuanbao.jpg',
    reportContent: {
      preview: '成立于2023年的AI初创公司，专注于大模型在垂直领域的应用落地，已获得知名机构投资。',
      fullContent: `
## 公司概况

公司成立于2023年，由来自顶尖互联网公司和科研院所的AI专家创立。专注于大模型技术在垂直行业的应用落地，已获得多家知名VC投资。

**成立时间**：2023年  
**融资阶段**：A轮  
**技术方向**：大模型应用、RAG、AI Agent

## 核心业务

1. **行业大模型**：面向特定行业的定制化大模型
2. **AI Agent**：智能体应用开发平台
3. **企业知识库**：基于RAG的企业知识管理
4. **智能客服**：大模型驱动的客服解决方案

## 团队文化

- **使命**：让大模型技术惠及千行百业
- **价值观**：创新、敏捷、用户至上
- **工作氛围**：创业氛围浓厚，扁平化管理，成长空间大

## 发展前景

大模型应用正处于爆发期，公司技术实力强，产品市场契合度高。已完成A轮融资，发展迅速。

## 薪酬福利

- 具有竞争力的薪资
- 期权激励计划
- 弹性工作制
- 快速晋升通道
      `,
      highlights: [
        '大模型赛道新星',
        '顶尖技术团队',
        '期权激励丰厚',
        '快速成长期'
      ]
    }
  },
  {
    id: '6',
    name: '某硬件集成厂商',
    logo: '/logo-hardware.png',
    type: 'hardware',
    industry: 'tob',
    description: '智能硬件与系统集成解决方案提供商',
    jobCount: 6,
    reportAvailable: false,
    reportImage: '/report-lingyang.jpg',
    reportContent: {
      preview: '专注于智能硬件研发与系统集成，为政府和企业提供物联网解决方案。',
      fullContent: `
## 公司概况

公司成立于2010年，是国内领先的智能硬件与系统集成解决方案提供商。业务涵盖智慧城市、智慧园区、工业物联网等多个领域。

**成立时间**：2010年  
**业务领域**：物联网、智能硬件、系统集成

## 核心业务

1. **智能硬件**：传感器、边缘计算设备等
2. **系统集成**：物联网整体解决方案
3. **云平台**：设备管理与数据分析平台
4. **运维服务**：7x24小时运维支持

## 团队文化

- **使命**：用物联网技术创造智慧世界
- **价值观**：专业、可靠、创新、共赢
- **工作氛围**：技术导向，项目驱动，团队协作

## 发展前景

物联网市场持续增长，新基建政策带来新机遇。公司在细分领域具有领先优势，订单充足。

## 薪酬福利

- 行业平均以上薪资
- 项目奖金
- 完善的培训体系
- 良好的工作氛围
      `,
      highlights: [
        '物联网领域专家',
        '新基建受益者',
        '项目经验丰富',
        '工作生活平衡'
      ]
    }
  }
];

// 职位数据
export const jobs: Job[] = [
  {
    id: '1',
    title: '高级产品经理',
    company: companies[0],
    location: '杭州',
    salary: '40-60k·16薪',
    type: 'product',
    tags: ['ToB', '企业办公', 'AI产品'],
    hcCount: 3,
    inProcessCount: 8,
    resumeCount: 45,
    urgency: 'high',
    jd: `
## 职位描述

1. 负责钉钉AI产品线的规划与设计，推动产品从0到1的落地
2. 深入了解企业客户需求，挖掘AI在办公场景的应用机会
3. 协调技术、设计、运营等团队，确保产品按时高质量交付
4. 跟踪产品数据，持续优化产品体验

## 任职要求

1. 5年以上产品经理经验，有AI产品经验优先
2. 熟悉企业办公场景，有ToB产品经验
3. 具备优秀的逻辑思维和沟通能力
4. 对AI技术有深入了解，能将技术转化为产品价值
    `,
    requirements: [
      '5年以上产品经验',
      'ToB产品背景',
      'AI产品经验优先',
      '本科以上学历'
    ],
    publishedAt: '2024-01-15'
  },
  {
    id: '2',
    title: '算法工程师',
    company: companies[1],
    location: '北京',
    salary: '50-80k·15薪',
    type: 'algorithm',
    tags: ['大模型', 'NLP', 'Python'],
    hcCount: 5,
    inProcessCount: 12,
    resumeCount: 68,
    urgency: 'high',
    jd: `
## 职位描述

1. 负责大语言模型的训练、调优和部署
2. 优化模型推理性能，降低服务成本
3. 研究最新AI技术，推动技术创新
4. 与产品团队协作，将算法能力转化为产品功能

## 任职要求

1. 计算机相关专业硕士以上学历
2. 3年以上算法开发经验，有大模型经验优先
3. 精通Python，熟悉PyTorch/TensorFlow
4. 在NLP顶会发表论文者优先
    `,
    requirements: [
      '硕士以上学历',
      '3年以上算法经验',
      '大模型相关经验',
      '顶会论文优先'
    ],
    publishedAt: '2024-01-14'
  },
  {
    id: '3',
    title: '大客户销售',
    company: companies[2],
    location: '上海',
    salary: '30-50k·14薪',
    type: 'sales',
    tags: ['ToB销售', '数据中台', '企业客户'],
    hcCount: 4,
    inProcessCount: 6,
    resumeCount: 32,
    urgency: 'medium',
    jd: `
## 职位描述

1. 负责瓴羊数据中台产品的销售工作，完成销售目标
2. 开拓和维护大型企业客户关系
3. 理解客户需求，提供专业的解决方案
4. 协调内部资源，推动项目落地

## 任职要求

1. 5年以上ToB销售经验，有数据产品经验优先
2. 熟悉大型企业客户的决策流程
3. 具备优秀的沟通和谈判能力
4. 有互联网大厂或企业软件公司背景优先
    `,
    requirements: [
      '5年以上ToB销售',
      '数据产品经验',
      '大客户资源',
      '本科以上学历'
    ],
    publishedAt: '2024-01-13'
  },
  {
    id: '4',
    title: '解决方案架构师',
    company: companies[3],
    location: '深圳',
    salary: '35-55k·16薪',
    type: 'solution',
    tags: ['金融', '架构设计', '售前'],
    hcCount: 2,
    inProcessCount: 4,
    resumeCount: 28,
    urgency: 'high',
    jd: `
## 职位描述

1. 负责金融科技解决方案的架构设计
2. 支持售前工作，为客户提供技术咨询
3. 深入了解金融业务，设计符合监管要求的方案
4. 指导项目交付，确保方案落地

## 任职要求

1. 8年以上IT行业经验，5年以上架构设计经验
2. 熟悉金融行业，了解监管政策
3. 精通云计算、微服务、分布式架构
4. 具备优秀的沟通和方案撰写能力
    `,
    requirements: [
      '8年以上IT经验',
      '金融行业背景',
      '架构设计能力',
      '本科以上学历'
    ],
    publishedAt: '2024-01-12'
  },
  {
    id: '5',
    title: '大模型应用工程师',
    company: companies[4],
    location: '北京',
    salary: '40-70k·14薪',
    type: 'algorithm',
    tags: ['大模型', 'RAG', 'Agent'],
    hcCount: 3,
    inProcessCount: 7,
    resumeCount: 41,
    urgency: 'high',
    jd: `
## 职位描述

1. 负责大模型应用开发，包括RAG、Agent等
2. 优化模型应用效果，提升用户体验
3. 探索大模型在垂直领域的创新应用
4. 与产品团队协作，快速迭代产品

## 任职要求

1. 3年以上开发经验，有大模型应用经验
2. 熟悉LangChain、LlamaIndex等框架
3. 精通Python，有良好的工程能力
4. 对AI有热情，学习能力强
    `,
    requirements: [
      '3年以上开发经验',
      '大模型应用经验',
      'Python精通',
      '本科以上学历'
    ],
    publishedAt: '2024-01-11'
  },
  {
    id: '6',
    title: '物联网产品经理',
    company: companies[5],
    location: '苏州',
    salary: '25-40k·13薪',
    type: 'product',
    tags: ['物联网', '硬件', 'ToB'],
    hcCount: 2,
    inProcessCount: 3,
    resumeCount: 19,
    urgency: 'medium',
    jd: `
## 职位描述

1. 负责物联网产品线的规划与管理
2. 深入了解客户需求，设计产品方案
3. 协调硬件、软件、云平台团队，推动产品开发
4. 跟踪产品数据，持续优化产品

## 任职要求

1. 3年以上产品经理经验，有物联网经验优先
2. 熟悉硬件产品开发流程
3. 具备优秀的沟通和协调能力
4. 有技术背景优先
    `,
    requirements: [
      '3年以上产品经验',
      '物联网经验',
      '技术背景优先',
      '本科以上学历'
    ],
    publishedAt: '2024-01-10'
  },
  {
    id: '7',
    title: '高级UI设计师',
    company: companies[0],
    location: '杭州',
    salary: '25-40k·16薪',
    type: 'product',
    tags: ['UI设计', '设计系统', 'ToB'],
    hcCount: 2,
    inProcessCount: 5,
    resumeCount: 36,
    urgency: 'low',
    jd: `
## 职位描述

1. 负责钉钉产品的UI设计工作
2. 参与设计系统的建设与维护
3. 与产品、研发团队紧密协作，确保设计落地
4. 关注设计趋势，持续提升产品体验

## 任职要求

1. 5年以上UI设计经验，有ToB产品经验
2. 精通Figma、Sketch等设计工具
3. 具备优秀的审美和细节把控能力
4. 有良好的沟通和团队协作能力
    `,
    requirements: [
      '5年以上UI设计',
      'ToB产品经验',
      '设计系统经验',
      '本科以上学历'
    ],
    publishedAt: '2024-01-09'
  },
  {
    id: '8',
    title: '后端开发工程师',
    company: companies[1],
    location: '深圳',
    salary: '35-55k·15薪',
    type: 'algorithm',
    tags: ['Java', '微服务', '高并发'],
    hcCount: 4,
    inProcessCount: 9,
    resumeCount: 52,
    urgency: 'medium',
    jd: `
## 职位描述

1. 负责元宝后端服务的开发与优化
2. 设计高并发、高可用的系统架构
3. 保障系统稳定性，解决技术难题
4. 参与技术选型，推动技术进步

## 任职要求

1. 5年以上Java开发经验
2. 熟悉微服务架构，有高并发经验
3. 精通Spring Boot、MySQL、Redis等
4. 有良好的编码习惯和工程素养
    `,
    requirements: [
      '5年以上Java经验',
      '高并发系统经验',
      '微服务架构',
      '本科以上学历'
    ],
    publishedAt: '2024-01-08'
  }
];

// 分类数据
export const categories: Category[] = [
  // 行业分类
  { id: 'industry-tob', name: 'ToB企业', icon: 'Building2', count: 35, type: 'industry' },
  { id: 'industry-toc', name: 'ToC企业', icon: 'Users', count: 28, type: 'industry' },
  { id: 'industry-state', name: '国央企', icon: 'Landmark', count: 20, type: 'industry' },
  
  // 职位类型
  { id: 'job-product', name: '产品经理类', icon: 'Lightbulb', count: 25, type: 'jobType' },
  { id: 'job-sales', name: '大客户销售和SA', icon: 'Handshake', count: 18, type: 'jobType' },
  { id: 'job-algorithm', name: '算法研发', icon: 'Brain', count: 30, type: 'jobType' },
  
  // 公司类型
  { id: 'company-internet', name: '互联网大厂', icon: 'Globe', count: 45, type: 'companyType' },
  { id: 'company-startup', name: '创业公司', icon: 'Rocket', count: 22, type: 'companyType' },
  { id: 'company-hardware', name: '硬件集成厂商', icon: 'Cpu', count: 12, type: 'companyType' },
];

// 统计数据
export const stats: Stats = {
  jobCount: 328,
  companyCount: 156,
  resumeCount: 5236,
  satisfactionRate: 98
};

// 猎头评价数据
export const recruiterInsights: Record<string, string> = {
  '1': '钉钉目前处于AI转型关键期，对AI产品人才需求旺盛。面试流程3-4轮，看重候选人的产品思维和AI理解。HC充足，审批流程较快。',
  '2': '腾讯元宝作为腾讯AI战略核心产品，招聘标准较高。算法岗位需要有大模型实际项目经验，薪资有竞争力。团队年轻有活力。',
  '3': '瓴羊销售岗位主要看重大客户资源和ToB销售经验。底薪+提成模式，提成比例在行业内属于中上水平。',
  '4': '国央企岗位稳定性好，福利完善。但流程相对较长，需要候选人有一定耐心。对金融背景有偏好。',
  '5': 'AI创业公司期权丰厚，适合愿意承担风险追求高回报的候选人。团队技术氛围好，成长空间大。',
  '6': '硬件集成厂商工作节奏相对平缓，适合追求工作生活平衡的候选人。项目制工作，需要一定的出差。'
};
