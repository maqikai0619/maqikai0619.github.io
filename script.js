// 项目数据：demo 已对接公网地址；repo 指向 GitHub 仓库，公开后再填即可点亮。
const projects = [
  {
    name: "AI 电商生图生视频",
    desc: "AIGC 平台（图片/视频制作/数字人/爆款带货视频）+ 多 Agent 自纠错编排。",
    demo: "http://23.144.68.140/mqk-ec-agent/",
    repo: null, // https://github.com/maqikai0619/ai-ecommerce-image-video
  },
  {
    name: "商绘 · AI 电商多模态无限画布",
    desc: "工作台 / 项目 / 商品 / 素材 / 系统，一体化电商内容创作。",
    demo: "http://23.144.68.140/zst/",
    repo: null, // https://github.com/maqikai0619/agent-project
  },
  {
    name: "AskData Studio",
    desc: "面向短视频运营的自然语言问数（Vue + FastAPI + LangGraph）。",
    demo: "http://23.144.68.140/askdata/",
    repo: null, // https://github.com/maqikai0619/askdata
  },
  {
    name: "AI 向量数据库 & RAG 系统",
    desc: "从零构建企业级知识库问答（Milvus + LangChain + 通义千问，Vue3 + Flask）。",
    demo: "http://23.144.68.140/vectordata/",
    repo: null, // https://github.com/maqikai0619/vectordata
  },
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

  const actions = document.createElement("div");
  actions.className = "card-actions";

  actions.appendChild(makeBtn("在线 demo", p.demo, "demo"));
  actions.appendChild(makeBtn("源码", p.repo, "src"));

  card.append(index, name, desc, actions);
  grid.appendChild(card);
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
  // 没填链接：demo 显示「即将上线」，源码显示「暂不公开」
  const span = document.createElement("span");
  span.className = "card-btn is-disabled";
  const note = type === "src" ? "暂不公开" : "即将上线";
  span.textContent = `${label} · ${note}`;
  span.title = type === "src" ? "仓库暂未公开" : "公网链接就绪后上线";
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
