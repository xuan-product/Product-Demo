import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  Eye,
  Filter,
  GitBranch,
  HeartPulse,
  MessageCircle,
  Mic,
  RefreshCcw,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import './styles.css';

const projects = [
  { id: 'xinghe-3', name: '星河湾三期精装工程', location: '浦东新区', health: 'Yellow' },
  { id: 'yunhai-a', name: '云海中心 A 座改造', location: '徐汇区', health: 'Green' },
  { id: 'beichen', name: '北辰商业广场机电工程', location: '闵行区', health: 'Red' },
];

const risks = [
  {
    id: 'risk-001',
    projectId: 'xinghe-3',
    type: '进度',
    level: 'High',
    description: '钢材供应商反馈可能延迟 3 天到货，结构封顶节点存在顺延风险。',
    confidence: 0.86,
    source: '星河湾三期项目群 / 采购经理',
    time: '09:18',
    status: '待确认',
    aiReason: '群聊中出现“最快下周二”“本周到不了”等延期语义，同时任务节点剩余缓冲仅 1 天，满足高风险触发规则。',
    explanation: '该风险会影响结构封顶的前置材料进场。若今天无法确认到货时间，需要立刻启动替代供应商询价。',
    messages: [
      '采购经理：供应商说这批钢材本周可能到不了，最快下周二。',
      '项目经理：封顶节点缓冲只有一天，不能再拖。',
      'DFC：材料到货日期从 7/8 调整为待确认。',
    ],
  },
  {
    id: 'risk-002',
    projectId: 'xinghe-3',
    type: '客户',
    level: 'High',
    description: '客户连续两次提出样板间设计变更，交付范围和验收口径可能变化。',
    confidence: 0.81,
    source: '客户沟通群 / 客户经理',
    time: '10:02',
    status: '处理中',
    aiReason: '同一客户在 48 小时内多次提出“重新确认”“不按这个做”等变更语义，且关联样板间验收节点。',
    explanation: '建议将变更内容结构化为确认单，并要求客户在本日内确认范围，避免后续返工。',
    messages: [
      '客户：这个颜色还是不太对，想再换一版看看。',
      '客户经理：昨天已经改过一次，需要重新确认工期影响。',
      '设计：如果换材料，验收样板要重新走一遍。',
    ],
  },
  {
    id: 'risk-003',
    projectId: 'xinghe-3',
    type: '质量',
    level: 'Medium',
    description: '现场反馈图纸版本与施工做法不一致，局部区域存在返工隐患。',
    confidence: 0.74,
    source: '施工巡检记录 / 设计经理',
    time: '11:27',
    status: '待确认',
    aiReason: '巡检记录出现“版本不一致”“现场做法对不上”等质量风险信号，但尚未确认影响面积。',
    explanation: '需要设计经理确认最新版图纸，并标注已施工区域是否需要调整。',
    messages: ['施工负责人：这里按旧图做了，和设计最新版对不上。', '设计经理：先别继续铺，下午我到现场确认。'],
  },
  {
    id: 'risk-004',
    projectId: 'xinghe-3',
    type: '安全',
    level: 'Medium',
    description: '脚手架复检记录未完成，明日高空作业前需要安全员确认。',
    confidence: 0.69,
    source: '安全日报 / 安全员',
    time: '13:45',
    status: '待确认',
    aiReason: '安全日报中出现“复检未完成”“高空作业”等组合信号，触发安全风险预警。',
    explanation: '建议订阅明早提醒，并在作业开始前完成安全复检闭环。',
    messages: ['安全员：脚手架复检还差东区 2 个点。', '班组长：明早 8 点要开始高空安装。'],
  },
  {
    id: 'risk-005',
    projectId: 'xinghe-3',
    type: '合规',
    level: 'Low',
    description: '审计资料缺少两处签字记录，需要在周报前补齐。',
    confidence: 0.62,
    source: '资料检查 / 资料员',
    time: '15:10',
    status: '观察中',
    aiReason: '资料检查中出现“缺少签字”语义，影响范围有限，暂定为低风险。',
    explanation: '资料员补齐签字后可关闭风险；若超过周报时间仍未处理，建议升级为 Medium。',
    messages: ['资料员：审计包里还有两处签字没补。', 'PM：周报前要全部补齐。'],
  },
  {
    id: 'risk-006',
    projectId: 'yunhai-a',
    type: '进度',
    level: 'Medium',
    description: '消防联动测试排期未锁定，可能影响月底验收准备。',
    confidence: 0.72,
    source: '云海项目群 / 机电负责人',
    time: '08:42',
    status: '待确认',
    aiReason: '任务更新中测试排期仍为“待确认”，且关联月底验收节点。',
    explanation: '建议今天确认消防、弱电、物业三方联调窗口。',
    messages: ['机电负责人：联动测试时间物业还没给准信。', 'PM：月底验收前必须跑完一轮。'],
  },
  {
    id: 'risk-007',
    projectId: 'yunhai-a',
    type: '客户',
    level: 'Low',
    description: '业主提出会议室灯光场景微调，暂不影响主工期。',
    confidence: 0.58,
    source: '业主沟通群 / 客户经理',
    time: '12:20',
    status: '观察中',
    aiReason: '出现“微调”与“暂不影响”语义，识别为低风险客户变更。',
    explanation: '建议纳入变更清单，避免零散需求丢失。',
    messages: ['业主：会议室灯光能不能再柔和一点？', '客户经理：这块应该不影响主计划。'],
  },
  {
    id: 'risk-008',
    projectId: 'beichen',
    type: '安全',
    level: 'High',
    description: '夜间吊装作业审批未完成，存在违规施工风险。',
    confidence: 0.88,
    source: '安全巡检 / 安全员',
    time: '18:05',
    status: '待确认',
    aiReason: '安全记录中同时出现“夜间吊装”“审批未完成”“今晚施工”等高危组合信号。',
    explanation: '建议立即暂停作业计划，完成审批和安全交底后再开工。',
    messages: ['安全员：夜间吊装审批还没下来。', '班组长：今晚设备已经安排进场。'],
  },
  {
    id: 'risk-009',
    projectId: 'beichen',
    type: '合规',
    level: 'Medium',
    description: '分包单位资质文件即将过期，需要在本周内更新归档。',
    confidence: 0.76,
    source: '资料台账 / 合规专员',
    time: '16:36',
    status: '处理中',
    aiReason: '资料台账显示资质有效期接近截止日期，触发合规风险提醒。',
    explanation: '建议资料员跟进分包单位补充新版资质，避免审计缺口。',
    messages: ['合规专员：北辰分包资质还有 5 天到期。', '资料员：我今天催他们补新版。'],
  },
];

const typeMeta = {
  进度: { color: '#1d4ed8', bg: '#e8f0ff' },
  质量: { color: '#0f766e', bg: '#e5fbf7' },
  客户: { color: '#b45309', bg: '#fff5db' },
  安全: { color: '#dc2626', bg: '#ffeaea' },
  合规: { color: '#64748b', bg: '#f1f5f9' },
};

const levelMeta = {
  High: { color: '#dc2626', bg: '#fff0f0' },
  Medium: { color: '#d97706', bg: '#fff7e6' },
  Low: { color: '#059669', bg: '#eafaf2' },
};

const periods = ['最近7天', '最近15天', '最近30天'];

