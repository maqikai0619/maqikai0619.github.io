// 项目数据：demo 已对接公网地址；repo 指向 GitHub 仓库，公开后再填即可点亮。
const projects = [
  {
    name: "AI 电商生图生视频",
    desc: "AIGC 平台（图片/视频制作/数字人/爆款带货视频）+ 多 Agent 自纠错编排。",
    tech: ["原生 JS", "FastAPI", "LangGraph", "SSE", "多 Agent"],
    demo: "http://23.144.68.140/mqk-ec-agent/",
    repo: null, // https://github.com/maqikai0619/ai-ecommerce-image-video
  },
  {
    name: "商绘 · AI 电商多模态无限画布",
    desc: "工作台 / 项目 / 商品 / 素材 / 系统，一体化电商内容创作。",
    tech: ["React", "React Flow", "前端原型"],
    demo: "http://23.144.68.140/zst/",
    repo: null, // https://github.com/maqikai0619/agent-project
  },
  {
    name: "AskData Studio",
    desc: "面向短视频运营的自然语言问数（Vue + FastAPI + LangGraph）。",
    tech: ["Vue", "FastAPI", "LangGraph"],
    demo: "http://23.144.68.140/askdata/",
    repo: null, // https://github.com/maqikai0619/askdata
  },
  {
    name: "AI 向量数据库 & RAG 系统",
    desc: "从零构建企业级知识库问答（Milvus + LangChain + 通义千问，Vue3 + Flask）。",
    tech: ["Milvus", "LangChain", "通义千问", "Vue3", "Flask"],
    demo: "http://23.144.68.140/vectordata/",
    repo: null, // https://github.com/maqikai0619/vectordata
  },
];

// 技能栈
const skills = [
  { group: "前端", items: ["JavaScript", "Vue3", "React", "HTML / CSS"] },
  { group: "后端", items: ["Python", "FastAPI", "Flask", "SSE"] },
  { group: "AI / LLM", items: ["LangChain", "LangGraph", "RAG", "多模态 AIGC", "通义千问 / Qwen"] },
  { group: "数据 / 检索", items: ["Milvus", "向量检索", "Embedding"] },
  { group: "工程", items: ["Docker", "Nginx", "宝塔部署", "Git"] },
];

const grid = document.getElementById("project-grid");

projects.forEach((p, i) => {
  const card = document.createElement("article");
  card.className = "card reveal";

  const index = document.createElement("div");
  index.className = "card-index";
  index.textContent = String(i + 1).padStart(2, "0");

  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = p.name;

  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = p.desc;

  const tags = document.createElement("div");
  tags.className = "card-tags";
  p.tech.forEach((t) => {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = t;
    tags.appendChild(s);
  });

  const actions = document.createElement("div");
  actions.className = "card-actions";
  actions.appendChild(makeBtn("在线 demo", p.demo, "demo"));
  actions.appendChild(makeBtn("源码", p.repo, "src"));

  card.append(index, name, desc, tags, actions);
  grid.appendChild(card);
});

// 技能栈渲染
const skillsList = document.getElementById("skills-list");
skills.forEach((g) => {
  const group = document.createElement("div");
  group.className = "skill-group reveal";

  const label = document.createElement("p");
  label.className = "skill-group-label";
  label.textContent = g.group;

  const chips = document.createElement("div");
  chips.className = "chips";
  g.items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = item;
    chips.appendChild(chip);
  });

  group.append(label, chips);
  skillsList.appendChild(group);
});

function makeBtn(label, url, type) {
  if (url) {
    const a = document.createElement("a");
    a.className = `card-btn ${type}`;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = label;
    return a;
  }
  // 没填链接：demo 显示「即将上线」，源码显示「个人项目」
  const span = document.createElement("span");
  span.className = "card-btn is-disabled";
  const note = type === "src" ? "个人项目" : "即将上线";
  span.textContent = `${label} · ${note}`;
  span.title = type === "src" ? "个人项目，源码暂未公开" : "公网链接就绪后上线";
  return span;
}

// 滚动显现
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- 微交互 ---------- */

// 卡片 3D 倾斜
document.querySelectorAll(".card").forEach((card) => {
  let raf = null;
  card.addEventListener("mousemove", (e) => {
    if (raf) return;
    const cx = e.clientX;
    const cy = e.clientY;
    raf = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const rx = ((cy - r.top) / r.height - 0.5) * -7;
      const ry = ((cx - r.left) / r.width - 0.5) * 7;
      card.style.transition =
        "transform 0.1s ease-out, border-color 0.25s ease, box-shadow 0.25s ease";
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      raf = null;
    });
  });
  card.addEventListener("mouseleave", () => {
    card.style.transition =
      "transform 0.3s ease-out, border-color 0.25s ease, box-shadow 0.25s ease";
    card.style.transform = "";
  });
});

// 磁吸按钮
document.querySelectorAll(".btn, .card-btn:not(.is-disabled), .nav-gh").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.3;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

// 标题光标跟随光晕
const hero = document.querySelector(".hero");
hero.addEventListener("mousemove", (e) => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
  hero.style.setProperty("--my", `${e.clientY - r.top}px`);
});
