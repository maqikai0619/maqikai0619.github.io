// 项目数据：demo 已对接公网地址；repo 指向 GitHub 仓库，公开后再填即可点亮。
const projects = [
  {
    id: "manju",
    name: "MQK漫剧",
    subtitle: "AI 漫剧创作平台",
    desc: "AI 漫剧 / 短剧全流程创作：AI 编剧对话、剧本、分镜、素材、配音到成片。",
    tech: ["Nuxt3", "Vue3", "Java", "Spring Boot", "SSE", "LLM"],
    demo: "http://23.144.68.140/MQK/",
    repo: null, // 二改自开源 AID，源码暂未公开
    color: "blue",
    glyph: "🎬",
  },
  {
    id: "ec-agent",
    name: "AI 电商生图生视频",
    subtitle: "AIGC 平台 + 多 Agent",
    desc: "AIGC 平台（图片/视频制作/数字人/爆款带货视频）+ 多 Agent 自纠错编排。",
    tech: ["原生 JS", "FastAPI", "LangGraph", "SSE", "多 Agent"],
    demo: "http://23.144.68.140/mqk-ec-agent/",
    repo: null, // https://github.com/maqikai0619/ai-ecommerce-image-video
    color: "purple",
    glyph: "🎨",
  },
  {
    id: "zst",
    name: "商绘",
    subtitle: "电商多模态画布",
    desc: "工作台 / 项目 / 商品 / 素材 / 系统，一体化电商内容创作。",
    tech: ["React", "React Flow", "前端原型"],
    demo: "http://23.144.68.140/zst/",
    repo: null, // https://github.com/maqikai0619/agent-project
    color: "orange",
    glyph: "🖼️",
  },
  {
    id: "askdata",
    name: "AskData Studio",
    subtitle: "自然语言问数",
    desc: "面向短视频运营的自然语言问数（Vue + FastAPI + LangGraph）。",
    tech: ["Vue", "FastAPI", "LangGraph"],
    demo: "http://23.144.68.140/askdata/",
    repo: null, // https://github.com/maqikai0619/askdata
    color: "teal",
    glyph: "📊",
  },
  {
    id: "vectordata",
    name: "AI 向量数据库 & RAG",
    subtitle: "企业级知识库问答",
    desc: "从零构建企业级知识库问答（Milvus + LangChain + 通义千问，Vue3 + Flask）。",
    tech: ["Milvus", "LangChain", "通义千问", "Vue3", "Flask"],
    demo: "http://23.144.68.140/vectordata/",
    repo: null, // https://github.com/maqikai0619/vectordata
    color: "indigo",
    glyph: "🧠",
  },
];

// 技能栈
const skills = [
  { group: "前端", items: ["JavaScript", "Vue3", "React", "HTML / CSS"] },
  { group: "后端", items: ["Python", "FastAPI", "Flask", "SSE"] },
  { group: "AI / LLM", items: ["LangChain", "LangGraph", "RAG", "多模态 AIGC", "通义千问"] },
  { group: "数据 / 检索", items: ["Milvus", "向量检索", "Embedding"] },
  { group: "工程", items: ["Docker", "Nginx", "宝塔部署", "Git"] },
];

// 技能栈：作为桌面上的一个「应用」，点击在窗口内展开（非项目，无 demo）
const skillsApp = { id: "skills", name: "技能栈", subtitle: "技术栈 / 工具链", color: "slate", glyph: "🛠️" };

const $ = (s) => document.querySelector(s);
const byId = (id) => projects.find((p) => p.id === id);

let unlocked = false;
let activeId = null;
let recent = [];
let filter = "all";
let timer;
try {
  recent = JSON.parse(localStorage.getItem("mqk-recent") || "[]");
  if (!Array.isArray(recent)) recent = [];
} catch {}

const icon = (p) =>
  `<span class="app-icon ${p.color}"><img src="icons/${p.id}.png" alt="" draggable="false" /></span>`;

function toast(text) {
  clearTimeout(timer);
  $("#toast").textContent = text;
  $("#toast").hidden = false;
  timer = setTimeout(() => ($("#toast").hidden = true), 3600);
}