const rootCauseData = {
  'xinghe-3': {
    totalRisks: 51,
    frequentRisks: 8,
    distribution: [
      { type: '进度风险', percent: 42, color: '#1d4ed8' },
      { type: '质量风险', percent: 25, color: '#0f766e' },
      { type: '客户风险', percent: 18, color: '#b45309' },
      { type: '安全风险', percent: 10, color: '#dc2626' },
      { type: '合规风险', percent: 5, color: '#64748b' },
    ],
    issues: [
      {
        id: 'cause-001',
        name: '材料延期问题',
        issueType: '进度风险',
        count: 8,
        latestTime: '2026-07-05',
        stage: '采购阶段',
        impact: '平均延期5天',
        scope: '结构封顶、泥工进场、材料验收',
        confidence: 0.84,
        rootCause: '采购审批流程存在瓶颈，供应商交付时间确认滞后。',
        trend: [2, 3, 4, 6, 8],
        roles: ['采购经理', '项目经理', '供应商', '施工负责人'],
        reasons: [
          {
            title: '采购审批流程存在瓶颈',
            detail: '过去30天多次延期事件集中发生在采购确认阶段，审批完成时间晚于计划节点。',
          },
          {
            title: '供应商反馈周期较长',
            detail: '关联消息中多次出现“还没给准信”“最快下周”等不确定表达，交付承诺不稳定。',
          },
        ],
        evidence: [
          '采购经理：供应商说这批钢材本周可能到不了，最快下周二。',
          'DFC：材料到货日期从 7/8 调整为待确认。',
          '项目经理：封顶节点缓冲只有一天，不能再拖。',
        ],
        suggestions: ['优化采购审批流程，设置关键材料提前量', '提前确认供应商交付时间，建立备用供应商名单', '对高风险材料设置自动提醒和升级机制'],
      },
      {
        id: 'cause-002',
        name: '图纸版本不一致',
        issueType: '质量风险',
        count: 5,
        latestTime: '2026-07-04',
        stage: '施工阶段',
        impact: '涉及3个施工区域',
        scope: '泥工、木作、设计确认',
        confidence: 0.78,
        rootCause: '图纸变更同步不及时，现场与设计版本管理口径不一致。',
        trend: [1, 2, 2, 4, 5],
        roles: ['设计经理', '施工负责人', '资料员'],
        reasons: [
          { title: '变更同步链路不完整', detail: '设计更新后，现场班组仍引用旧版本图纸继续施工。' },
          { title: '资料版本缺少统一标识', detail: '关联事件中多次出现“旧图”“最新版对不上”等描述。' },
        ],
        evidence: ['施工负责人：这里按旧图做了，和设计最新版对不上。', '设计经理：先别继续铺，下午我到现场确认。'],
        suggestions: ['建立图纸版本冻结机制', '施工前增加最新版图纸确认动作', '将 DFC 变更同步到现场任务卡'],
      },
      {
        id: 'cause-003',
        name: '客户变更反复确认',
        issueType: '客户风险',
        count: 4,
        latestTime: '2026-07-03',
        stage: '样板确认',
        impact: '影响验收口径',
        scope: '样板间、材料选型、客户验收',
        confidence: 0.76,
        rootCause: '客户需求确认粒度不够，样板间变更未形成结构化确认单。',
        trend: [1, 1, 2, 3, 4],
        roles: ['客户经理', '设计经理', '项目经理'],
        reasons: [
          { title: '需求确认不够结构化', detail: '客户多次使用“再换一版”“不太对”等表达，但未沉淀为明确确认项。' },
          { title: '变更影响未及时量化', detail: '工期和材料影响没有在客户沟通时同步确认。' },
        ],
        evidence: ['客户：这个颜色还是不太对，想再换一版看看。', '客户经理：昨天已经改过一次，需要重新确认工期影响。'],
        suggestions: ['将样板间变更转为确认单', '每次变更同步展示工期和成本影响', '设定客户确认截止时间'],
      },
    ],
  },
  'yunhai-a': {
    totalRisks: 23,
    frequentRisks: 4,
    distribution: [
      { type: '进度风险', percent: 36, color: '#1d4ed8' },
      { type: '质量风险', percent: 20, color: '#0f766e' },
      { type: '客户风险', percent: 22, color: '#b45309' },
      { type: '安全风险', percent: 12, color: '#dc2626' },
      { type: '合规风险', percent: 10, color: '#64748b' },
    ],
    issues: [
      {
        id: 'cause-101',
        name: '联调排期不稳定',
        issueType: '进度风险',
        count: 6,
        latestTime: '2026-07-05',
        stage: '机电联调',
        impact: '可能影响月底验收',
        scope: '消防、弱电、物业',
        confidence: 0.79,
        rootCause: '多方联调依赖外部确认，测试窗口未提前锁定。',
        trend: [1, 2, 3, 4, 6],
        roles: ['机电负责人', '物业', '项目经理'],
        reasons: [{ title: '外部协同窗口不固定', detail: '物业反馈不稳定，消防与弱电联调资源没有提前预约。' }],
        evidence: ['机电负责人：联动测试时间物业还没给准信。', 'PM：月底验收前必须跑完一轮。'],
        suggestions: ['提前两周锁定联调窗口', '建立联调责任人清单', '每日同步未确认项'],
      },
    ],
  },
  beichen: {
    totalRisks: 34,
    frequentRisks: 6,
    distribution: [
      { type: '进度风险', percent: 18, color: '#1d4ed8' },
      { type: '质量风险', percent: 16, color: '#0f766e' },
      { type: '客户风险', percent: 12, color: '#b45309' },
      { type: '安全风险', percent: 39, color: '#dc2626' },
      { type: '合规风险', percent: 15, color: '#64748b' },
    ],
    issues: [
      {
        id: 'cause-201',
        name: '夜间作业审批滞后',
        issueType: '安全风险',
        count: 7,
        latestTime: '2026-07-05',
        stage: '吊装施工',
        impact: '存在违规施工风险',
        scope: '安全审批、吊装班组、设备进场',
        confidence: 0.87,
        rootCause: '夜间作业计划与审批流程脱节，施工安排早于审批闭环。',
        trend: [1, 3, 4, 5, 7],
        roles: ['安全员', '班组长', '项目经理'],
        reasons: [{ title: '审批闭环晚于施工计划', detail: '事件中同时出现“审批未完成”和“今晚设备进场”。' }],
        evidence: ['安全员：夜间吊装审批还没下来。', '班组长：今晚设备已经安排进场。'],
        suggestions: ['未完成审批时自动阻断夜间施工计划', '吊装作业前一天完成安全交底', '高风险作业加入红线提醒'],
      },
    ],
  },
};

const rootAssistantContext = {
  'xinghe-3': {
    summary: ['近期主要风险集中在进度风险和质量风险。', '材料延期、图纸版本不一致、客户变更确认是出现频率较高的问题。'],
    causes: [
      {
        title: '采购确认流程较长',
        evidence: ['多条延期风险记录关联采购环节', '多次出现“等待确认”“最快下周”等信息'],
      },
      {
        title: '设计变更同步不及时',
        evidence: ['多次质量风险与设计调整相关', '现场反馈存在旧图与最新版对不上的情况'],
      },
    ],
    suggestions: ['提前锁定关键供应节点', '建立跨部门同步机制', '将设计变更同步到现场任务卡'],
  },
  'yunhai-a': {
    summary: ['近期风险集中在机电联调排期和客户确认。', '整体风险水平较稳定，但外部协同窗口仍需提前锁定。'],
    causes: [
      {
        title: '多方联调窗口不稳定',
        evidence: ['消防、弱电、物业联调时间尚未完全锁定', '月底验收节点临近'],
      },
      {
        title: '客户微调需求未结构化沉淀',
        evidence: ['会议室灯光等细项调整仍停留在群聊沟通', '变更影响暂未转为正式确认项'],
      },
    ],
    suggestions: ['提前两周锁定联调窗口', '建立客户变更确认清单', '每日同步未确认事项'],
  },
  beichen: {
    summary: ['近期主要风险集中在安全风险和合规风险。', '夜间吊装审批、分包资质更新是重点关注项。'],
    causes: [
      {
        title: '高风险作业审批闭环滞后',
        evidence: ['夜间吊装审批未完成但设备已安排进场', '安全交底和作业计划存在时间差'],
      },
      {
        title: '合规资料到期提醒不足',
        evidence: ['分包资质文件临近过期', '资料补充依赖人工催办'],
      },
    ],
    suggestions: ['未完成审批时阻断夜间施工计划', '高风险作业加入红线提醒', '设置资质到期自动预警'],
  },
};

