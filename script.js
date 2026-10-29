// 项目数据：后续把 demo / repo 填上公网链接，对应按钮就会自动点亮，无需改其他代码。
// demo = 在线可访问的演示地址；repo = GitHub 公开仓库地址。
const projects = [
  {
    name: "AI 向量数据库 & RAG 系统",
    desc: "从零构建企业级知识库问答（Milvus + LangChain + 通义千问，Vue3 + Flask）。",
    demo: null, // 例：https://your-demo.example.com
    repo: null, // 例：https://github.com/maqikai0619/vectordata
  },
  {
    name: "AskData Studio",
    desc: "面向短视频运营的自然语言问数（Vue + FastAPI + LangGraph）。",
    demo: null,
    repo: null, // https://github.com/maqikai0619/askdata
  },
  {
    name: "商绘 · AI 电商多模态无线画布",
    desc: "工作台 / 项目 / 商品 / 素材 / 系统，一体化电商内容创作。",
    demo: null,
    repo: null, // https://github.com/maqikai0619/agent-project
  },
  {
    name: "AI 电商生图生视频",
    desc: "AIGC 平台（图片/视频制作/数字人/爆款带货视频）+ 多 Agent 自纠错编排。",
    demo: null,
    repo: null, // https://github.com/maqikai0619/ai-ecommerce-image-video
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
  const span = document.createElement("span");
  span.className = "card-btn is-disabled";
  span.textContent = `${label} · 即将上线`;
  span.title = "公网链接就绪后上线";
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
