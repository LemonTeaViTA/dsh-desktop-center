/* DSH Desktop Center: zero-build, factory-CJS client for DSH 0.2.1 Web/Desktop.
 * Uses public DSH panel slots; there is no mutation of other applications. */
window.__ModuleLoader__.load({
  id: 'dsh-desktop-center',
  factory(require) {
    const module = { exports: {} };
    const React = require('react');
    const h = React.createElement;
    const PAGE_ID = 'dsh-desktop-center';
    const URL_MANAGE_MCP = '/api/dsh-desktop-center/mcp/manage';
    const URL_MANAGE_SKILL = '/api/dsh-desktop-center/skills/manage';
    const CLIENT_VERSION = '0.3.0-rc.20';
    const URL_OVERVIEW = '/api/dsh-desktop-center/overview';
    const URL_COMPARE = '/api/dsh-desktop-center/comparison';
    const CSS = `
      .sdc-panel{box-sizing:border-box;display:flex;flex-direction:column;width:100%;height:100%;max-height:100dvh;min-height:0;min-width:0}
      .sdc-viewport{flex:1;min-height:0;min-width:0;overflow-y:auto;overscroll-behavior-y:contain;container-type:inline-size;-webkit-app-region:no-drag}
      .sdc{box-sizing:border-box;padding:28px clamp(18px,4vw,48px) 52px;max-width:1400px;margin:0 auto;width:100%;color:inherit;font-family:inherit}
      .sdc *{box-sizing:border-box}.sdc button,.sdc input{font:inherit}.sdc button{cursor:pointer}
      .sdc-hero{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;flex-wrap:wrap}
      .sdc h1{margin:0;line-height:1.2;letter-spacing:-.03em;font-size:clamp(24px,3.8vw,32px)}
      .sdc p{margin:0;line-height:1.55}.sdc-muted{opacity:.65;font-size:13px}
      .sdc-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:650;background:color-mix(in srgb,currentColor 7%,transparent);white-space:nowrap}
      .sdc-pill[data-tone=good]{background:color-mix(in srgb,#139769 13%,transparent)}
      .sdc-pill[data-tone=warn]{background:color-mix(in srgb,#c48a25 13%,transparent)}
      .sdc-pill[data-tone=good]::before,.sdc-pill[data-tone=warn]::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--sdc-pill-dot)}
      .sdc-pill[data-tone=good]{--sdc-pill-dot:#139769}.sdc-pill[data-tone=warn]{--sdc-pill-dot:#c48a25}
      .sdc-pill[data-tone=muted]{opacity:.72}
      .sdc-card,.sdc-pane{border:1px solid color-mix(in srgb,currentColor 15%,transparent);border-radius:12px}
      .sdc-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 18px}
      .sdc-tabs{display:flex;flex-wrap:wrap;gap:3px;border-radius:10px;padding:4px;background:color-mix(in srgb,currentColor 6%,transparent)}
      .sdc-tab{padding:7px 13px;border:0;background:transparent;color:inherit;border-radius:7px;font-size:12px;opacity:.66}
      .sdc-tab[aria-current=page]{background:var(--sdc-accent,#245eb8);color:#fff;opacity:1}
      .sdc-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-width:0}.sdc-field{border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:8px;padding:9px 10px;background:transparent;color:inherit;width:160px;max-width:100%;min-width:0;font-size:12px}
      .sdc-btn{border:1px solid color-mix(in srgb,currentColor 18%,transparent);padding:9px 14px;border-radius:8px;background:transparent;color:inherit;font-size:12px;font-weight:600}
      .sdc-btn:disabled{opacity:.45;cursor:default}.sdc :focus-visible{outline:2px solid #3c88f0;outline-offset:2px}
      .sdc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .sdc-card{padding:20px;min-width:0}.sdc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
      .sdc-name{margin:0;font-size:16px;font-weight:650}.sdc-kicker{font-size:13px;margin-top:4px}
      .sdc-list{margin:13px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
      .sdc-list li{font-size:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .sdc-path{opacity:.67;overflow-wrap:anywhere;min-width:0;line-height:1.5}
      .sdc-ind{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.22;display:inline-block;margin-right:7px}
      .sdc-ind[data-on=true]{background:#15a877;opacity:1}
      .sdc-pane-title{padding:16px 20px;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent);font-weight:650;font-size:16px}
      .sdc-pane-title h2{margin:8px 0;font-size:22px}
      .sdc-detail-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
      .sdc-details{padding:12px 20px}.sdc-details summary{cursor:pointer;width:fit-content;font-size:14px}
      .sdc-skill-group{padding:16px 20px;min-width:0}
      .sdc-skill-group+.sdc-skill-group{border-top:1px solid color-mix(in srgb,currentColor 12%,transparent)}
      .sdc-skill-heading{display:flex;align-items:baseline;gap:8px 12px;flex-wrap:wrap;margin-bottom:8px}
      .sdc-skill-heading h2,.sdc-skill-heading h3{margin:0;font-size:16px}
      .sdc-skill-list{list-style:none;margin:0;padding:0}
      .sdc-skill-item{padding:12px 0;overflow-wrap:anywhere}
      .sdc-skill-item+.sdc-skill-item{border-top:1px solid color-mix(in srgb,currentColor 9%,transparent)}
      .sdc-skill-item h3{font-size:14px;margin:0}
      .sdc-skill-item p{max-width:75ch;margin-top:4px;font-size:13px}
      .sdc-skill-item details{margin-top:6px;font-size:12px}
      .sdc-skill-item summary{width:fit-content;cursor:pointer}
      .sdc-skill-item details ul{margin:6px 0 0;padding-inline-start:20px}
      .sdc-batch-target{display:inline-flex;align-items:center;gap:6px;margin-inline-end:16px}
      .sdc-mcp-form{display:grid;gap:8px;justify-items:start;margin-block:12px}.sdc-mcp-form label{display:grid;gap:4px;width:100%;max-width:32rem}.sdc-mcp-form .sdc-field{width:100%}
      .sdc-scroll{max-width:100%;overflow:auto}.sdc-table{width:100%;border-collapse:collapse;text-align:left;font-size:12px;min-width:400px}
      .sdc-table th{font-size:11px;white-space:nowrap;opacity:.62;font-weight:650}.sdc-table td,.sdc-table th{padding:12px 15px;border-bottom:1px solid color-mix(in srgb,currentColor 8%,transparent)}
      .sdc-table tr:last-child td{border-bottom:0}.sdc-table td:first-child{font-weight:610}
      .sdc-empty{padding:42px 24px;text-align:center;color:inherit}.sdc-empty strong{display:block;font-size:15px;margin-bottom:6px}
      .sdc-foot{font-size:11px;opacity:.6;margin-top:24px;line-height:1.65}
      .sdc-alert{border:1px solid color-mix(in srgb,#db8c20 36%,transparent);border-radius:10px;background:color-mix(in srgb,#db8c20 8%,transparent);padding:14px 16px;font-size:13px;margin:0 0 18px}
      .sdc-alert[data-error=true]{border-color:color-mix(in srgb,#c63c3c 38%,transparent);background:color-mix(in srgb,#c63c3c 8%,transparent)}
      @container(max-width:660px){.sdc-grid{grid-template-columns:1fr}}
      @container(max-width:460px){.sdc{padding:16px 12px 32px}.sdc-card,.sdc-pane-title,.sdc-skill-group,.sdc-details{padding-inline:12px}.sdc-toolbar>.sdc-actions{width:100%}.sdc-toolbar .sdc-field{flex:1}.sdc-alert{padding-inline:10px}}
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
      return h(
        'div',
        { className: 'sdc-empty' },
        h('strong', null, title),
        h('p', { className: 'sdc-muted' }, subtitle),
      );
    }
    function Card({ desktop, onOpen }) {
      const state = statusInfo(desktop.status);
      const count = desktop.skillRoots.length ? desktop.skills.length + ' 个 Skills' : '';
      const serviceCount =
        desktop.mcp?.status === 'read' ? desktop.mcp.servers.length + ' 个 MCP 服务' : '';
      return h(
        'article',
        { className: 'sdc-card' },
        h(
          'div',
          { className: 'sdc-head' },
          h(
            'div',
            null,
            h('h2', { className: 'sdc-name' }, desktop.label),
            count || serviceCount
              ? h(
                  'p',
                  { className: 'sdc-kicker sdc-muted' },
                  [count, serviceCount].filter(Boolean).join(' · '),
                )
              : null,
          ),
          h(Pill, { label: state.text, tone: state.tone }),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'sdc-btn',
            id: 'sdc-open-' + desktop.id,
            'aria-label': '查看 ' + desktop.label + ' 详情',
            onClick: onOpen,
          },
          '查看详情',
        ),
      );
    }
    function DesktopPaths({ desktop }) {
      const roots = desktop.skillRoots || [];
      return h(
        'details',
        { className: 'sdc-details' },
        h('summary', null, '应用与扫描路径'),
        h(
          'ul',
          { className: 'sdc-list' },
          ...desktop.appPaths.map((p) =>
            h(
              'li',
              { key: 'app:' + p },
              h('span', { className: 'sdc-path' }, p),
              h(Pill, { label: '应用' }),
            ),
          ),
          ...roots.map((root) =>
            h(
              'li',
              { key: 'root:' + root.path },
              h(
                'span',
                { className: 'sdc-path' },
                h('span', { className: 'sdc-ind', 'data-on': String(root.exists) }),
                root.path,
                root.scope === 'shared' ? '（共享）' : '',
              ),
              h(
                'span',
                { className: 'sdc-muted' },
                root.error ? '读取失败' : root.exists ? '已发现' : '未找到',
              ),
            ),
          ),
          ...(desktop.appPaths.length === 0 && roots.length === 0
            ? [h('li', { key: 'none', className: 'sdc-muted' }, '尚无已验证的配置路径')]
            : []),
        ),
        ...(desktop.notes || []).map((note) => h('p', { key: note, className: 'sdc-muted' }, note)),
      );
    }
    const skillIssueLabels = {
      HIDDEN_CONTENT_UNVERIFIED: '隐藏文件未参与比较',
      NESTED_SYMLINK_UNVERIFIED: '跳过了包内的符号链接',
      PACKAGE_PATH_ESCAPE: '跳过了指向包目录外的路径',
      MAX_DEPTH_EXCEEDED: '目录层级超出扫描上限',
      PACKAGE_LIMIT_EXCEEDED: '文件大小或数量超出扫描上限',
      MANIFEST_OUTSIDE_SKILL: 'SKILL.md 指向包目录外',
      OUTSIDE_HOME_SYMLINK: 'Skill 目录指向用户主目录外',
      INVALID_OR_TOO_LARGE: 'SKILL.md 格式不受支持或超出大小上限',
      EACCES: '没有读取权限',
      EPERM: '系统阻止了读取',
    };
    function SkillsList({ desktops, search, showDesktop = true, onRemove }) {
      const groups = desktops
        .map((desktop) => ({
          desktop,
          skills: desktop.skills.filter((skill) =>
            [skill.name, skill.directoryName, skill.description, desktop.label].some((value) =>
              value?.toLowerCase().includes(search),
            ),
          ),
        }))
        .filter(
          ({ desktop, skills }) =>
            !showDesktop ||
            !search ||
            skills.length ||
            desktop.label.toLowerCase().includes(search),
        );
      if (!groups.length)
        return h(Empty, {
          title: '没有匹配的 Skills',
          subtitle: '试试 Skill 名称、简介或桌面应用名称。',
        });
      return groups.map(({ desktop, skills }) => {
        const headingId = 'sdc-skills-' + desktop.id;
        const emptyMessage =
          desktop.skills.length && search
            ? '没有匹配的 Skills。'
            : !desktop.skillRoots.length
              ? '当前未覆盖此应用的 Skills 路径。'
              : desktop.skillRoots.some((root) => root.error) || desktop.diagnostics.length
                ? 'Skills 扫描不完整，请查看诊断。'
                : desktop.skillRoots.some((root) => root.exists)
                  ? '已扫描的目录中没有 Skills。'
                  : '未找到已知的 Skills 目录。';
        return h(
          'section',
          { key: desktop.id, className: 'sdc-skill-group', 'aria-labelledby': headingId },
          h(
            'div',
            { className: 'sdc-skill-heading' },
            h('h2', { id: headingId }, showDesktop ? desktop.label : 'Skills'),
            skills.length ? h('span', { className: 'sdc-muted' }, skills.length + ' 条记录') : null,
          ),
          skills.length
            ? h(
                'ul',
                { className: 'sdc-skill-list' },
                ...skills.map((skill) => {
                  const issues = desktop.diagnostics.filter(
                    (issue) => issue.root === skill.root && issue.skill === skill.directoryName,
                  );
                  const incomplete = skill.fingerprintStatus !== 'complete';
                  return h(
                    'li',
                    { key: skill.file, className: 'sdc-skill-item' },
                    h('h3', null, skill.name),
                    !showDesktop && skill.scope === 'shared'
                      ? h('p', { className: 'sdc-muted' }, '共享 Skills 目录')
                      : null,
                    h('p', { className: 'sdc-muted' }, skill.description?.trim() || '暂无简介'),
                    onRemove && skill.scope === 'user'
                      ? h(
                          'button',
                          {
                            type: 'button',
                            className: 'sdc-btn',
                            onClick: () => onRemove(skill.directoryName),
                            'aria-label': '卸载 ' + skill.name,
                          },
                          '卸载',
                        )
                      : null,
                    incomplete || issues.length
                      ? h(
                          'details',
                          null,
                          h('summary', null, incomplete ? '部分内容无法比较' : '查看扫描异常'),
                          issues.length
                            ? h(
                                'ul',
                                null,
                                ...issues.map(({ reason }, index) =>
                                  h(
                                    'li',
                                    { key: index },
                                    skillIssueLabels[reason] ||
                                      '部分文件无法读取（' + reason + '）',
                                  ),
                                ),
                              )
                            : null,
                        )
                      : null,
                  );
                }),
              )
            : h('p', { className: 'sdc-muted' }, emptyMessage),
        );
      });
    }
    function CompareTable({ rows, desktops, search }) {
      const filtered = rows.filter((r) => r.name.toLowerCase().includes(search));
      if (!filtered.length)
        return h(Empty, {
          title: '没有差异记录',
          subtitle: '刷新后可查看不同 Desktop 的 Skill 包状态。',
        });
      const status = {
        same: '相同',
        different: '有差异',
        missing: '未扫描到',
        unknown: '无法比较',
        conflict: '冲突',
      };
      return h(
        'div',
        { className: 'sdc-scroll', role: 'region', tabIndex: 0, 'aria-label': 'Skills 差异对比表' },
        h(
          'table',
          { className: 'sdc-table' },
          h(
            'thead',
            null,
            h(
              'tr',
              null,
              h('th', null, 'Skill'),
              ...desktops.map((d) => h('th', { key: d.id }, d.label)),
            ),
          ),
          h(
            'tbody',
            null,
            ...filtered.map((r) =>
              h(
                'tr',
                { key: r.name },
                h('td', null, r.name),
                ...desktops.map((d) => {
                  const s = r.byDesktopStatus[d.id] || 'unknown';
                  const scanFailed =
                    d.skillRoots?.some((root) => root.error) ||
                    d.diagnostics?.some((issue) => !issue.skill);
                  const label =
                    s !== 'unknown'
                      ? status[s] || s
                      : !d.skillRoots?.length
                        ? '未覆盖 Skills'
                        : scanFailed
                          ? '扫描不完整'
                          : r.byDesktop?.[d.id]?.length
                            ? '包内容未完整核验'
                            : '未能确认此 Skill';
                  return h(
                    'td',
                    { key: d.id },
                    h(Pill, {
                      label,
                      tone:
                        s === 'same'
                          ? 'good'
                          : s === 'different' || s === 'conflict'
                            ? 'warn'
                            : 'muted',
                    }),
                  );
                }),
              ),
            ),
          ),
        ),
      );
    }
    function DiagnosticTable({ desktops, search }) {
      const rows = desktops.flatMap((desktop) => [
        ...desktop.diagnostics.map((issue) => [
          desktop.label,
          issue.skill ? 'Skills · ' + issue.skill : 'Skills 目录',
          skillIssueLabels[issue.reason] || '读取失败（' + issue.reason + '）',
        ]),
        ...desktop.skillRoots
          .filter((root) => root.error)
          .map((root) => [
            desktop.label,
            root.scope === 'shared' ? '共享 Skills 目录' : '用户 Skills 目录',
            skillIssueLabels[root.error] || '读取失败（' + root.error + '）',
          ]),
        ...(desktop.mcp?.status === 'unreadable'
          ? [[desktop.label, 'MCP', '无法读取或解析用户配置']]
          : []),
        ...(desktop.plugins?.status === 'unreadable'
          ? [[desktop.label, '用户插件 / 扩展', '无法读取或识别登记格式']]
          : []),
      ]);
      const filtered = rows.filter((row) =>
        row.some((value) => value.toLowerCase().includes(search)),
      );
      const resourceStatus = (resource, entries) => {
        if (!resource) return '未覆盖';
        if (resource.status === 'unreadable') return '读取失败';
        if (resource.status === 'missing') return '未找到配置文件';
        return entries.length ? '已读取' : '无记录';
      };
      const coverage = desktops
        .map((desktop) => [
          desktop.label,
          !desktop.skillRoots.length
            ? '未覆盖'
            : desktop.diagnostics.length || desktop.skillRoots.some((root) => root.error)
              ? '扫描不完整'
              : !desktop.skillRoots.some((root) => root.exists)
                ? '未找到目录'
                : desktop.skills.length
                  ? '已读取'
                  : '无记录',
          resourceStatus(desktop.mcp, desktop.mcp?.servers),
          resourceStatus(desktop.plugins, desktop.plugins?.entries),
        ])
        .filter((row) => row.some((value) => value.toLowerCase().includes(search)));
      const table = (label, headings, data) =>
        h(
          'div',
          { className: 'sdc-scroll', role: 'region', tabIndex: 0, 'aria-label': label },
          h(
            'table',
            { className: 'sdc-table' },
            h(
              'thead',
              null,
              h(
                'tr',
                null,
                ...headings.map((title) => h('th', { key: title, scope: 'col' }, title)),
              ),
            ),
            h(
              'tbody',
              null,
              ...data.map((row, index) =>
                h(
                  'tr',
                  { key: index },
                  ...row.map((value, column) => h('td', { key: column }, value)),
                ),
              ),
            ),
          ),
        );
      return h(
        React.Fragment,
        null,
        filtered.length
          ? table('扫描问题', ['Desktop', '扫描项目', '原因'], filtered)
          : h(Empty, { title: search ? '没有匹配的扫描诊断' : '没有需要处理的扫描诊断' }),
        coverage.length
          ? h(
              'details',
              { className: 'sdc-details' },
              h('summary', null, '查看各应用的扫描范围'),
              table('应用扫描范围', ['Desktop', 'Skills', 'MCP', '用户插件 / 扩展'], coverage),
            )
          : null,
      );
    }
    function McpList({ desktop, reload, enabled, heading = 'MCP', search = '' }) {
      const { mcp } = desktop;
      const headingId = 'sdc-mcp-heading-' + desktop.id;
      const matching =
        mcp?.servers.filter((server) => server.name.toLowerCase().includes(search)) ?? [];
      const messages = {
        missing: '未找到该应用的用户配置文件。',
        unreadable: '无法读取或解析该应用的用户配置。',
      };
      return h(
        'section',
        { className: 'sdc-skill-group', 'aria-labelledby': headingId },
        h(
          'div',
          { className: 'sdc-skill-heading' },
          h('h2', { id: headingId, tabIndex: -1 }, heading),
        ),
        enabled &&
          managedSkillTargets.has(desktop.id) &&
          typeof window.__DSH_DIRECTORY_PICKER__?.pick === 'function'
          ? h(McpManagement, { desktops: [desktop], reload })
          : null,
        !mcp
          ? h('p', { className: 'sdc-muted' }, '尚未覆盖此应用的 MCP 配置。')
          : mcp.status !== 'read'
            ? h('p', { className: 'sdc-muted' }, messages[mcp.status])
            : mcp.servers.length === 0
              ? h('p', { className: 'sdc-muted' }, '用户配置中没有 MCP 服务。')
              : !matching.length
                ? h('p', { className: 'sdc-muted' }, '没有匹配的 MCP 服务。')
                : h(
                    'ul',
                    { className: 'sdc-skill-list' },
                    ...matching.map((server) =>
                      h(
                        'li',
                        { className: 'sdc-skill-item', key: server.name },
                        h(
                          'div',
                          { className: 'sdc-skill-heading' },
                          h('h3', null, server.name),
                          h(
                            'span',
                            { className: 'sdc-muted' },
                            server.enabled === false ? '配置中已停用' : '已配置',
                          ),
                        ),
                      ),
                    ),
                  ),
      );
    }
    const mcpManagementErrors = {
      CONFLICT: '服务同名，或配置刚被修改。请重新扫描，再核对目标。',
      NOT_FOUND: '未找到应用配置目录或服务。',
      FORBIDDEN: '无法写入用户配置，请检查权限。',
      INVALID_REQUEST: '请检查服务名称和传输配置。',
      INVALID_SETTINGS: '无法安全更新当前配置，请先在 Qoder 中检查配置文件。',
      MANAGEMENT_FAILED: '无法更新 MCP 配置。',
    };

    function McpManagement({ desktops, reload, batch = false }) {
      const [editing, setEditing] = React.useState(false);
      const [name, setName] = React.useState('');
      const [configText, setConfigText] = React.useState('');
      const [removeName, setRemoveName] = React.useState('');
      const [pending, setPending] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [feedback, setFeedback] = React.useState('');
      const [results, setResults] = React.useState([]);
      const confirmation = React.useRef(null);
      React.useEffect(() => {
        if (pending && !busy) confirmation.current?.focus();
      }, [pending, busy]);
      const hasServer = (desktop, serverName) =>
        desktop.mcp?.servers.some((server) => server.name === serverName);
      const serverNames = [
        ...new Set(
          desktops.flatMap((desktop) => desktop.mcp?.servers.map((server) => server.name) ?? []),
        ),
      ].sort();

      const prepare = (operation) => {
        const targets = desktops.filter(
          (desktop) => operation.action === 'add' || hasServer(desktop, operation.name),
        );
        setFeedback('');
        setResults([]);
        setPending({ operation, targets, selected: batch ? [] : targets });
      };
      const reviewAdd = (event) => {
        event.preventDefault();
        try {
          const config = JSON.parse(configText);
          if (!config || typeof config !== 'object' || Array.isArray(config)) throw Error();
          prepare({ action: 'add', name: name.trim(), config });
        } catch {
          setFeedback('请输入一个有效的 JSON 配置对象。');
        }
      };
      const submit = async () => {
        setBusy(true);
        try {
          const attempts = await Promise.all(
            pending.selected.map((target) =>
              submitManagementOperation(
                URL_MANAGE_MCP,
                mcpManagementErrors,
                pending.operation,
                target,
              ),
            ),
          );
          setResults((previous) => [
            ...previous.filter(
              (result) => !attempts.some((next) => next.target.id === result.target.id),
            ),
            ...attempts,
          ]);
          const retry = attempts
            .filter((result) => result.error && !result.uncertain)
            .map((result) => result.target);
          setPending(
            batch && retry.length
              ? { operation: pending.operation, targets: retry, selected: retry }
              : null,
          );
          if (!retry.length || batch) {
            setEditing(false);
            setName('');
            setConfigText('');
            setRemoveName('');
          }
          await reload();
        } finally {
          setBusy(false);
        }
      };
      const toggleTarget = (target, checked) =>
        setPending((current) => ({
          ...current,
          selected: checked
            ? [...current.selected, target]
            : current.selected.filter((item) => item.id !== target.id),
        }));
      return h(
        'div',
        { 'aria-label': batch ? '批量管理用户 MCP' : '管理用户 MCP' },
        h(
          'div',
          { className: 'sdc-actions' },
          h(
            'button',
            {
              type: 'button',
              className: 'sdc-btn',
              disabled: busy || Boolean(pending),
              onClick: () => {
                setEditing(!editing);
                setConfigText('');
                setFeedback('');
              },
            },
            editing ? '收起添加表单' : '添加 MCP 服务',
          ),
          h(
            'select',
            {
              className: 'sdc-field',
              'aria-label': '选择要移除的 MCP 服务',
              value: removeName,
              disabled: busy || Boolean(pending) || !serverNames.length,
              onChange: (event) => setRemoveName(event.target.value),
            },
            h('option', { value: '' }, '选择要移除的服务'),
            ...serverNames.map((server) => h('option', { value: server, key: server }, server)),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'sdc-btn',
              disabled: busy || Boolean(pending) || !serverNames.includes(removeName),
              onClick: () => prepare({ action: 'remove', name: removeName }),
            },
            '移除 MCP 服务',
          ),
        ),
        editing && !pending
          ? h(
              'form',
              { className: 'sdc-mcp-form', onSubmit: reviewAdd },
              h(
                'label',
                null,
                '服务名称',
                h('input', {
                  className: 'sdc-field',
                  required: true,
                  maxLength: 128,
                  value: name,
                  onChange: (event) => setName(event.target.value),
                }),
              ),
              h(
                'label',
                null,
                '单个服务的 JSON 配置',
                h('textarea', {
                  className: 'sdc-field',
                  required: true,
                  rows: 4,
                  maxLength: 32768,
                  value: configText,
                  onChange: (event) => setConfigText(event.target.value),
                  placeholder: '{"type":"streamable-http","url":"https://example.com/mcp"}',
                }),
              ),
              h(
                'button',
                { type: 'submit', className: 'sdc-btn', disabled: !name.trim() || busy },
                '核对添加',
              ),
            )
          : null,
        pending
          ? h(
              'div',
              { className: 'sdc-alert' },
              h(
                'p',
                { className: 'sdc-path' },
                (pending.operation.action === 'add' ? '添加 ' : '移除 ') + pending.operation.name,
              ),
              batch
                ? h(
                    'fieldset',
                    { disabled: busy },
                    h('legend', null, '目标应用'),
                    ...pending.targets.map((target) =>
                      h(
                        'label',
                        { key: target.id, className: 'sdc-batch-target' },
                        h('input', {
                          type: 'checkbox',
                          checked: pending.selected.some((item) => item.id === target.id),
                          onChange: (event) => toggleTarget(target, event.target.checked),
                        }),
                        target.label,
                      ),
                    ),
                  )
                : h('p', null, pending.targets[0].label),
              h(
                'button',
                {
                  type: 'button',
                  className: 'sdc-btn',
                  ref: confirmation,
                  disabled: busy || !pending.selected.length,
                  onClick: () => void submit(),
                },
                busy ? '处理中…' : results.length ? '重试失败目标' : '确认 MCP 操作',
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'sdc-btn',
                  disabled: busy,
                  onClick: () => setPending(null),
                },
                '取消',
              ),
            )
          : null,
        feedback ? h('p', { role: 'alert' }, feedback) : null,
        results.length
          ? h(
              'ul',
              { className: 'sdc-skill-list', role: 'status' },
              ...results.map((result) =>
                h(
                  'li',
                  { key: result.target.id, className: 'sdc-path' },
                  result.target.label +
                    ' · ' +
                    (result.error || '用户配置已更新。请在 Qoder 的连接器页面刷新。'),
                ),
              ),
            )
          : null,
      );
    }

    function McpOverview({ desktops, search, reload, enabled }) {
      const targets = desktops.filter((desktop) => managedSkillTargets.has(desktop.id));
      const canManage =
        enabled &&
        typeof window.__DSH_DIRECTORY_PICKER__?.pick === 'function' &&
        targets.length > 0;
      const items = desktops.filter(
        (desktop) =>
          desktop.label.toLowerCase().includes(search) ||
          desktop.mcp?.servers.some((server) => server.name.toLowerCase().includes(search)),
      );
      return h(
        React.Fragment,
        null,
        canManage
          ? h(
              'section',
              { className: 'sdc-skill-group', 'aria-label': '批量管理 MCP' },
              h('h3', null, '批量管理 MCP'),
              h(McpManagement, { desktops: targets, reload, batch: true }),
            )
          : null,
        items.length
          ? items.map((desktop) => {
              const matchesDesktop = desktop.label.toLowerCase().includes(search);
              return h(McpList, {
                key: desktop.id,
                desktop,
                heading: desktop.label,
                search: matchesDesktop ? '' : search,
              });
            })
          : h(Empty, { title: '没有匹配的 MCP 服务', subtitle: '试试服务名称或桌面应用名称。' }),
      );
    }
    function PluginList({ plugins, configured, extensions, search }) {
      const matching =
        plugins?.entries.filter((entry) => entry.name.toLowerCase().includes(search)) ?? [];
      const messages = {
        missing: '未找到此应用的用户插件登记文件。',
        unreadable: '无法读取或识别此应用的插件登记格式。',
      };
      return h(
        'section',
        { className: 'sdc-skill-group', 'aria-labelledby': 'sdc-plugin-heading' },
        h(
          'div',
          { className: 'sdc-skill-heading' },
          h(
            'h2',
            { id: 'sdc-plugin-heading', tabIndex: -1 },
            configured ? '用户插件配置' : extensions ? '用户扩展' : '用户插件',
          ),
        ),
        !plugins
          ? h('p', { className: 'sdc-muted' }, '尚未覆盖此应用的插件清单。')
          : plugins.status !== 'read'
            ? h('p', { className: 'sdc-muted' }, messages[plugins.status])
            : !plugins.entries.length
              ? h(
                  'p',
                  { className: 'sdc-muted' },
                  configured ? '没有用户插件配置记录。' : '没有用户插件安装记录。',
                )
              : !matching.length
                ? h('p', { className: 'sdc-muted' }, '没有匹配的插件或扩展。')
                : h(
                    'ul',
                    { className: 'sdc-skill-list' },
                    ...matching.map((entry, index) =>
                      h(
                        'li',
                        { className: 'sdc-skill-item', key: index },
                        h(
                          'div',
                          { className: 'sdc-skill-heading' },
                          h('h3', null, entry.name),
                          entry.version
                            ? h('span', { className: 'sdc-muted' }, entry.version)
                            : null,
                          typeof entry.enabled === 'boolean'
                            ? h(
                                'span',
                                { className: 'sdc-muted' },
                                entry.enabled ? '配置中已启用' : '配置中已停用',
                              )
                            : null,
                        ),
                      ),
                    ),
                  ),
      );
    }
    const skillManagementErrors = {
      CONFLICT: '目标目录存在同名 Skill，或该 Skill 正在处理。',
      NOT_FOUND: '来源目录、SKILL.md 或目标 Skill 不存在。',
      FORBIDDEN: 'DSH 无法写入该位置，请检查访问权限。',
      INVALID_REQUEST: 'Skill 目录名须以英文字母或数字开头，可包含字母、数字、点、下划线和连字符。',
      MANAGEMENT_FAILED: '操作失败。请检查目录及文件格式，或重新扫描核对结果。',
    };

    const managedSkillTargets = new Set(['qoder-global', 'qoder-cn']);
    const hasLocalSkill = (desktop, name) =>
      desktop.skills.some((skill) => skill.scope === 'user' && skill.directoryName === name);

    async function submitManagementOperation(url, errors, operation, target) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...operation, target: target.id }),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          return { target, error: errors[result.error] || errors.MANAGEMENT_FAILED };
        }
        return { target, backup: result.data.backup };
      } catch {
        return { target, error: '未收到操作结果，请重新扫描核对后再重试。', uncertain: true };
      }
    }

    function DesktopSkills({ desktops, search, reload, enabled, batch = false }) {
      const [pending, setPending] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [feedback, setFeedback] = React.useState(null);
      const [results, setResults] = React.useState([]);
      const [removeName, setRemoveName] = React.useState('');
      const confirmButton = React.useRef(null);
      React.useEffect(() => {
        if (pending) confirmButton.current?.focus();
      }, [pending]);
      const picker = window.__DSH_DIRECTORY_PICKER__;
      const targets = desktops.filter((desktop) => managedSkillTargets.has(desktop.id));
      const canManage = enabled && typeof picker?.pick === 'function' && targets.length > 0;
      const localNames = [
        ...new Set(
          targets.flatMap((target) =>
            target.skills
              .filter((skill) => skill.scope === 'user')
              .map((skill) => skill.directoryName),
          ),
        ),
      ].sort();

      const prepare = (operation) => {
        setFeedback(null);
        setResults([]);
        const eligible = targets.filter(
          (target) => operation.action === 'install' || hasLocalSkill(target, operation.name),
        );
        if (eligible.length) setPending({ operation, targets: eligible, selected: eligible });
      };
      const requestInstall = async () => {
        setBusy(true);
        setFeedback(null);
        try {
          const source = await picker.pick();
          if (source)
            prepare({
              action: 'install',
              name: source.split('/').filter(Boolean).pop() || '',
              source,
            });
        } catch {
          setFeedback('无法打开本地目录选择器。');
        } finally {
          setBusy(false);
        }
      };
      const submit = async () => {
        setBusy(true);
        setFeedback(null);
        const attempted = await Promise.all(
          pending.selected.map((target) =>
            submitManagementOperation(
              URL_MANAGE_SKILL,
              skillManagementErrors,
              pending.operation,
              target,
            ),
          ),
        );
        setResults((previous) => [
          ...previous.filter(
            (result) => !attempted.some((next) => next.target.id === result.target.id),
          ),
          ...attempted,
        ]);
        const retry = attempted
          .filter((result) => result.error && !result.uncertain)
          .map((result) => result.target);
        setPending(
          retry.length ? { operation: pending.operation, targets: retry, selected: retry } : null,
        );
        try {
          await reload();
        } finally {
          setBusy(false);
        }
      };
      const toggleTarget = (target, checked) =>
        setPending((current) => ({
          ...current,
          selected: checked
            ? [...current.selected, target]
            : current.selected.filter((item) => item.id !== target.id),
        }));
      const busyOrPending = busy || Boolean(pending);
      return h(
        React.Fragment,
        null,
        canManage
          ? h(
              'section',
              {
                className: 'sdc-skill-group',
                'aria-label': batch ? '批量管理 Skills' : '管理 Skills',
              },
              batch ? h('h3', null, '批量管理 Skills') : null,
              h(
                'div',
                { className: 'sdc-actions' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'sdc-btn',
                    disabled: busyOrPending,
                    onClick: () => void requestInstall(),
                  },
                  '从本地目录安装 Skill',
                ),
                batch
                  ? h(
                      React.Fragment,
                      null,
                      h(
                        'select',
                        {
                          className: 'sdc-field',
                          'aria-label': '选择要卸载的 Skill',
                          value: removeName,
                          disabled: busyOrPending || localNames.length === 0,
                          onChange: (event) => setRemoveName(event.target.value),
                        },
                        h('option', { value: '' }, '选择要卸载的 Skill'),
                        ...localNames.map((name) => h('option', { key: name, value: name }, name)),
                      ),
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'sdc-btn',
                          disabled: busyOrPending || !localNames.includes(removeName),
                          onClick: () => prepare({ action: 'uninstall', name: removeName }),
                        },
                        '批量卸载',
                      ),
                    )
                  : null,
              ),
              pending
                ? h(
                    'div',
                    { className: 'sdc-alert' },
                    h(
                      'p',
                      { className: 'sdc-path' },
                      (pending.operation.action === 'install' ? '安装 ' : '卸载 ') +
                        pending.operation.name,
                    ),
                    pending.operation.source
                      ? h('p', { className: 'sdc-path' }, '来源：' + pending.operation.source)
                      : h('p', null, '卸载后可从各应用的恢复目录取回文件。'),
                    batch
                      ? h(
                          'fieldset',
                          { disabled: busy },
                          h('legend', null, '目标应用'),
                          ...pending.targets.map((target) =>
                            h(
                              'label',
                              { key: target.id, className: 'sdc-batch-target' },
                              h('input', {
                                type: 'checkbox',
                                checked: pending.selected.some((item) => item.id === target.id),
                                onChange: (event) => toggleTarget(target, event.target.checked),
                              }),
                              target.label,
                            ),
                          ),
                        )
                      : h('p', null, pending.targets[0].label),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'sdc-btn',
                        disabled: busy || !pending.selected.length,
                        ref: confirmButton,
                        onClick: () => void submit(),
                      },
                      busy ? '处理中…' : results.length ? '重试失败目标' : '确认操作',
                    ),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'sdc-btn',
                        disabled: busy,
                        onClick: () => setPending(null),
                      },
                      '取消',
                    ),
                  )
                : null,
              feedback ? h('p', { role: 'alert' }, feedback) : null,
              results.length
                ? h(
                    'ul',
                    { className: 'sdc-skill-list', role: 'status' },
                    ...results.map((result) =>
                      h(
                        'li',
                        { key: result.target.id, className: 'sdc-path' },
                        result.target.label +
                          ' · ' +
                          (result.error ||
                            (result.backup
                              ? '已卸载。恢复位置：' + result.backup
                              : '已安装。若 Qoder 中尚未显示，请刷新已安装列表。')),
                      ),
                    ),
                  )
                : null,
            )
          : null,
        h(SkillsList, {
          desktops,
          search,
          showDesktop: batch,
          onRemove:
            canManage && !busyOrPending && !batch
              ? (name) => prepare({ action: 'uninstall', name })
              : undefined,
        }),
      );
    }
    function Dashboard() {
      const [overview, setOverview] = React.useState(null);
      const [comparison, setComparison] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState('');
      const [tab, setTab] = React.useState('desktops');
      const [search, setSearch] = React.useState('');
      const [desktopId, setDesktopId] = React.useState(null);
      const viewport = React.useRef(null);
      const detailHeading = React.useRef(null);
      const restoreDesktop = React.useRef(null);
      const desktop = overview?.desktops.find((item) => item.id === desktopId);
      React.useEffect(() => {
        if (desktopId) {
          detailHeading.current?.focus();
          if (viewport.current) viewport.current.scrollTop = 0;
        } else if (restoreDesktop.current) {
          document.getElementById('sdc-open-' + restoreDesktop.current)?.focus();
          restoreDesktop.current = null;
        }
      }, [desktopId]);
      const refreshId = React.useRef(0);
      React.useEffect(attachStyle, []);
      const reload = React.useCallback(async () => {
        const id = ++refreshId.current;
        setLoading(true);
        setError('');
        try {
          const [overviewResponse, compareResponse] = await Promise.all([
            fetch(URL_OVERVIEW, { credentials: 'same-origin', cache: 'no-store' }),
            fetch(URL_COMPARE, { credentials: 'same-origin', cache: 'no-store' }),
          ]);
          if (!overviewResponse.ok || !compareResponse.ok)
            throw new Error('DSH 读取失败：请检查插件和登录状态。');
          const [a, b] = await Promise.all([overviewResponse.json(), compareResponse.json()]);
          if (!a.ok || !b.ok) throw new Error('DSH 扫描未完成，请检查插件日志。');
          if (id === refreshId.current) {
            setOverview(a.data);
            setComparison(b.data);
          }
        } catch (e) {
          if (id === refreshId.current) setError(e.message || '无法读取数据');
        } finally {
          if (id === refreshId.current) setLoading(false);
        }
      }, []);
      React.useEffect(() => {
        void reload();
        return () => {
          refreshId.current++;
        };
      }, [reload]);
      const desktops = overview?.desktops || [];
      const query = search.trim().toLowerCase();
      const matching = desktops.filter((d) =>
        [d.label, d.id, d.status].join(' ').toLowerCase().includes(query),
      );
      const tabs = [
        ['desktops', '桌面应用'],
        ['skills', 'Skills 清单'],
        ['mcp', 'MCP 清单'],
        ['diff', '跨端差异'],
        ['diagnostics', '诊断'],
      ];
      const detailSections = desktop
        ? [
            ['sdc-detail-skills', 'Skills'],
            ['sdc-mcp-heading-' + desktop.id, 'MCP'],
            ['sdc-plugin-heading', '插件 / 扩展'],
          ]
        : [];
      return h(
        'div',
        { className: 'sdc-panel' },
        h(
          'div',
          {
            className: 'sdc-viewport',
            ref: viewport,
            tabIndex: 0,
            role: 'region',
            'aria-label': 'Desktop Center 滚动区域',
          },
          h(
            'main',
            { className: 'sdc', 'aria-label': 'Desktop Center 管理面板' },
            h(
              'header',
              { className: 'sdc-hero' },
              h('h1', null, 'Desktop Center'),
              h(Pill, { label: 'v' + CLIENT_VERSION }),
            ),
            h(
              'div',
              { className: 'sdc-toolbar' },
              h(
                'nav',
                { className: 'sdc-tabs', 'aria-label': '管理视图' },
                ...tabs.map(([key, label]) =>
                  h(
                    'button',
                    {
                      type: 'button',
                      key,
                      className: 'sdc-tab',
                      'aria-current': tab === key ? 'page' : undefined,
                      onClick: () => {
                        setTab(key);
                        setDesktopId(null);
                        setSearch('');
                        if (viewport.current) viewport.current.scrollTop = 0;
                      },
                    },
                    label,
                  ),
                ),
              ),
              h(
                'div',
                { className: 'sdc-actions' },
                h('input', {
                  className: 'sdc-field',
                  type: 'search',
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  'aria-label': '搜索当前视图',
                  placeholder: desktop
                    ? '搜索此应用的资源'
                    : tab === 'skills'
                      ? '搜索名称、简介或 Desktop'
                      : tab === 'mcp'
                        ? '搜索服务或 Desktop'
                        : '搜索...',
                }),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'sdc-btn',
                    disabled: loading,
                    onClick: () => {
                      void reload();
                    },
                  },
                  loading ? '扫描中…' : '重新扫描',
                ),
              ),
            ),
            error
              ? h('div', { className: 'sdc-alert', 'data-error': 'true', role: 'alert' }, error)
              : null,
            overview && overview.platform !== 'darwin'
              ? h(
                  'div',
                  { className: 'sdc-alert' },
                  '当前 Host 不是 macOS，只提供有限的兼容性信息。',
                )
              : null,
            loading && !overview
              ? h(Empty, {
                  title: '正在扫描本地 Desktop',
                  subtitle: '仅读取已知的应用与 Skills 路径，不会更改任何配置。',
                })
              : null,
            !overview
              ? null
              : desktop
                ? h(
                    'section',
                    { className: 'sdc-pane', 'aria-labelledby': 'sdc-detail-heading' },
                    h(
                      'div',
                      { className: 'sdc-pane-title' },
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'sdc-btn',
                          onClick: () => {
                            restoreDesktop.current = desktop.id;
                            setDesktopId(null);
                            setSearch('');
                          },
                        },
                        '返回桌面应用',
                      ),
                      h(
                        'h2',
                        { id: 'sdc-detail-heading', tabIndex: -1, ref: detailHeading },
                        desktop.label,
                      ),
                      h(
                        'nav',
                        { className: 'sdc-detail-tools', 'aria-label': '应用资源' },
                        ...detailSections.map(([id, label]) =>
                          h(
                            'button',
                            {
                              key: id,
                              type: 'button',
                              className: 'sdc-btn',
                              onClick: () => {
                                const section = document.getElementById(id);
                                section?.focus({ preventScroll: true });
                                section?.scrollIntoView({ block: 'start' });
                              },
                            },
                            label,
                          ),
                        ),
                      ),
                    ),
                    h(
                      'div',
                      {
                        id: 'sdc-detail-skills',
                        tabIndex: -1,
                        role: 'region',
                        'aria-label': 'Skills',
                      },
                      h(DesktopSkills, {
                        key: desktop.id,
                        desktops: [desktop],
                        search: query,
                        reload,
                        enabled: overview.platform === 'darwin',
                      }),
                    ),
                    h(McpList, {
                      key: `mcp:${desktop.id}`,
                      desktop,
                      reload,
                      search: query,
                      enabled: overview.platform === 'darwin',
                    }),
                    h(PluginList, {
                      plugins: desktop.plugins,
                      search: query,
                      configured: desktop.id === 'codex-desktop',
                      extensions: desktop.id === 'trae' || desktop.id === 'trae-cn',
                    }),
                    h(DesktopPaths, { desktop }),
                  )
                : tab === 'desktops'
                  ? h(
                      'section',
                      { className: 'sdc-grid', 'aria-label': '桌面应用列表' },
                      ...matching.map((d) =>
                        h(Card, {
                          key: d.id,
                          desktop: d,
                          onOpen: () => {
                            setDesktopId(d.id);
                            setSearch('');
                          },
                        }),
                      ),
                      ...(matching.length
                        ? []
                        : [
                            h(Empty, {
                              key: 'empty',
                              title: '没有匹配的应用',
                              subtitle: '尝试其他关键词。',
                            }),
                          ]),
                    )
                  : h(
                      'section',
                      { className: 'sdc-pane' },
                      h(
                        'div',
                        { className: 'sdc-pane-title' },
                        tab === 'skills'
                          ? 'Skills 资源清单'
                          : tab === 'mcp'
                            ? 'MCP 清单'
                            : tab === 'diff'
                              ? '跨 Desktop Skill 包对比'
                              : '扫描诊断',
                      ),
                      tab === 'skills'
                        ? h(DesktopSkills, {
                            desktops,
                            search: query,
                            reload,
                            batch: true,
                            enabled: overview.platform === 'darwin',
                          })
                        : tab === 'mcp'
                          ? h(McpOverview, {
                              desktops,
                              search: query,
                              reload,
                              enabled: overview.platform === 'darwin',
                            })
                          : tab === 'diff'
                            ? h(CompareTable, {
                                rows: comparison?.matrix || [],
                                desktops,
                                search: query,
                              })
                            : h(DiagnosticTable, { desktops, search: query }),
                    ),
            h(
              'footer',
              { className: 'sdc-foot' },
              '应用和 Skill 状态来自本机扫描。',
              overview
                ? h('span', null, ' 最近扫描：' + new Date(overview.scannedAt).toLocaleString())
                : null,
            ),
          ),
        ),
      );
    }
    function SidebarIcon({ size = 18 }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true,
        },
        h('rect', { x: 3, y: 4, width: 18, height: 13, rx: 2 }),
        h('path', { d: 'M8 21h8M12 17v4M7 9h10M7 12h7' }),
      );
    }
    const inject = ['slots', 'layout'];
    function apply(ctx) {
      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PAGE_ID }, Dashboard));
      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          { name: 'sidebar.panellist', id: PAGE_ID, order: 15, label: 'Desktop Center' },
          SidebarIcon,
        ),
      );
    }
    module.exports.apply = apply;
    module.exports.inject = inject;
    module.exports.name = 'dsh-desktop-center-ui';
    return module.exports;
  },
});