const emotionData = {
  all: {
    name: '全部项目',
    status: '整体可控',
    statusIcon: '😊',
    weekCompare: '负面消息下降 2%',
    summary: '跨项目沟通氛围整体稳定，个别项目在交付节点前出现压力讨论。',
    ranges: {
      '最近7天': {
        positive: 58,
        neutral: 31,
        negative: 11,
        previousNegative: 13,
        previousLabel: '上周',
        currentLabel: '本周',
        anomaly: false,
        trend: [
          { label: '周一', positive: 60, neutral: 30, negative: 10, lastNegative: 12 },
          { label: '周二', positive: 59, neutral: 31, negative: 10, lastNegative: 13 },
          { label: '周三', positive: 57, neutral: 32, negative: 11, lastNegative: 14 },
          { label: '周四', positive: 58, neutral: 31, negative: 11, lastNegative: 13 },
          { label: '周五', positive: 56, neutral: 32, negative: 12, lastNegative: 12 },
          { label: '周六', positive: 59, neutral: 30, negative: 11, lastNegative: 13 },
          { label: '周日', positive: 58, neutral: 31, negative: 11, lastNegative: 13 },
        ],
      },
      '最近15天': {
        positive: 56,
        neutral: 32,
        negative: 12,
        previousNegative: 15,
        previousLabel: '前15天',
        currentLabel: '近15天',
        anomaly: false,
        trend: [
          { label: 'D1', positive: 57, neutral: 31, negative: 12, lastNegative: 16 },
          { label: 'D3', positive: 55, neutral: 33, negative: 12, lastNegative: 15 },
          { label: 'D5', positive: 54, neutral: 33, negative: 13, lastNegative: 15 },
          { label: 'D7', positive: 56, neutral: 32, negative: 12, lastNegative: 14 },
          { label: 'D9', positive: 57, neutral: 31, negative: 12, lastNegative: 15 },
          { label: 'D12', positive: 56, neutral: 32, negative: 12, lastNegative: 15 },
          { label: 'D15', positive: 56, neutral: 32, negative: 12, lastNegative: 15 },
        ],
      },
      '最近30天': {
        positive: 55,
        neutral: 33,
        negative: 12,
        previousNegative: 14,
        previousLabel: '前30天',
        currentLabel: '近30天',
        anomaly: false,
        trend: [
          { label: '1周', positive: 56, neutral: 32, negative: 12, lastNegative: 15 },
          { label: '2周', positive: 54, neutral: 34, negative: 12, lastNegative: 14 },
          { label: '3周', positive: 55, neutral: 33, negative: 12, lastNegative: 13 },
          { label: '4周', positive: 55, neutral: 33, negative: 12, lastNegative: 14 },
        ],
      },
    },
    alert: {
      title: '暂无明显异常波动',
      change: '过去3天负面消息比例：13% → 11%',
      topics: ['验收准备', '材料到场', '客户确认'],
      suggestion: '建议保持例会节奏，持续关注交付节点前后的沟通密度。',
    },
    topics: [
      { name: '材料延期', count: 42, trend: '+8' },
      { name: '设计变更', count: 31, trend: '+4' },
      { name: '工期压力', count: 28, trend: '+6' },
    ],
  },
  'xinghe-3': {
    name: '星河湾三期精装工程',
    status: '需要关注',
    statusIcon: '⚠',
    weekCompare: '负面消息上升 22%',
    summary: '材料供应和设计变更讨论增多，交付压力在近三天集中释放。',
    ranges: {
      '最近7天': {
        positive: 38,
        neutral: 30,
        negative: 32,
        previousNegative: 10,
        previousLabel: '上周',
        currentLabel: '本周',
        anomaly: true,
        trend: [
          { label: '周一', positive: 56, neutral: 34, negative: 10, lastNegative: 9 },
          { label: '周二', positive: 51, neutral: 35, negative: 14, lastNegative: 10 },
          { label: '周三', positive: 47, neutral: 32, negative: 21, lastNegative: 10 },
          { label: '周四', positive: 41, neutral: 31, negative: 28, lastNegative: 11 },
          { label: '周五', positive: 38, neutral: 30, negative: 32, lastNegative: 10 },
          { label: '周六', positive: 39, neutral: 29, negative: 32, lastNegative: 10 },
          { label: '周日', positive: 38, neutral: 30, negative: 32, lastNegative: 10 },
        ],
      },
      '最近15天': {
        positive: 44,
        neutral: 31,
        negative: 25,
        previousNegative: 14,
        previousLabel: '前15天',
        currentLabel: '近15天',
        anomaly: true,
        trend: [
          { label: 'D1', positive: 55, neutral: 31, negative: 14, lastNegative: 12 },
          { label: 'D3', positive: 51, neutral: 32, negative: 17, lastNegative: 13 },
          { label: 'D5', positive: 48, neutral: 32, negative: 20, lastNegative: 14 },
          { label: 'D7', positive: 45, neutral: 31, negative: 24, lastNegative: 14 },
          { label: 'D9', positive: 43, neutral: 31, negative: 26, lastNegative: 15 },
          { label: 'D12', positive: 42, neutral: 32, negative: 26, lastNegative: 14 },
          { label: 'D15', positive: 44, neutral: 31, negative: 25, lastNegative: 14 },
        ],
      },
      '最近30天': {
        positive: 48,
        neutral: 32,
        negative: 20,
        previousNegative: 16,
        previousLabel: '前30天',
        currentLabel: '近30天',
        anomaly: false,
        trend: [
          { label: '1周', positive: 52, neutral: 32, negative: 16, lastNegative: 15 },
          { label: '2周', positive: 49, neutral: 32, negative: 19, lastNegative: 16 },
          { label: '3周', positive: 46, neutral: 33, negative: 21, lastNegative: 16 },
          { label: '4周', positive: 48, neutral: 32, negative: 20, lastNegative: 16 },
        ],
      },
    },
    alert: {
      title: '沟通氛围异常',
      change: '过去3天负面消息比例：10% → 32%',
      topics: ['工期延期', '材料供应', '设计变更'],
      suggestion: '建议关注当前项目交付压力，优先确认材料到场和变更闭环。',
    },
    topics: [
      { name: '材料延期', count: 35, trend: '+18' },
      { name: '设计变更', count: 21, trend: '+9' },
      { name: '工期压力', count: 18, trend: '+7' },
    ],
  },
  'yunhai-a': {
    name: '云海中心A座改造',
    status: '积极稳定',
    statusIcon: '😊',
    weekCompare: '负面消息下降 3%',
    summary: '验收准备讨论较集中，但沟通语气稳定，协同节奏较好。',
    ranges: {
      '最近7天': {
        positive: 62,
        neutral: 30,
        negative: 8,
        previousNegative: 11,
        previousLabel: '上周',
        currentLabel: '本周',
        anomaly: false,
        trend: [
          { label: '周一', positive: 59, neutral: 30, negative: 11, lastNegative: 12 },
          { label: '周二', positive: 60, neutral: 30, negative: 10, lastNegative: 11 },
          { label: '周三', positive: 62, neutral: 29, negative: 9, lastNegative: 10 },
          { label: '周四', positive: 63, neutral: 29, negative: 8, lastNegative: 11 },
          { label: '周五', positive: 62, neutral: 30, negative: 8, lastNegative: 11 },
          { label: '周六', positive: 61, neutral: 31, negative: 8, lastNegative: 10 },
          { label: '周日', positive: 62, neutral: 30, negative: 8, lastNegative: 11 },
        ],
      },
      '最近15天': {
        positive: 61,
        neutral: 30,
        negative: 9,
        previousNegative: 12,
        previousLabel: '前15天',
        currentLabel: '近15天',
        anomaly: false,
        trend: [
          { label: 'D1', positive: 58, neutral: 30, negative: 12, lastNegative: 13 },
          { label: 'D3', positive: 60, neutral: 30, negative: 10, lastNegative: 12 },
          { label: 'D5', positive: 61, neutral: 30, negative: 9, lastNegative: 12 },
          { label: 'D7', positive: 62, neutral: 29, negative: 9, lastNegative: 11 },
          { label: 'D9', positive: 61, neutral: 30, negative: 9, lastNegative: 12 },
          { label: 'D12', positive: 62, neutral: 29, negative: 9, lastNegative: 12 },
          { label: 'D15', positive: 61, neutral: 30, negative: 9, lastNegative: 12 },
        ],
      },
      '最近30天': {
        positive: 60,
        neutral: 31,
        negative: 9,
        previousNegative: 12,
        previousLabel: '前30天',
        currentLabel: '近30天',
        anomaly: false,
        trend: [
          { label: '1周', positive: 59, neutral: 30, negative: 11, lastNegative: 12 },
          { label: '2周', positive: 60, neutral: 31, negative: 9, lastNegative: 12 },
          { label: '3周', positive: 61, neutral: 30, negative: 9, lastNegative: 11 },
          { label: '4周', positive: 60, neutral: 31, negative: 9, lastNegative: 12 },
        ],
      },
    },
    alert: {
      title: '暂无明显异常波动',
      change: '过去3天负面消息比例：11% → 8%',
      topics: ['验收准备', '联调安排', '客户确认'],
      suggestion: '建议继续保持跨方联调节奏，避免验收前信息分散。',
    },
    topics: [
      { name: '验收准备', count: 24, trend: '+3' },
      { name: '联调安排', count: 19, trend: '-2' },
      { name: '客户确认', count: 14, trend: '+1' },
    ],
  },
  beichen: {
    name: '北辰商业广场机电工程',
    status: '压力偏高',
    statusIcon: '⚠',
    weekCompare: '负面消息上升 9%',
    summary: '夜间作业和安全审批相关讨论持续偏多，需要关注执行节奏。',
    ranges: {
      '最近7天': {
        positive: 42,
        neutral: 33,
        negative: 25,
        previousNegative: 16,
        previousLabel: '上周',
        currentLabel: '本周',
        anomaly: true,
        trend: [
          { label: '周一', positive: 49, neutral: 35, negative: 16, lastNegative: 15 },
          { label: '周二', positive: 46, neutral: 34, negative: 20, lastNegative: 16 },
          { label: '周三', positive: 43, neutral: 34, negative: 23, lastNegative: 16 },
          { label: '周四', positive: 41, neutral: 33, negative: 26, lastNegative: 17 },
          { label: '周五', positive: 42, neutral: 33, negative: 25, lastNegative: 16 },
          { label: '周六', positive: 41, neutral: 34, negative: 25, lastNegative: 16 },
          { label: '周日', positive: 42, neutral: 33, negative: 25, lastNegative: 16 },
        ],
      },
      '最近15天': {
        positive: 44,
        neutral: 34,
        negative: 22,
        previousNegative: 17,
        previousLabel: '前15天',
        currentLabel: '近15天',
        anomaly: false,
        trend: [
          { label: 'D1', positive: 48, neutral: 35, negative: 17, lastNegative: 16 },
          { label: 'D3', positive: 46, neutral: 35, negative: 19, lastNegative: 17 },
          { label: 'D5', positive: 44, neutral: 35, negative: 21, lastNegative: 17 },
          { label: 'D7', positive: 43, neutral: 35, negative: 22, lastNegative: 18 },
          { label: 'D9', positive: 43, neutral: 34, negative: 23, lastNegative: 17 },
          { label: 'D12', positive: 44, neutral: 34, negative: 22, lastNegative: 17 },
          { label: 'D15', positive: 44, neutral: 34, negative: 22, lastNegative: 17 },
        ],
      },
      '最近30天': {
        positive: 45,
        neutral: 35,
        negative: 20,
        previousNegative: 18,
        previousLabel: '前30天',
        currentLabel: '近30天',
        anomaly: false,
        trend: [
          { label: '1周', positive: 46, neutral: 35, negative: 19, lastNegative: 17 },
          { label: '2周', positive: 44, neutral: 35, negative: 21, lastNegative: 18 },
          { label: '3周', positive: 45, neutral: 35, negative: 20, lastNegative: 18 },
          { label: '4周', positive: 45, neutral: 35, negative: 20, lastNegative: 18 },
        ],
      },
    },
    alert: {
      title: '沟通氛围异常',
      change: '过去3天负面消息比例：16% → 25%',
      topics: ['安全审批', '夜间作业', '资料补齐'],
      suggestion: '建议关注高风险作业审批闭环，减少临近施工前的反复确认。',
    },
    topics: [
      { name: '安全审批', count: 29, trend: '+11' },
      { name: '夜间作业', count: 17, trend: '+6' },
      { name: '资料补齐', count: 13, trend: '+4' },
    ],
  },
};
const auditData = {
  summary: {
    logCount: 128,
    hiddenStats: 3,
    configVersions: 12,
  },
  logs: [
    {
      id: 'log-001',
      actor: '张经理',
      role: '项目经理',
      action: '查看风险管理报告',
      target: 'A项目风险管理报告',
      time: '2025-05-20 10:32',
      scope: '仅查看汇总报告，未查看具体聊天记录',
    },
    {
      id: 'log-002',
      actor: '王涵',
      role: '部门经理',
      action: '下载AI根因分析报告',
      target: '材料延期问题 - AI根因分析报告',
      time: '2026-07-07 09:18',
      scope: '导出报告用于项目复盘',
    },
    {
      id: 'log-003',
      actor: '系统',
      role: '自动预警',
      action: '推送风险预警',
      target: '夜间吊装审批滞后',
      time: '2026-07-06 18:05',
      scope: '推送给项目经理与安全员',
    },
  ],
  hrStats: [
    { department: '项目管理部', people: 12, leaveRate: '8%', overtimeIndex: '中', visible: true },
    { department: '采购组', people: 5, leaveRate: '12%', overtimeIndex: '高', visible: true },
    { department: '设计协同组', people: 2, leaveRate: null, overtimeIndex: null, visible: false },
    { department: '客户专项组', people: 1, leaveRate: null, overtimeIndex: null, visible: false },
  ],
  configs: [
    { id: 'cfg-001', name: '差旅标准', version: 'v3.2', editor: '财务管理员', time: '2026-07-05 16:20', status: '当前版本' },
    { id: 'cfg-002', name: '审批规则', version: 'v2.8', editor: '流程管理员', time: '2026-07-04 11:05', status: '当前版本' },
    { id: 'cfg-003', name: '风险推送阈值', version: 'v1.6', editor: '系统管理员', time: '2026-07-01 09:40', status: '历史版本' },
  ],
};

