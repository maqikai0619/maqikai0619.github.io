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
  `<span class="app-icon ${p.color}"><span class="glyph">${p.glyph}</span></span>`;

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
  $("#apps-heading").textContent = filter === "all" ? "为下一次创作做好准备" : "继续上一次的灵感";
  $("#all-apps").classList.toggle("active", filter === "all");
  $("#recent-filter").classList.toggle("active", filter === "recent");

  $("#dock-apps").innerHTML = projects
    .map(
      (p) =>
        `<button class="dock-app${activeId === p.id ? " is-open" : ""}" data-app="${p.id}" data-tooltip="${p.name}" aria-label="打开${p.name}">${icon(p)}</button>`
    )
    .join("");
}

/* ---------- 渲染技能 ---------- */
function renderSkills() {
  const wrap = $("#skills-list");
  wrap.innerHTML = skills
    .map(
      (g) =>
        `<div class="skill-group"><p class="skill-group-label">${g.group}</p><div class="chips">${g.items
          .map((i) => `<span class="chip">${i}</span>`)
          .join("")}</div></div>`
    )
    .join("");
}

/* ---------- 项目窗口 ---------- */
function openProject(id) {
  const p = byId(id);
  if (!p) return;
  activeId = id;
  recent = [id, ...recent.filter((x) => x !== id)].slice(0, 5);
  try { localStorage.setItem("mqk-recent", JSON.stringify(recent)); } catch {}

  $("#search-dialog").close();
  $("#user-menu").hidden = true;
  $("#window-title").textContent = p.name;
  $("#open-demo").href = p.demo;

  const src = p.repo
    ? `<a class="pd-btn src" href="${p.repo}" target="_blank" rel="noopener">源码 ↗</a>`
    : `<span class="pd-btn src is-disabled" title="个人项目，源码暂未公开">源码 · 个人项目</span>`;

  $("#window-body").innerHTML = `
    <div class="project-detail">
      <div class="pd-hero">${icon(p)}<div><h3>${p.name}</h3><p class="pd-sub">${p.subtitle}</p></div></div>
      <p class="pd-desc">${p.desc}</p>
      <div class="pd-tags">${p.tech.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      <div class="pd-actions">
        <a class="pd-btn demo" href="${p.demo}" target="_blank" rel="noopener">在线 Demo ↗</a>
        ${src}
      </div>
    </div>`;

  $("#app-window").hidden = false;
  $("#app-window").classList.remove("maximized");
  renderApps();
}

function closeWindow() {
  activeId = null;
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
  renderSkills();
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
  if (btn) openProject(btn.dataset.app);
});

$("#enter-workspace").addEventListener("click", unlock);

$("#all-apps").onclick = () => { filter = "all"; renderApps(); };
$("#recent-filter").onclick = () => { filter = "recent"; renderApps(); };
$("#home-button").onclick = showDesktop;
$("#dock-home").onclick = showDesktop;
$("#minimize-app").onclick = showDesktop;
$("#close-app").onclick = closeWindow;
$("#maximize-app").onclick = () => $("#app-window").classList.toggle("maximized");
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