/* ---------- 时钟 / 问候 ---------- */
function clock() {
  const d = new Date();
  $("#lock-time").textContent = d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  $("#lock-date").textContent = d.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" });
  $("#menu-time").textContent =
    d.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" }) + " " +
    d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  $("#widget-weekday").textContent = d.toLocaleDateString("zh-CN", { weekday: "long" });
  $("#widget-day").textContent = d.getDate();
  $("#widget-month").textContent = d.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });

  const h = d.getHours();
  const greet = h < 6 ? "夜深了" : h < 11 ? "早上好" : h < 14 ? "中午好" : h < 18 ? "下午好" : "晚上好";
  $("#greeting").textContent = greet + "，我是 MQK。";

  let html = "一二三四五六日".split("").map((x) => `<span class="week">${x}</span>`).join("");
  const offset = (new Date(d.getFullYear(), d.getMonth(), 1).getDay() + 6) % 7;
  html += "<span></span>".repeat(offset);
  for (let i = 1; i <= new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); i++)
    html += `<span${i === d.getDate() ? ' class="today"' : ""}>${i}</span>`;
  $("#mini-calendar").innerHTML = html;
}

/* ---------- 渲染项目 ---------- */
function renderApps() {
  const apps = filter === "all"
    ? projects
    : recent.map((id) => projects.find((p) => p.id === id)).filter(Boolean);

  $("#app-grid").innerHTML = apps
    .map(
      (p) =>
        `<button class="app-card" data-app="${p.id}" aria-label="打开${p.name}">${icon(p)}<span class="app-name">${p.name}</span><span class="app-subtitle">${p.subtitle}</span></button>`
    )
    .join("");
  $("#empty-apps").hidden = apps.length > 0;
  $("#apps-count").textContent = apps.length + " 个项目";
  $("#online-count").textContent = projects.length;
  $("#apps-heading").textContent = filter === "all" ? "为下一次创作做好准备" : "继续上一次的灵感";
  $("#all-apps").classList.toggle("active", filter === "all");
  $("#recent-filter").classList.toggle("active", filter === "recent");

  $("#dock-apps").innerHTML = [...projects, skillsApp]
    .map(
      (p) =>
        `<button class="dock-app${activeId === p.id ? " is-open" : ""}" data-app="${p.id}" data-tooltip="${p.name}" aria-label="打开${p.name}">${icon(p)}</button>`
    )
    .join("");
}

/* ---------- 技能栈窗口内容 ---------- */
function renderSkillsHTML() {
  return `<div class="skills-detail">
    <div class="sd-hero">${icon(skillsApp)}<h3>技能栈</h3></div>
    ${skills
      .map(
        (g) =>
          `<div class="skill-group"><p class="skill-group-label">${g.group}</p><div class="chips">${g.items
            .map((i) => `<span class="chip">${i}</span>`)
            .join("")}</div></div>`
      )
      .join("")}
  </div>`;
}

/* ---------- 应用窗口 ---------- */
const isHttps = location.protocol === "https:";
function canEmbed(p) {
  if (p.frame === "block") return false;
  // HTTPS 页面内嵌 HTTP 站点会被浏览器按「混合内容」拦截，只能新标签打开
  if (isHttps && p.demo && p.demo.startsWith("http://")) return false;
  return true;
}

function launch(id) {
  if (id === "skills") return openSkills();

  const p = byId(id);
  if (!p) return;
  activeId = id;
  recent = [id, ...recent.filter((x) => x !== id)].slice(0, 5);
  try { localStorage.setItem("mqk-recent", JSON.stringify(recent)); } catch {}

  $("#search-dialog").close();
  $("#user-menu").hidden = true;
  $("#window-title").textContent = p.name;

  const ok = canEmbed(p);
  $("#window-content").hidden = true;
  $("#frame-blocked").hidden = ok;
  $("#app-frame").hidden = !ok;
  $("#open-tab").hidden = false;
  $("#open-tab").href = p.demo;

  if (ok) {
    $("#frame-loading").hidden = false;
    $("#frame-loading").textContent = "正在打开应用…";
    $("#app-frame").title = p.name;
    $("#app-frame").src = p.demo;
  } else {
    $("#app-frame").removeAttribute("src");
    $("#fb-title").textContent = p.name;
    $("#fb-desc").textContent =
      p.frame === "block"
        ? "该站点设置了禁止被其他页面嵌入（X-Frame-Options），请在独立标签页中打开。"
        : "该应用为 HTTP 站点，在当前 HTTPS 页面内无法直接嵌入，请在独立标签页中打开。";
    $("#fb-open").href = p.demo;
  }

  $("#app-window").hidden = false;
  $("#app-window").classList.remove("maximized");
  renderApps();
}

function openSkills() {
  activeId = "skills";
  $("#search-dialog").close();
  $("#user-menu").hidden = true;
  $("#window-title").textContent = "技能栈";
  $("#open-tab").hidden = true;
  $("#frame-loading").hidden = true;
  $("#app-frame").hidden = true;
  $("#app-frame").removeAttribute("src");
  $("#frame-blocked").hidden = true;
  $("#window-content").hidden = false;
  $("#window-content").innerHTML = renderSkillsHTML();
  $("#app-window").hidden = false;
  $("#app-window").classList.remove("maximized");
  renderApps();
}