function countByLevel(items) {
  return items.reduce(
    (acc, item) => {
      acc[item.level] += 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 },
  );
}

function App() {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [activeModule, setActiveModule] = useState('risk');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [projectPickerOpen, setProjectPickerOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[1]);
  const [typeFilter, setTypeFilter] = useState('全部');
  const [levelFilter, setLevelFilter] = useState('全部');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actions, setActions] = useState({});

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const projectRisks = useMemo(() => risks.filter((risk) => risk.projectId === selectedProject.id), [selectedProject.id]);
  const visibleRisks = useMemo(() => {
    return projectRisks.filter((risk) => {
      const typeOk = typeFilter === '全部' || risk.type === typeFilter;
      const levelOk = levelFilter === '全部' || risk.level === levelFilter;
      return typeOk && levelOk;
    });
  }, [projectRisks, typeFilter, levelFilter]);

  const counts = countByLevel(projectRisks);

  function handleRefresh() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  }

  function handleProjectChange(projectId) {
    setSelectedProjectId(projectId);
    setTypeFilter('全部');
    setLevelFilter('全部');
    setSelectedRisk(null);
    setProjectPickerOpen(false);
  }

  function markRisk(id, value) {
    setActions((current) => ({ ...current, [id]: value }));
  }

  return (
    <div className="app-shell">
      <main className="phone">
        {activeModule === 'risk' ? (
          <RiskFeedPage
            selectedProject={selectedProject}
            counts={counts}
            visibleRisks={visibleRisks}
            refreshing={refreshing}
            actions={actions}
            onProjectOpen={() => setProjectPickerOpen(true)}
            onRefresh={handleRefresh}
            onConfirm={(riskId) => markRisk(riskId, 'confirmed')}
            onDismiss={(riskId) => markRisk(riskId, 'dismissed')}
            onOpenRisk={setSelectedRisk}
          />
        ) : activeModule === 'root' ? (
          <RootCausePage
            projects={projects}
            selectedProject={selectedProject}
            onProjectChange={handleProjectChange}
          />
        ) : activeModule === 'emotion' ? (
          <EmotionDashboardPage
            selectedProject={selectedProject}
            projects={projects}
            selectedPeriod={selectedPeriod}
            refreshing={refreshing}
            onPeriodChange={setSelectedPeriod}
            onProjectChange={handleProjectChange}
            onRefresh={handleRefresh}
          />
        ) : (
          <AuditDashboardPage selectedProject={selectedProject} onProjectOpen={() => setProjectPickerOpen(true)} />
        )}

        <BottomDock
          typeFilter={typeFilter}
          levelFilter={levelFilter}
          onTypeChange={setTypeFilter}
          onLevelChange={setLevelFilter}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((value) => !value)}
          activeModule={activeModule}
          onModuleChange={(module) => {
            setActiveModule(module);
            setSelectedRisk(null);
          }}
        />

        <ProjectDrawer
          open={projectPickerOpen}
          projects={projects}
          risks={risks}
          selectedProjectId={selectedProject.id}
          onSelect={handleProjectChange}
          onClose={() => setProjectPickerOpen(false)}
        />

        <RiskDrawer
          risk={selectedRisk}
          onClose={() => setSelectedRisk(null)}
          onConfirm={() => {
            if (selectedRisk) markRisk(selectedRisk.id, 'confirmed');
            setSelectedRisk(null);
          }}
          onDismiss={() => {
            if (selectedRisk) markRisk(selectedRisk.id, 'dismissed');
            setSelectedRisk(null);
          }}
        />
      </main>
    </div>
  );
}

