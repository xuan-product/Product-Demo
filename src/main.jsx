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
  RefreshCcw,
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
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [projectPickerOpen, setProjectPickerOpen] = useState(false);
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
        <section className="hero-card">
          <div className="hero-top">
            <div>
              <p className="eyebrow">观澜 AI Risk Feed</p>
              <button className="project-trigger" type="button" onClick={() => setProjectPickerOpen(true)}>
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
          <button className="icon-button" type="button" onClick={handleRefresh} aria-label="刷新风险">
            <RefreshCcw size={18} className={refreshing ? 'spin' : ''} />
          </button>
        </section>

        <section className="risk-feed">
          {visibleRisks.map((risk) => (
            <RiskCard
              key={risk.id}
              risk={risk}
              action={actions[risk.id]}
              onConfirm={() => markRisk(risk.id, 'confirmed')}
              onDismiss={() => markRisk(risk.id, 'dismissed')}
              onOpen={() => setSelectedRisk(risk)}
            />
          ))}
        </section>

        <BottomDock
          typeFilter={typeFilter}
          levelFilter={levelFilter}
          onTypeChange={setTypeFilter}
          onLevelChange={setLevelFilter}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((value) => !value)}
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

function BottomDock({ typeFilter, levelFilter, onTypeChange, onLevelChange, filtersOpen, onToggleFilters }) {
  return (
    <footer className="bottom-dock">
      {filtersOpen ? (
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
      )}
      <nav className="module-tabs" aria-label="观澜模块导航">
        <button type="button" className="module-tab active">
          <ShieldAlert size={18} />
          <span>风险</span>
        </button>
        <button type="button" className="module-tab">
          <GitBranch size={18} />
          <span>根因</span>
        </button>
        <button type="button" className="module-tab">
          <HeartPulse size={18} />
          <span>情绪</span>
        </button>
        <button type="button" className="module-tab">
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

function DetailBlock({ title, body }) {
  return (
    <div className="detail-block">
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
