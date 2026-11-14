/* DSH Desktop Center: zero-build, factory-CJS client for DSH 0.2.1 Web/Desktop.
 * Uses public DSH panel slots; there is no mutation of other applications. */
window.__ModuleLoader__.load({
  id: 'dsh-desktop-center',
  factory(require) {
    const module = { exports: {} };
    const React = require('react');
    const h = React.createElement;
    const PAGE_ID = 'dsh-desktop-center';
    const URL_OVERVIEW = '/api/dsh-desktop-center/overview';
    const URL_COMPARE = '/api/dsh-desktop-center/comparison';
    const CSS = `
      .sdc-panel{box-sizing:border-box;display:flex;flex-direction:column;width:100%;height:100%;max-height:100dvh;min-height:0;min-width:0}
      .sdc-viewport{flex:1;min-height:0;min-width:0;overflow-y:auto;overscroll-behavior-y:contain;-webkit-app-region:no-drag}
      .sdc{box-sizing:border-box;padding:28px clamp(18px,4vw,48px) 52px;max-width:1400px;margin:0 auto;width:100%;color:inherit;font-family:inherit}
      .sdc *{box-sizing:border-box}.sdc button,.sdc input{font:inherit}.sdc button{cursor:pointer}
      .sdc-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:24px;flex-wrap:wrap}
      .sdc-eyebrow{text-transform:uppercase;font-size:11px;font-weight:650;letter-spacing:.11em;opacity:.58}
      .sdc h1{margin:6px 0 4px;line-height:1.15;letter-spacing:-.045em;font-size:clamp(24px,3.8vw,34px)}
      .sdc p{margin:0;line-height:1.55}.sdc-muted{opacity:.65;font-size:13px}
      .sdc-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:650;background:color-mix(in srgb,currentColor 7%,transparent);white-space:nowrap}
      .sdc-pill[data-tone=good]{color:#139769;background:color-mix(in srgb,#139769 13%,transparent)}
      .sdc-pill[data-tone=warn]{color:#b2781f;background:color-mix(in srgb,#c48a25 12%,transparent)}
      .sdc-pill[data-tone=muted]{opacity:.72}
      .sdc-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:24px}
      .sdc-stat,.sdc-card,.sdc-pane{border:1px solid color-mix(in srgb,currentColor 12%,transparent);border-radius:13px;background:color-mix(in srgb,currentColor 2.5%,transparent)}
      .sdc-stat{padding:18px 20px}.sdc-stat strong{display:block;font-size:29px;letter-spacing:-.045em;line-height:1.18}
      .sdc-stat span{display:block;font-size:12px;opacity:.62;margin-top:9px}
      .sdc-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 18px}
      .sdc-tabs{display:flex;flex-wrap:wrap;gap:3px;border-radius:10px;padding:4px;background:color-mix(in srgb,currentColor 6%,transparent)}
      .sdc-tab{padding:7px 13px;border:0;background:transparent;color:inherit;border-radius:7px;font-size:12px;opacity:.66}
      .sdc-tab[aria-selected=true]{background:var(--sdc-accent,#2e77de);color:#fff;opacity:1}
      .sdc-actions{display:flex;gap:9px;align-items:center}.sdc-field{border:1px solid color-mix(in srgb,currentColor 17%,transparent);border-radius:8px;padding:9px 10px;background:transparent;color:inherit;width:160px;font-size:12px}
      .sdc-btn{border:1px solid color-mix(in srgb,currentColor 18%,transparent);padding:9px 14px;border-radius:8px;background:transparent;color:inherit;font-size:12px;font-weight:600}
      .sdc-btn:disabled{opacity:.45;cursor:wait}.sdc-btn:focus-visible,.sdc-tab:focus-visible,.sdc-field:focus-visible{outline:2px solid #3c88f0;outline-offset:2px}
      .sdc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .sdc-card{padding:20px;min-width:0}.sdc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
      .sdc-name{font-size:15px;font-weight:690;letter-spacing:-.015em}.sdc-kicker{font-size:11px;opacity:.57;margin-top:5px}
      .sdc-list{margin:13px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
      .sdc-list li{font-size:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .sdc-path{opacity:.67;overflow-wrap:anywhere;min-width:0;line-height:1.5}
      .sdc-ind{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.22;display:inline-block;margin-right:7px}
      .sdc-ind[data-on=true]{background:#15a877;opacity:1}
      .sdc-pane{overflow:hidden}.sdc-pane-title{padding:18px 20px;border-bottom:1px solid color-mix(in srgb,currentColor 9%,transparent);font-weight:650;font-size:14px}
      .sdc-scroll{max-width:100%;overflow:auto}.sdc-table{width:100%;border-collapse:collapse;text-align:left;font-size:12px;min-width:630px}
      .sdc-table th{font-size:11px;white-space:nowrap;opacity:.62;font-weight:650}.sdc-table td,.sdc-table th{padding:12px 15px;border-bottom:1px solid color-mix(in srgb,currentColor 8%,transparent)}
      .sdc-table tr:last-child td{border-bottom:0}.sdc-table td:first-child{font-weight:610}
      .sdc-empty{padding:42px 24px;text-align:center;color:inherit}.sdc-empty strong{display:block;font-size:15px;margin-bottom:6px}
      .sdc-foot{font-size:11px;opacity:.6;margin-top:24px;line-height:1.65}
      .sdc-alert{border:1px solid color-mix(in srgb,#db8c20 36%,transparent);border-radius:10px;background:color-mix(in srgb,#db8c20 8%,transparent);padding:14px 16px;font-size:13px;margin:0 0 18px}
      .sdc-alert[data-error=true]{border-color:color-mix(in srgb,#c63c3c 38%,transparent);background:color-mix(in srgb,#c63c3c 8%,transparent)}
      @media(max-width:870px){.sdc-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.sdc-grid{grid-template-columns:1fr}}
      @media(max-width:520px){.sdc{padding:20px 14px 32px}.sdc-stat{padding:14px}.sdc-stat strong{font-size:24px}.sdc-field{width:120px}.sdc-actions{width:100%}.sdc-actions .sdc-field{flex:1}}
      @media(prefers-reduced-motion:reduce){.sdc *{scroll-behavior:auto!important}}
    `;

    function attachStyle() {
      const id = 'dsh-desktop-center-style';
      const existing = document.getElementById(id);
      if (existing) return () => {};
      const style = document.createElement('style');
      style.id = id;
      style.textContent = CSS;
      document.head.appendChild(style);
      return () => style.remove();
    }
    function statusInfo(status) {
      if (status === 'app-found') return { text: '检测到应用', tone: 'good' };
      if (status === 'configuration-found') return { text: '仅发现配置', tone: 'warn' };
      if (status === 'unsupported-os') return { text: '仅支持 macOS', tone: 'muted' };
      return { text: '未检测到', tone: 'muted' };
    }
    function Pill({ label, tone = 'muted' }) {
      return h('span', { className: 'sdc-pill', 'data-tone': tone }, label);
    }
    function Empty({ title, subtitle }) {
      return h('div', { className: 'sdc-empty' },
        h('strong', null, title), h('p', { className: 'sdc-muted' }, subtitle));
    }
    function Card({ desktop }) {
      const state = statusInfo(desktop.status);
      const roots = desktop.skillRoots || [];
      return h('article', { className: 'sdc-card' },
        h('div', { className: 'sdc-head' },
          h('div', null, h('div', { className: 'sdc-name' }, desktop.label),
            h('div', { className: 'sdc-kicker' }, desktop.skills.length + ' 个 Skills · ' + desktop.appPaths.length + ' 个安装位置')),
          h(Pill, { label: state.text, tone: state.tone })),
        h('ul', { className: 'sdc-list' },
          ...desktop.appPaths.map(p => h('li', { key: 'app:' + p }, h('span', { className: 'sdc-path' }, p), h(Pill, { label: '应用' }))),
          ...roots.slice(0, 5).map(root => h('li', { key: 'root:' + root.path },
            h('span', { className: 'sdc-path' }, h('span', { className: 'sdc-ind', 'data-on': String(root.exists) }), root.path, root.scope === 'shared' ? '（共享）' : ''),
            h('span', { className: 'sdc-muted' }, root.exists ? '已发现' : '不存在'))),
          ...(desktop.appPaths.length === 0 && roots.length === 0 ? [h('li', { key: 'none', className: 'sdc-muted' }, '尚无已验证的配置路径')] : [])),
        ...(desktop.notes || []).map((note, i) => h('p', { key: i, className: 'sdc-muted', style: { marginTop: 10 } }, note)));
    }
    function SkillsTable({ desktops, search }) {
      const rows = desktops.flatMap(d => d.skills.map(s => ({ ...s, desktopLabel: d.label, desktopId: d.id })));
      const filtered = rows.filter(s => [s.name, s.desktopLabel, s.description].join(' ').toLowerCase().includes(search));
      if (!filtered.length) return h(Empty, { title: '没有匹配的 Skills', subtitle: '尚未检测到 Skill 包，或请尝试其他搜索词。' });
      return h('div', { className: 'sdc-scroll' },
        h('table', { className: 'sdc-table' },
          h('thead', null, h('tr', null, ...['Skill','Desktop','作用域','文件数','包完整性'].map(t => h('th', { key: t }, t)))),
          h('tbody', null, ...filtered.map((s,i) => h('tr', { key: s.desktopId + ':' + s.root + ':' + i },
            h('td', null, s.name), h('td', null, s.desktopLabel), h('td', null, s.scope),
            h('td', null, String(s.fileCount)),
            h('td', null, h(Pill, { label: s.fingerprintStatus === 'complete' ? '指纹完整' : '未知', tone: s.fingerprintStatus === 'complete' ? 'good' : 'warn' })))))));
    }
    function CompareTable({ rows, desktops, search }) {
      const filtered = rows.filter(r => r.name.toLowerCase().includes(search));
      if (!filtered.length) return h(Empty, { title: '没有差异记录', subtitle: '刷新后可查看不同 Desktop 的 Skill 包状态。' });
      const status = { same: '相同', different: '有差异', missing: '未安装', unknown: '未知', conflict: '冲突' };
      return h('div', { className: 'sdc-scroll' }, h('table', { className: 'sdc-table' },
        h('thead', null, h('tr', null, h('th', null, 'Skill'), ...desktops.map(d => h('th', { key: d.id }, d.label)))),
        h('tbody', null, ...filtered.map(r => h('tr', { key: r.name },
          h('td', null, r.name), ...desktops.map(d => {
            const s = r.byDesktopStatus[d.id] || 'unknown';
            return h('td', { key: d.id }, h(Pill, { label: status[s] || s,
              tone: s === 'same' ? 'good' : s === 'different' || s === 'conflict' ? 'warn' : 'muted' }));
          }))))));
    }
    function DiagnosticTable({ desktops, search }) {
      const rows = desktops.flatMap(d => d.diagnostics.map(x => ({ desktop: d.label, ...x })));
      const filtered = rows.filter(r => JSON.stringify(r).toLowerCase().includes(search));
      if (!filtered.length) return h(Empty, { title: '没有需要处理的扫描诊断', subtitle: '未发现异常不代表所有路径均已验证。' });
      return h('div', { className: 'sdc-scroll' }, h('table', { className: 'sdc-table' },
        h('thead', null, h('tr', null, ...['Desktop','Skill','原因'].map(s => h('th', { key: s }, s)))),
        h('tbody', null, ...filtered.map((d,i) => h('tr', { key: String(i) },
          h('td', null, d.desktop), h('td', null, d.skill || d.root || '—'), h('td', null, d.reason))))));
    }
    function Dashboard() {
      const [overview, setOverview] = React.useState(null);
      const [comparison, setComparison] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState('');
      const [tab, setTab] = React.useState('desktops');
      const [search, setSearch] = React.useState('');
      const refreshId = React.useRef(0);
      React.useEffect(attachStyle, []);
      const reload = React.useCallback(async () => {
        const id = ++refreshId.current;
        setLoading(true); setError('');
        try {
          const [overviewResponse, compareResponse] = await Promise.all([
            fetch(URL_OVERVIEW, { credentials: 'same-origin', cache: 'no-store' }),
            fetch(URL_COMPARE, { credentials: 'same-origin', cache: 'no-store' }),
          ]);
          if (!overviewResponse.ok || !compareResponse.ok) throw new Error('DSH 读取失败：请检查插件和登录状态。');
          const [a, b] = await Promise.all([overviewResponse.json(), compareResponse.json()]);
          if (!a.ok || !b.ok) throw new Error('DSH 扫描未完成，请检查插件日志。');
          if (id === refreshId.current) { setOverview(a.data); setComparison(b.data); }
        } catch (e) { if (id === refreshId.current) setError(e.message || '无法读取数据'); }
        finally { if (id === refreshId.current) setLoading(false); }
      }, []);
      React.useEffect(() => { void reload(); return () => { refreshId.current++; }; }, [reload]);
      const desktops = overview?.desktops || [];
      const query = search.trim().toLowerCase();
      const matching = desktops.filter(d => [d.label, d.id, d.status].join(' ').toLowerCase().includes(query));
      const stat = overview?.summary;
      const tabs = [['desktops','桌面应用'],['skills','Skills 清单'],['diff','跨端差异'],['diagnostics','诊断']];
      return h('div', { className: 'sdc-panel' },
        h('div', { className: 'sdc-viewport', tabIndex: 0, role: 'region', 'aria-label': 'Desktop Center 滚动区域' },
          h('main', { className: 'sdc', 'aria-label': 'Desktop Center 管理面板' },
            h('header', { className: 'sdc-hero' },
              h('div', null, h('div', { className: 'sdc-eyebrow' }, 'DSH / DESKTOP CENTER'),
                h('h1', null, 'Desktop Center'),
                h('p', { className: 'sdc-muted' }, '统一查看桌面应用、Skills 与跨应用配置差异。')),
              h(Pill, { label: 'V0.3 · 只读模式', tone: 'good' })),
            h('section', { className: 'sdc-stats', 'aria-label': '扫描统计' },
              ...[
                [stat?.desktopCount ?? '—', 'Desktop 目标'],
                [stat?.installedAppCount ?? '—', '发现应用的目标'],
                [stat?.skillOccurrences ?? '—', 'Skills 扫描记录'],
                [stat?.diagnosticCount ?? '—', '扫描诊断'],
              ].map(([n,label]) => h('div', { className: 'sdc-stat', key: label }, h('strong', null, String(n)), h('span', null, label)))),
            h('div', { className: 'sdc-toolbar' },
              h('div', { className: 'sdc-tabs', role: 'tablist', 'aria-label': '选择管理视图' },
                ...tabs.map(([key,label]) => h('button', { type: 'button', key, role: 'tab', className: 'sdc-tab',
                  'aria-selected': tab === key, onClick: () => { setTab(key); setSearch(''); } }, label))),
              h('div', { className: 'sdc-actions' },
                h('input', { className: 'sdc-field', type: 'search', value: search, onChange: e => setSearch(e.target.value),
                  'aria-label': '搜索当前视图', placeholder: '搜索...' }),
                h('button', { type: 'button', className: 'sdc-btn', disabled: loading,
                  onClick: () => { void reload(); } }, loading ? '扫描中…' : '重新扫描'))),
            error ? h('div', { className: 'sdc-alert', 'data-error': 'true', role: 'alert' }, error) : null,
            overview && overview.platform !== 'darwin' ? h('div', { className: 'sdc-alert' }, '当前 Host 不是 macOS，只提供有限的兼容性信息。') : null,
            loading && !overview ? h(Empty, { title: '正在扫描本地 Desktop', subtitle: '仅读取已知的应用与 Skills 路径，不会更改任何配置。' }) : null,
            !overview ? null : tab === 'desktops' ?
              h('section', { className: 'sdc-grid', 'aria-label': '桌面应用列表' },
                ...matching.map(d => h(Card, { key: d.id, desktop: d })),
                ...(matching.length ? [] : [h(Empty, { key: 'empty', title: '没有匹配的应用', subtitle: '尝试其他关键词。' })])) :
              h('section', { className: 'sdc-pane' },
                h('div', { className: 'sdc-pane-title' }, tab === 'skills' ? 'Skills 资源清单' : tab === 'diff' ? '跨 Desktop Skill 包对比' : '安全诊断'),
                tab === 'skills' ? h(SkillsTable, { desktops, search: query }) :
                tab === 'diff' ? h(CompareTable, { rows: comparison?.matrix || [], desktops, search: query }) :
                h(DiagnosticTable, { desktops, search: query })),
            h('footer', { className: 'sdc-foot' },
              '当前版本不会进行安装、配置同步、签到或账号操作。目录存在不代表应用正在运行或已经登录。',
              overview ? h('span', null, ' 最近扫描：' + new Date(overview.scannedAt).toLocaleString()) : null))));
    }
    function SidebarIcon({ size = 18 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('rect', { x: 3, y: 4, width: 18, height: 13, rx: 2 }),
        h('path', { d: 'M8 21h8M12 17v4M7 9h10M7 12h7' }));
    }
    const inject = ['slots', 'layout'];
    function apply(ctx) {
      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PAGE_ID }, Dashboard));
      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist',
        id: PAGE_ID, order: 15, label: 'Desktop Center' }, SidebarIcon));
    }
    module.exports.apply = apply;
    module.exports.inject = inject;
    module.exports.name = 'dsh-desktop-center-ui';
    return module.exports;
  },
});