function RiskFeedPage({ selectedProject, counts, visibleRisks, refreshing, actions, onProjectOpen, onRefresh, onConfirm, onDismiss, onOpenRisk }) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-top">
          <div>
            <p className="eyebrow">观澜 AI Risk Feed</p>
            <button className="project-trigger" type="button" onClick={onProjectOpen}>
              <span>{selectedProject.name}</span>
              <ChevronDown size={18} />
            </button>
            <p className="project-location">{selectedProject.location} · 项目健康度 {selectedProject.health}</p>
          </div>
          <div className="ai-badge">
            <Sparkles size={16} />
            实时识别
          </div>
        </div>
        <div className="risk-summary" aria-label="风险总览">
          <SummaryPill label="高风险" value={counts.High} tone="high" />
          <SummaryPill label="中风险" value={counts.Medium} tone="medium" />
          <SummaryPill label="低风险" value={counts.Low} tone="low" />
        </div>
        <div className="hero-foot">
          <span>平均发现延迟 8 分钟</span>
          <span>覆盖群聊 / DFC / 任务</span>
        </div>
      </section>

      <section className="feed-head">
        <div>
          <h2>风险信息流</h2>
          <p>{visibleRisks.length} 条 AI 输出，等待项目侧闭环</p>
        </div>
        <button className="icon-button" type="button" onClick={onRefresh} aria-label="刷新风险">
          <RefreshCcw size={18} className={refreshing ? 'spin' : ''} />
        </button>
      </section>

      <section className="risk-feed">
        {visibleRisks.map((risk) => (
          <RiskCard
            key={risk.id}
            risk={risk}
            action={actions[risk.id]}
            onConfirm={() => onConfirm(risk.id)}
            onDismiss={() => onDismiss(risk.id)}
            onOpen={() => onOpenRisk(risk)}
          />
        ))}
      </section>
    </>
  );
}