function closeWindow() {
  activeId = null;
  $("#app-frame").removeAttribute("src");
  $("#window-content").hidden = true;
  $("#open-tab").hidden = false;
  $("#app-window").hidden = true;
  renderApps();
}
function showDesktop() {
  $("#app-window").hidden = true;
  $("#user-menu").hidden = true;
  $("#user-button").setAttribute("aria-expanded", "false");
}

/* ---------- 解锁 / 锁定 ---------- */
function unlock() {
  unlocked = true;
  $("#login").hidden = true;
  $("#desktop").hidden = false;
  renderApps();
  clock();
}
function lock() {
  unlocked = false;
  activeId = null;
  $("#desktop").hidden = true;
  $("#app-window").hidden = true;
  $("#user-menu").hidden = true;
  $("#login").hidden = false;
}

/* ---------- 搜索 ---------- */
function search() {
  const q = $("#search-input").value.toLowerCase().trim();
  const apps = projects.filter((p) => (p.name + p.subtitle + p.desc + p.tech.join(" ")).toLowerCase().includes(q));
  $("#search-results").innerHTML = apps.length
    ? apps
        .map(
          (p) =>
            `<button class="search-result" data-app="${p.id}" aria-label="打开${p.name}">${icon(p)}<span>${p.name} · ${p.subtitle}</span></button>`
        )
        .join("")
    : '<p class="empty-apps">没有找到这个项目，换个关键词试试。</p>';
}
function openSearch() {
  if (!unlocked) return;
  $("#search-dialog").showModal();
  $("#search-input").value = "";
  search();
  $("#search-input").focus();
}

/* ---------- 事件绑定 ---------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-app]");
  if (btn) launch(btn.dataset.app);
});

$("#enter-workspace").addEventListener("click", unlock);

$("#all-apps").onclick = () => { filter = "all"; renderApps(); };
$("#recent-filter").onclick = () => { filter = "recent"; renderApps(); };
$("#home-button").onclick = showDesktop;
$("#dock-home").onclick = showDesktop;
$("#minimize-app").onclick = showDesktop;
$("#close-app").onclick = closeWindow;
$("#maximize-app").onclick = () => $("#app-window").classList.toggle("maximized");
$("#app-frame").onload = () => ($("#frame-loading").hidden = true);
$("#dock-lock").onclick = lock;
$("#logout").onclick = lock;

$("#user-button").onclick = () => {
  const menu = $("#user-menu");
  menu.hidden = !menu.hidden;
  $("#user-button").setAttribute("aria-expanded", String(!menu.hidden));
};

$("#search-toggle").onclick = openSearch;
$("#search-input").addEventListener("input", search);
$("#search-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    $("#search-results [data-app]")?.click();
  }
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openSearch();
  }
  if (e.key === "Escape") $("#user-menu").hidden = true;
});

/* ---------- 打字机 ---------- */
const phrases = [
  "AI 全栈开发爱好者",
  "向量数据库 & RAG",
  "自然语言问数",
  "生图生视频 AIGC",
];
const typeEl = $("#typewriter");
let pi = 0, ci = 0, deleting = false;
function typeTick() {
  const word = phrases[pi];
  if (!deleting) {
    ci += 1;
    typeEl.textContent = word.slice(0, ci);
    if (ci === word.length) { deleting = true; setTimeout(typeTick, 1800); return; }
    setTimeout(typeTick, 90);
  } else {
    ci -= 1;
    typeEl.textContent = word.slice(0, ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeTick, 400); return; }
    setTimeout(typeTick, 45);
  }
}
typeTick();

/* ---------- 背景音乐 ---------- */
const bgm = $("#bgm");
const musicBtn = $("#music-toggle");
if (bgm && musicBtn) {
  const setPlaying = (p) => {
    musicBtn.classList.toggle("is-playing", p);
    musicBtn.classList.toggle("is-muted", !p);
    musicBtn.setAttribute("aria-pressed", String(p));
  };
  const tryPlay = () => bgm.play().then(() => setPlaying(true)).catch(() => setPlaying(false));

  tryPlay();
  musicBtn.addEventListener("click", () => {
    if (bgm.paused) tryPlay();
    else { bgm.pause(); setPlaying(false); }
  });
  const resumeOnce = () => { if (bgm.paused) tryPlay(); };
  window.addEventListener("pointerdown", resumeOnce, { once: true });
  window.addEventListener("keydown", resumeOnce, { once: true });
}

/* ---------- 启动 ---------- */
clock();
setInterval(clock, 30000);

// 开机动画 → 锁屏
setTimeout(() => {
  $("#boot").hidden = true;
  $("#login").hidden = false;
}, 1100);