function SummaryPill({ label, value, tone }) {
  return (
    <div className={`summary-pill ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RiskCard({ risk, action, onConfirm, onDismiss, onOpen }) {
  const type = typeMeta[risk.type];
  const level = levelMeta[risk.level];
  return (
    <article className={`risk-card ${action ? `is-${action}` : ''}`}>
      <div className="risk-card-top">
        <span className="tag" style={{ '--tag-color': type.color, '--tag-bg': type.bg }}>
          {risk.type}
        </span>
        <span className="tag" style={{ '--tag-color': level.color, '--tag-bg': level.bg }}>
          {risk.level}
        </span>
        <span className="risk-time">
          <Clock3 size={13} />
          {risk.time}
        </span>
      </div>
      <p className="risk-description">{risk.description}</p>
      <div className="risk-meta">
        <span>
          <ShieldAlert size={14} />
          置信度 {(risk.confidence * 100).toFixed(0)}%
        </span>
        <span>
          <MessageCircle size={14} />
          {risk.source}
        </span>
      </div>
      {action && <div className="action-state">{action === 'confirmed' ? '已确认风险，进入处置队列' : '已忽略，作为反馈样本回流 AI'}</div>}
      <div className="card-actions">
        <button type="button" className="action-button primary" onClick={onConfirm}>
          <Check size={15} />
          确认风险
        </button>
        <button type="button" className="action-button ghost" onClick={onDismiss}>
          忽略风险
        </button>
        <button type="button" className="action-button text" onClick={onOpen}>
          <Eye size={15} />
          查看详情
        </button>
      </div>
    </article>
  );
}

function RootCausePage({ projects, selectedProject, onProjectChange }) {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('自由分析对话');
  const context = rootAssistantContext[selectedProject.id] ?? rootAssistantContext['xinghe-3'];
  const promptQuestions = [
    '为什么项目延期？',
    '最近反复出现的问题是什么？',
    '客户投诉增加原因？',
    '哪些流程存在瓶颈？',
    '如何降低设计变更风险？',
  ];

  const conversationHistory = [
    {
      projectId: 'xinghe-3',
      projectName: '星河湾三期精装工程',
      color: 'blue',
      items: [
        { title: '项目延期原因分析', time: '今天 09:18', summary: '分析了采购审批流程、材料供应、设计变更等关键影响因素。' },
        { title: '客户投诉增加原因分析', time: '7月8日 15:32', summary: '从设计变更、施工质量、沟通响应等维度分析。' },
        { title: '施工质量问题根因分析', time: '7月7日 10:21', summary: '分析了返工率高的原因及关键影响因素。' },
      ],
    },
    {
      projectId: 'yunhai-a',
      projectName: '云海中心 A 座改造',
      color: 'green',
      items: [
        { title: '工期延误分析', time: '7月6日 14:05', summary: '从进度计划、资源配置、流程效率等方面分析。' },
        { title: '设计变更频繁原因分析', time: '7月5日 11:20', summary: '分析变更来源、审批流程、沟通机制等问题。' },
      ],
    },
    {
      projectId: 'beichen',
      projectName: '北辰商业广场机电工程',
      color: 'orange',
      items: [
        { title: '材料供应风险分析', time: '7月4日 16:42', summary: '分析供应商履约、材料交付、库存管理等风险。' },
      ],
    },
  ];

  function ask(question) {
    const trimmed = question.trim();
    if (!trimmed || isThinking) return;
    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: trimmed };
    setMessages((current) => [...current, userMessage]);
    setConversationTitle(trimmed.length > 16 ? `${trimmed.slice(0, 16)}...` : trimmed);
    setInputValue('');
    setIsThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, buildRootCauseAnswer(trimmed, selectedProject, context)]);
      setIsThinking(false);
    }, 650);
  }

  function startNewConversation() {
    setMessages([]);
    setInputValue('');
    setConversationTitle('自由分析对话');
  }

  function openHistoryItem(item, projectId) {
    onProjectChange(projectId);
    setConversationTitle(item.title);
    setMessages([
      { id: `history-user-${Date.now()}`, role: 'user', content: item.title },
      { id: `history-ai-${Date.now()}`, role: 'assistant', type: 'analysis', content: item.summary },
    ]);
    setHistoryOpen(false);
  }

  function downloadProjectReport() {
    const report = buildReportText(selectedProject, context);
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedProject.name}-AI根因分析报告.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="assistant-page">
      <header className="root-assistant-actionbar">
        <button type="button" className="root-action-primary" onClick={startNewConversation}>
          <Sparkles size={17} />
          新建对话
        </button>
        <button type="button" className="root-action-secondary" onClick={() => setHistoryOpen(true)}>
          <Clock3 size={17} />
          对话记录
        </button>
      </header>
      <div className="chat-area root-chat-area">
        <section className="ai-intro-panel root-ai-intro-panel">
          <div className="ai-avatar">
            <Sparkles size={26} />
          </div>
          <div className="ai-intro-copy">
            <span>观澜工程 AI 助手</span>
            <h2>面向项目现场的智能分析助手</h2>
            <p>基于项目风险、沟通记录、任务节点和流程数据，帮助你定位问题原因、梳理分析依据，并形成可执行的优化建议。</p>
          </div>
          <div className="ai-capability-row">
            <span>风险识别</span>
            <span>原因定位</span>
            <span>优化建议</span>
            <span>持续追问</span>
          </div>
        </section>

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} selectedProject={selectedProject} context={context} onDownload={downloadProjectReport} />
        ))}

        <section className="prompt-panel">
          <div className="section-title">
            <span>推荐问题</span>
            <small>选择一个方向开始分析</small>
          </div>
          <div className="prompt-list">
            {promptQuestions.map((suggestion) => (
              <button type="button" key={suggestion} onClick={() => ask(suggestion)}>
                <span>{suggestion}</span>
                <b>›</b>
              </button>
            ))}
          </div>
        </section>

        {isThinking && (
          <div className="chat-message assistant">
            <div className="bubble thinking">正在读取 {selectedProject.name} 的风险、沟通和流程记录...</div>
          </div>
        )}
      </div>

      <form
        className="root-input-panel"
        onSubmit={(event) => {
          event.preventDefault();
          ask(inputValue);
        }}
      >
        <div className="project-bubble-row">
          {projects.map((project) => (
            <button
              type="button"
              className={`project-bubble ${project.id === selectedProject.id ? 'active' : ''}`}
              key={project.id}
              onClick={() => onProjectChange(project.id)}
            >
              {project.name}
            </button>
          ))}
        </div>
        <div className="root-input-row">
          <button type="button" className="voice-button" aria-label="语音输入">
            <Mic size={18} />
          </button>
          <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} placeholder="基于当前项目提问..." />
          <button type="submit" className="send-button" aria-label="发送问题">
            <SendHorizontal size={18} />
          </button>
        </div>
      </form>

      <ConversationHistoryDrawer
        open={historyOpen}
        groups={conversationHistory}
        onClose={() => setHistoryOpen(false)}
        onOpenItem={openHistoryItem}
      />
    </section>
  );
}

function ConversationHistoryDrawer({ open, groups, onClose, onOpenItem }) {
  if (!open) return null;
  return (
    <div className="drawer-layer" role="dialog" aria-modal="true">
      <button className="drawer-mask" type="button" onClick={onClose} aria-label="关闭对话记录" />
      <section className="drawer conversation-history-drawer">
        <div className="drawer-grip" />
        <div className="conversation-history-head">
          <h3>对话记录</h3>
          <button type="button" className="icon-button small" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>
        <div className="history-search-row">
          <div className="history-search-box">
            <MessageCircle size={15} />
            <span>搜索对话记录</span>
          </div>
          <button type="button">全部项目</button>
        </div>
        <div className="history-group-list">
          {groups.map((group) => (
            <article className="history-group-card" key={group.projectId}>
              <div className="history-project-title">
                <span className={`history-project-icon ${group.color}`}>
                  <Building2 size={15} />
                </span>
                <strong>{group.projectName}</strong>
              </div>
              <div className="history-item-list">
                {group.items.map((item) => (
                  <button type="button" className="history-item" key={`${group.projectId}-${item.title}`} onClick={() => onOpenItem(item, group.projectId)}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.summary}</p>
                    </div>
                    <time>{item.time}</time>
                  </button>
                ))}
              </div>
              <button type="button" className="history-more-button">查看更多 ({group.items.length * 4})</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChatMessage({ message, selectedProject, context, onDownload }) {
  if (message.type === 'report') {
    return (
      <div className="chat-message assistant">
        <div className="bubble report-card">
          <h3>{selectedProject.name} 风险复盘报告</h3>
          <ReportPreview context={context} />
          <div className="report-actions">
            <button type="button">查看报告</button>
            <button type="button" onClick={onDownload}>下载报告</button>
          </div>
        </div>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="chat-message user">
        <div className="bubble">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="chat-message assistant">
      <div className="bubble structured-answer">
        <div className="analysis-process">
          <span>已读取项目上下文</span>
          <span>正在归纳高频风险</span>
          <span>生成根因推测</span>
        </div>
        <div className="answer-summary-card">
          <strong>{selectedProject.name} 分析摘要</strong>
          <ul>
            {context.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <h4>结构化根因分析</h4>
        {context.causes.map((cause, index) => (
          <div className="answer-cause" key={cause.title}>
            <strong>可能原因 {index + 1}：{cause.title}</strong>
            <span>分析依据</span>
            <ul>
              {cause.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="suggestion-card">
          <strong>建议</strong>
          <ul>
            {context.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="warning-card">AI 推测，仅供参考。请结合现场事实和项目负责人确认后再执行。</div>
      </div>
    </div>
  );
}

function ReportPreview({ context }) {
  return (
    <div className="report-preview">
      <p>包含风险总结、根因分析、分析依据与改进建议。</p>
      <ul>
        <li>{context.summary[0]}</li>
        <li>主要根因：{context.causes[0]?.title}</li>
        <li>建议：{context.suggestions[0]}</li>
      </ul>
    </div>
  );
}

function buildRootCauseAnswer(question, selectedProject, context) {
  const wantsReport = question.includes('报告') || question.includes('复盘');
  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    type: wantsReport ? 'report' : 'analysis',
    projectId: selectedProject.id,
    content: context.summary.join(''),
  };
}

function buildReportText(selectedProject, context) {
  return `${selectedProject.name}风险复盘报告\n\n风险总结\n${context.summary.map((item) => `- ${item}`).join('\n')}\n\n根因分析\n${context.causes
    .map((cause, index) => `${index + 1}. ${cause.title}\n分析依据：\n${cause.evidence.map((item) => `- ${item}`).join('\n')}`)
    .join('\n\n')}\n\n改进建议\n${context.suggestions.map((item) => `- ${item}`).join('\n')}\n\nAI 推测，仅供参考`;
}
function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmotionDashboardPage({ projects, selectedProject, selectedPeriod, refreshing, onPeriodChange, onProjectChange, onRefresh }) {
  const [emotionProjectId, setEmotionProjectId] = useState(selectedProject.id);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const selectedEmotionData = emotionData[emotionProjectId] ?? emotionData.all;
  const rangeData = selectedEmotionData.ranges[selectedPeriod] ?? selectedEmotionData.ranges['最近7天'];
  const projectOptions = [{ id: 'all', name: '全部项目' }, ...projects];
  const negativeDelta = rangeData.negative - rangeData.previousNegative;
  const periodDays = selectedPeriod.replace('最近', '过去');
  const pressureText = negativeDelta >= 0 ? `上升至 ${rangeData.negative}%` : `下降至 ${rangeData.negative}%`;
  const trendSentence = `${periodDays}负面讨论占比从${rangeData.previousNegative}%${pressureText}`;

  function chooseProject(projectId) {
    setEmotionProjectId(projectId);
    setProjectMenuOpen(false);
    if (projectId !== 'all') {
      onProjectChange(projectId);
    }
  }

  return (
    <>
      <section className="emotion-lite-header polished project-first">
        <div className="emotion-header-meta">
          <span>沟通健康洞察</span>
          <span className={`emotion-state-chip ${rangeData.anomaly ? 'warning' : 'stable'}`}>
            {rangeData.anomaly ? '压力上升' : '趋势稳定'}
          </span>
        </div>
        <div className="emotion-project-shell">
          <button type="button" className="emotion-project-title" onClick={() => setProjectMenuOpen((open) => !open)}>
            <Building2 size={18} />
            <span>{selectedEmotionData.name}</span>
            <ChevronDown size={18} />
          </button>
          {projectMenuOpen && (
            <div className="emotion-project-menu">
              {projectOptions.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  className={project.id === emotionProjectId ? 'active' : ''}
                  onClick={() => chooseProject(project.id)}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <p>观察项目沟通氛围变化，辅助提前识别交付压力。</p>
      </section>
      <section className={`atmosphere-trend-card ${rangeData.anomaly ? 'warning' : 'stable'}`}>
        <div className="trend-summary-head title-first">
          <div>
            <h2>沟通氛围趋势</h2>
            <p>{trendSentence}</p>
          </div>
          <span className={`trend-status-button ${rangeData.anomaly ? 'warning' : 'stable'}`}>
            {rangeData.anomaly ? '需关注' : '稳定'}
          </span>
        </div>
        {rangeData.anomaly && <p className="trend-inline-note">负面讨论连续升高，建议优先查看关联话题和 AI 洞察。</p>}
        <EmotionTrendChart points={rangeData.trend} />
        <div className="trend-compare-grid compact">
          <span>{rangeData.previousLabel}<b>负面讨论 {rangeData.previousNegative}%</b></span>
          <span>{rangeData.currentLabel}<b>负面讨论 {rangeData.negative}%</b></span>
        </div>
      </section>
      <section className="emotion-ratio-strip compact-ratio-card">
        <div className="section-title-row compact-title-row">
          <div>
            <h2>沟通情绪比例</h2>
            <p>辅助参考，不代表个人评价</p>
          </div>
        </div>
        <EmotionDistribution positive={rangeData.positive} neutral={rangeData.neutral} negative={rangeData.negative} />
      </section>

      <section className="ai-analysis-card insight-analysis-card">
        <div className="section-title-row compact-title-row">
          <div>
            <h2>AI洞察</h2>
            <p>趋势洞察 + 原因分析，仅基于项目汇总数据</p>
          </div>
          <Sparkles size={18} />
        </div>
        <div className="ai-insight-list four-part">
          <div>
            <span>AI发现</span>
            <p>{rangeData.anomaly ? trendSentence : '近期沟通氛围整体稳定，负面讨论未出现连续升高。'}</p>
          </div>
          <div>
            <span>可能原因</span>
            <p>{rangeData.anomaly ? selectedEmotionData.summary : '当前讨论主要集中在常规协同事项，未形成明显交付压力。'}</p>
          </div>
          <div>
            <span>关联话题</span>
            <p>{selectedEmotionData.alert.topics.join('、')}</p>
          </div>
          <div>
            <span>管理建议</span>
            <p>{selectedEmotionData.alert.suggestion}</p>
          </div>
        </div>
      </section>

      <section className="section-card emotion-section-card topic-feed-section">
        <div className="section-title-row compact-title-row">
          <div>
            <h2>近期高频话题</h2>
            <p>仅展示项目汇总话题，不定位到个人</p>
          </div>
        </div>
        <div className="topic-analysis-list">
          {selectedEmotionData.topics.map((topic, index) => (
            <article className="topic-analysis-card" key={topic.name}>
              <span>{index + 1}</span>
              <div>
                <strong>{topic.name}</strong>
                <small>涉及消息：{topic.count}条</small>
              </div>
              <b>{topic.trend}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="privacy-card emotion-privacy-note">
        <ShieldAlert size={16} />
        <span>本页只展示团队/项目汇总数据，不展示任何个人情绪评分，不输出员工性格或心理状态判断。AI分析结果，仅供参考。</span>
      </section>

      <section className="emotion-floating-actions">
        <div className="range-segmented" aria-label="时间范围筛选">
          {periods.map((period) => (
            <button type="button" className={period === selectedPeriod ? 'active' : ''} key={period} onClick={() => onPeriodChange(period)}>
              {period.replace('最近', '')}
            </button>
          ))}
        </div>
        <button type="button" className="emotion-refresh" onClick={onRefresh} aria-label="刷新沟通健康洞察">
          <RefreshCcw size={16} className={refreshing ? 'spin' : ''} />
        </button>
      </section>
    </>
  );
}
function EmotionDistribution({ positive, neutral, negative }) {
  return (
    <div className="emotion-distribution-card">
      <div className="emotion-distribution-bar">
        <i className="positive" style={{ width: `${positive}%` }} />
        <i className="neutral" style={{ width: `${neutral}%` }} />
        <i className="negative" style={{ width: `${negative}%` }} />
      </div>
      <div className="emotion-distribution-values">
        <b>积极 {positive}%</b>
        <b>中性 {neutral}%</b>
        <b>消极 {negative}%</b>
      </div>
    </div>
  );
}

function EmotionTrendChart({ points }) {
  const chartWidth = 320;
  const chartHeight = 160;
  const padding = 24;
  const xStep = points.length > 1 ? (chartWidth - padding * 2) / (points.length - 1) : 0;

  function pathFor(key) {
    return points
      .map((point, index) => {
        const x = padding + index * xStep;
        const y = chartHeight - padding - (point[key] / 100) * (chartHeight - padding * 2);
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }

  const anomalyPoint = points.reduce((max, point, index) => (point.negative > max.point.negative ? { point, index } : max), { point: points[0], index: 0 });
  const anomalyX = padding + anomalyPoint.index * xStep;
  const anomalyY = chartHeight - padding - (anomalyPoint.point.negative / 100) * (chartHeight - padding * 2);

  return (
    <div className="emotion-chart-wrap">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="沟通氛围变化趋势折线图">
        <line x1={padding} y1="32" x2={chartWidth - padding} y2="32" />
        <line x1={padding} y1="80" x2={chartWidth - padding} y2="80" />
        <line x1={padding} y1="128" x2={chartWidth - padding} y2="128" />
        <path className="positive" d={pathFor('positive')} />
        <path className="neutral" d={pathFor('neutral')} />
        <path className="negative" d={pathFor('negative')} />
        <path className="last-negative" d={pathFor('lastNegative')} />
        <circle className="anomaly-dot" cx={anomalyX} cy={anomalyY} r="4" />
      </svg>
      <div className="chart-legend">
        <span className="positive">积极</span>
        <span className="neutral">中性</span>
        <span className="negative">消极</span>
        <span className="last">上期消极</span>
      </div>
    </div>
  );
}
function AuditDashboardPage({ selectedProject, onProjectOpen }) {
  const [rolledBackConfig, setRolledBackConfig] = useState(null);

  function exportLogs() {
    const content = auditData.logs
      .map((log) => `${log.time},${log.actor},${log.role},${log.action},${log.target},${log.scope}`)
      .join('\n');
    const blob = new Blob([`时间,操作人,角色,动作,对象,范围\n${content}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '观澜审计日志.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="hero-card audit-hero">
        <div className="hero-top">
          <div>
            <p className="eyebrow">观澜 Audit Log</p>
            <button className="project-trigger" type="button" onClick={onProjectOpen}>
              <span>{selectedProject.name}</span>
              <ChevronDown size={18} />
            </button>
            <p className="project-location">日志不可删除 · 小部门隐私保护 · 配置可回滚</p>
          </div>
          <div className="ai-badge">
            <ClipboardList size={16} />
            合规
          </div>
        </div>
        <div className="audit-summary">
          <MetricCard label="审计日志" value={`${auditData.summary.logCount}条`} />
          <MetricCard label="隐藏统计" value={`${auditData.summary.hiddenStats}项`} />
          <MetricCard label="配置版本" value={`${auditData.summary.configVersions}个`} />
        </div>
      </section>

      <section className="section-card">
        <div className="section-title-row">
          <div>
            <h2>审计日志</h2>
            <p>记录谁在什么时间查看/下载/推送了哪些风险内容</p>
          </div>
          <button type="button" className="mini-action" onClick={exportLogs}>导出</button>
        </div>
        <div className="audit-log-list">
          {auditData.logs.map((log) => (
            <article className="audit-log-card" key={log.id}>
              <div className="team-head">
                <strong>{log.action}</strong>
                <span>{log.time}</span>
              </div>
              <p>{log.actor} · {log.role}</p>
              <small>{log.target}</small>
              <em>{log.scope}</em>
            </article>
          ))}
        </div>
        <div className="privacy-card">
          <ShieldAlert size={16} />
          <span>审计日志不可删除，仅可按权限导出供法务/审计追溯。</span>
        </div>
      </section>

      <section className="section-card">
        <div className="section-title-row">
          <div>
            <h2>HR看板隐私保护</h2>
            <p>部门人数少于3人时自动隐藏请假率等统计</p>
          </div>
        </div>
        <div className="hr-list">
          {auditData.hrStats.map((item) => (
            <div className={`hr-card ${item.visible ? '' : 'hidden-stat'}`} key={item.department}>
              <div className="team-head">
                <strong>{item.department}</strong>
                <span className={`status-pill ${item.visible ? '' : 'danger'}`}>{item.people}人</span>
              </div>
              {item.visible ? (
                <div className="team-metrics">
                  <span>请假率 {item.leaveRate}</span>
                  <span>加班指数 {item.overtimeIndex}</span>
                </div>
              ) : (
                <p className="hidden-copy">人数不足，不展示统计</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-title-row">
          <div>
            <h2>配置版本管理</h2>
            <p>差旅标准、审批规则等修改后保留历史版本</p>
          </div>
        </div>
        <div className="config-list">
          {auditData.configs.map((config) => (
            <article className="config-card" key={config.id}>
              <div>
                <strong>{config.name}</strong>
                <p>{config.version} · {config.editor}</p>
                <small>{config.time}</small>
              </div>
              <button type="button" className="rollback-button" onClick={() => setRolledBackConfig(config.name)}>
                回滚
              </button>
            </article>
          ))}
        </div>
        {rolledBackConfig && <div className="action-state">{rolledBackConfig} 已模拟回滚到上一版本</div>}
      </section>
    </>
  );
}

function BottomDock({ typeFilter, levelFilter, onTypeChange, onLevelChange, filtersOpen, onToggleFilters, activeModule, onModuleChange }) {
  return (
    <footer className="bottom-dock">
      {activeModule === 'risk' &&
        (filtersOpen ? (
          <div className="filter-panel">
            <div className="select-wrap">
              <Filter size={15} />
              <select value={typeFilter} onChange={(event) => onTypeChange(event.target.value)} aria-label="按类型筛选">
                {['全部', '进度', '质量', '客户', '安全', '合规'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
            <div className="select-wrap compact">
              <select value={levelFilter} onChange={(event) => onLevelChange(event.target.value)} aria-label="按等级筛选">
                {['全部', 'High', 'Medium', 'Low'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
            <button type="button" className="bar-button collapse" onClick={onToggleFilters} aria-label="收起筛选">
              收起
            </button>
          </div>
        ) : (
          <button type="button" className="filter-fab" onClick={onToggleFilters}>
            <Filter size={16} />
            筛选
          </button>
        ))}
      <nav className="module-tabs" aria-label="观澜模块导航">
        <button type="button" className={`module-tab ${activeModule === 'risk' ? 'active' : ''}`} onClick={() => onModuleChange('risk')}>
          <ShieldAlert size={18} />
          <span>风险</span>
        </button>
        <button type="button" className={`module-tab ${activeModule === 'root' ? 'active' : ''}`} onClick={() => onModuleChange('root')}>
          <GitBranch size={18} />
          <span>根因</span>
        </button>
        <button type="button" className={`module-tab ${activeModule === 'emotion' ? 'active' : ''}`} onClick={() => onModuleChange('emotion')}>
          <HeartPulse size={18} />
          <span>情绪</span>
        </button>
        <button type="button" className={`module-tab ${activeModule === 'audit' ? 'active' : ''}`} onClick={() => onModuleChange('audit')}>
          <ClipboardList size={18} />
          <span>审计</span>
        </button>
      </nav>
    </footer>
  );
}

function ProjectDrawer({ open, projects, risks: allRisks, selectedProjectId, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="drawer-layer" role="dialog" aria-modal="true">
      <button className="drawer-mask" type="button" onClick={onClose} aria-label="关闭项目筛选" />
      <section className="drawer project-drawer">
        <div className="drawer-grip" />
        <div className="drawer-head">
          <div>
            <h3>选择项目</h3>
            <p>切换后会同步刷新风险总览与信息流</p>
          </div>
          <button type="button" className="icon-button small" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>
        <div className="project-list">
          {projects.map((project) => {
            const counts = countByLevel(allRisks.filter((risk) => risk.projectId === project.id));
            const active = project.id === selectedProjectId;
            return (
              <button key={project.id} type="button" className={`project-option ${active ? 'active' : ''}`} onClick={() => onSelect(project.id)}>
                <span className="project-icon">
                  <Building2 size={18} />
                </span>
                <span className="project-copy">
                  <strong>{project.name}</strong>
                  <small>{project.location} · {project.health}</small>
                </span>
                <span className="project-counts">
                  <b>{counts.High}</b>
                  <small>High</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RiskDrawer({ risk, onClose, onConfirm, onDismiss }) {
  if (!risk) return null;
  const type = typeMeta[risk.type];
  const level = levelMeta[risk.level];
  const cause = getSingleRiskCause(risk);
  return (
    <div className="drawer-layer" role="dialog" aria-modal="true">
      <button className="drawer-mask" type="button" onClick={onClose} aria-label="关闭详情" />
      <section className="drawer">
        <div className="drawer-grip" />
        <div className="drawer-head">
          <div>
            <span className="tag" style={{ '--tag-color': type.color, '--tag-bg': type.bg }}>
              {risk.type}
            </span>
            <span className="tag" style={{ '--tag-color': level.color, '--tag-bg': level.bg }}>
              {risk.level}
            </span>
          </div>
          <button type="button" className="icon-button small" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>
        <h3>{risk.description}</h3>
        <DetailBlock title="AI 判断依据" body={risk.aiReason} />
        <DetailBlock title="风险解释" body={risk.explanation} />
        <div className="detail-block single-cause-block">
          <h4>根因分析</h4>
          <div className="ai-note">AI推测，仅供参考</div>
          <div className="single-cause-grid">
            <span>
              <b>{cause.primary}</b>
              可能主因
            </span>
            <span>
              <b>{cause.scope}</b>
              影响范围
            </span>
          </div>
          <p>{cause.detail}</p>
          <div className="cause-suggestion">
            <strong>建议动作</strong>
            <span>{cause.suggestion}</span>
          </div>
        </div>
        <div className="message-list">
          <h4>关联消息</h4>
          {risk.messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
        <div className="drawer-actions">
          <button type="button" className="action-button primary" onClick={onConfirm}>
            确认风险
          </button>
          <button type="button" className="action-button ghost" onClick={onDismiss}>
            忽略风险
          </button>
        </div>
      </section>
    </div>
  );
}

function getSingleRiskCause(risk) {
  const map = {
    进度: {
      primary: '前置依赖未锁定',
      scope: '节点计划 / 资源排期',
      detail: '该风险与材料、排期或外部确认有关，当前信息显示关键前置条件尚未形成确定承诺，导致后续节点缓冲被压缩。',
      suggestion: '锁定责任人和截止时间，要求当天确认交付/排期，并准备替代方案。',
    },
    质量: {
      primary: '标准同步不一致',
      scope: '施工区域 / 返工成本',
      detail: '该风险多由图纸、做法、验收标准不同步引发，现场继续施工可能扩大返工范围。',
      suggestion: '暂停相关区域继续施工，确认最新版标准后再恢复，并记录影响面。',
    },
    客户: {
      primary: '需求确认不充分',
      scope: '验收口径 / 交付范围',
      detail: '客户侧表达存在反复或不确定，说明需求边界尚未固化，后续可能引发范围变更。',
      suggestion: '将变更点转为确认单，同步工期和成本影响，要求客户限时确认。',
    },
    安全: {
      primary: '作业前置审批缺口',
      scope: '人员安全 / 合规施工',
      detail: '该风险涉及安全检查、审批或作业条件未闭环，若继续推进可能形成高风险操作。',
      suggestion: '在审批和安全复检完成前阻断作业，并同步安全员复核。',
    },
    合规: {
      primary: '资料闭环不完整',
      scope: '审计资料 / 流程合规',
      detail: '该风险与资料缺失、资质过期或流程记录不完整有关，后续可能影响审计追溯。',
      suggestion: '补齐缺失资料并设置到期提醒，超过截止时间自动升级风险等级。',
    },
  };
  return map[risk.type] ?? map.进度;
}

function DetailBlock({ title, body }) {
  return (
    <div className="detail-block">
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
