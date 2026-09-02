/**
 * ============================================================
 * 哈知手册 · 前端逻辑
 * 纯静态、无后端。基于 hash 路由：
 *   #/                    首页
 *   #/categories          全部分类
 *   #/category/<id>       某个分类下的资料列表
 *   #/article/<id>        文章详情页
 *   #/search?q=xxx        搜索结果
 *   #/qa                  问答社区占位页
 * ============================================================
 */

const app = document.getElementById("app");

// ---------- 工具函数 ----------

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function articlesInCategory(id) {
  return ARTICLES.filter((a) => a.category === id);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(d) {
  return d;
}

function articleCardHtml(a) {
  const cat = getCategory(a.category);
  return `
    <a class="article-card" href="#/article/${a.id}">
      <span class="cat-tag">${cat ? cat.name : ""}</span>
      <h3>${escapeHtml(a.title)}</h3>
      <p>${escapeHtml(a.summary)}</p>
      <span class="meta">更新于 ${formatDate(a.updated)}</span>
    </a>
  `;
}

function articleRowHtml(a) {
  const cat = getCategory(a.category);
  return `
    <a class="article-row" href="#/article/${a.id}">
      <span class="article-row-title">${escapeHtml(a.title)}</span>
      <span class="article-row-summary">${escapeHtml(a.summary)}</span>
      <span class="article-row-meta">${cat ? cat.name : ""} · ${formatDate(a.updated)}</span>
    </a>
  `;
}

function qaBannerHtml() {
  return `
    <div class="qa-banner">
      <div class="container qa-banner-inner">
        <div>
          <h3>有具体问题？</h3>
          <p>问答社区正在建设中，目前有任何问题可以先在群里提问。</p>
        </div>
        <a class="btn-ghost" href="#/qa">查看详情 →</a>
      </div>
    </div>
  `;
}

// ---------- 页面渲染函数 ----------

function renderHome() {
  const featured = ARTICLES.filter((a) => a.featured);
  const latest = [...ARTICLES].sort((a, b) => (a.updated < b.updated ? 1 : -1)).slice(0, 6);

  app.innerHTML = `
    <section class="hero">
      <div class="container hero-inner">
        <p class="hero-eyebrow">哈知手册 · KZ HANDBOOK</p>
        <h1>写给在哈萨克斯坦生活、学习的中国人的实用资料库</h1>
        <p class="lead">留学、签证、银行卡、租房、交通……把落地哈萨克斯坦最容易卡住的那些事，整理成看得懂、用得上的中文资料。</p>
        <form class="search-box" id="heroSearchForm">
          <input type="text" id="heroSearchInput" placeholder="搜索关键词，例如「银行卡」「登记」「Kaspi」" autocomplete="off">
          <button type="submit">搜索</button>
        </form>
        <a class="hero-qa-link" href="#/qa">💬 有问题想问？看看问答社区入口</a>
      </div>
    </section>

    <section class="section container">
      <div class="section-head">
        <h2><span class="cn-index">01</span> 分类导航</h2>
        <a class="see-all" href="#/categories">查看全部分类 →</a>
      </div>
      <div class="cat-grid">
        ${CATEGORIES.slice(0, 8)
          .map(
            (c) => `
          <a class="cat-card" href="#/category/${c.id}">
            <span class="cat-icon">${c.icon}</span>
            <span class="cat-name">${c.name}</span>
            <span class="cat-desc">${c.desc}</span>
            <span class="cat-count">${articlesInCategory(c.id).length} 篇资料</span>
          </a>`
          )
          .join("")}
      </div>
    </section>

    <section class="section container">
      <div class="section-head">
        <h2><span class="cn-index">02</span> 推荐资料</h2>
      </div>
      <div class="article-grid">
        ${featured.map(articleCardHtml).join("") || emptyStateHtml("还没有推荐资料")}
      </div>
    </section>

    <section class="section container">
      <div class="section-head">
        <h2><span class="cn-index">03</span> 最新更新</h2>
      </div>
      <div class="article-list">
        ${latest.map(articleRowHtml).join("")}
      </div>
    </section>

    ${qaBannerHtml()}
  `;

  document.getElementById("heroSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("heroSearchInput").value.trim();
    if (q) location.hash = `#/search?q=${encodeURIComponent(q)}`;
  });
}

function renderCategories() {
  app.innerHTML = `
    <section class="cat-page-head">
      <div class="container">
        <h1>全部分类</h1>
        <p>${CATEGORIES.length} 个分类 · 共 ${ARTICLES.length} 篇资料</p>
      </div>
    </section>
    <section class="section container">
      <div class="cat-grid">
        ${CATEGORIES.map(
          (c) => `
          <a class="cat-card" href="#/category/${c.id}">
            <span class="cat-icon">${c.icon}</span>
            <span class="cat-name">${c.name}</span>
            <span class="cat-desc">${c.desc}</span>
            <span class="cat-count">${articlesInCategory(c.id).length} 篇资料</span>
          </a>`
        ).join("")}
      </div>
    </section>
    ${qaBannerHtml()}
  `;
}

function renderCategory(id) {
  const cat = getCategory(id);
  if (!cat) {
    renderNotFound();
    return;
  }
  const items = articlesInCategory(id);

  app.innerHTML = `
    <section class="cat-page-head">
      <div class="container">
        <span class="cat-icon-big">${cat.icon}</span>
        <h1>${cat.name}</h1>
        <p>${cat.desc} · 共 ${items.length} 篇资料</p>
      </div>
    </section>
    <section class="section container">
      <div class="breadcrumb">
        <a href="#/">首页</a><span class="sep">/</span>
        <a href="#/categories">全部分类</a><span class="sep">/</span>
        ${cat.name}
      </div>
      ${
        items.length
          ? `<div class="article-list">${items.map(articleRowHtml).join("")}</div>`
          : emptyStateHtml("这个分类还没有资料，正在整理中")
      }
    </section>
  `;
}

function renderArticle(id) {
  const a = ARTICLES.find((x) => x.id === id);
  if (!a) {
    renderNotFound();
    return;
  }
  const cat = getCategory(a.category);
  const related = (a.related || [])
    .map((rid) => ARTICLES.find((x) => x.id === rid))
    .filter(Boolean);

  app.innerHTML = `
    <div class="article-page">
      <div class="breadcrumb">
        <a href="#/">首页</a><span class="sep">/</span>
        <a href="#/category/${cat.id}">${cat.name}</a>
      </div>
      <span class="cat-tag">${cat.name}</span>
      <h1>${escapeHtml(a.title)}</h1>
      <div class="meta">更新于 ${formatDate(a.updated)}</div>
      <div class="article-body">${a.content}</div>

      ${
        related.length
          ? `
        <div class="related-box">
          <h4>相关资料</h4>
          <div class="related-links">
            ${related.map((r) => `<a href="#/article/${r.id}">${escapeHtml(r.title)} →</a>`).join("")}
          </div>
        </div>`
          : ""
      }

      <div class="back-row">
        <a href="#/category/${cat.id}">← 返回「${cat.name}」分类</a>
        <a href="#/">回到首页</a>
      </div>
    </div>
  `;
}

function renderSearch(query) {
  const q = (query || "").trim().toLowerCase();
  const results = q
    ? ARTICLES.filter((a) => {
        const hay = [a.title, a.summary, a.content, ...(a.tags || [])].join(" ").toLowerCase();
        return hay.includes(q);
      })
    : [];

  app.innerHTML = `
    <section class="section container" style="padding-top:40px;">
      <div class="breadcrumb"><a href="#/">首页</a><span class="sep">/</span>搜索</div>
      <div class="section-head">
        <h2>搜索结果：「${escapeHtml(query || "")}」</h2>
      </div>
      <form class="search-box" id="searchPageForm" style="margin-bottom:32px; max-width:520px;">
        <input type="text" id="searchPageInput" value="${escapeHtml(query || "")}" placeholder="换个关键词试试" autocomplete="off">
        <button type="submit">搜索</button>
      </form>
      ${
        results.length
          ? `<div class="article-list">${results.map(articleRowHtml).join("")}</div>`
          : emptyStateHtml(`没有找到和「${escapeHtml(query || "")}」相关的资料，试试别的关键词，或直接去问答社区提问。`)
      }
    </section>
    ${qaBannerHtml()}
  `;

  document.getElementById("searchPageForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("searchPageInput").value.trim();
    location.hash = `#/search?q=${encodeURIComponent(val)}`;
  });
}

function renderNotFound() {
  app.innerHTML = `
    <section class="section container" style="padding-top:60px; text-align:center;">
      ${emptyStateHtml("没有找到这个页面")}
      <a href="#/" style="color:var(--navy); font-weight:600;">← 回到首页</a>
    </section>
  `;
}

function emptyStateHtml(text) {
  return `
    <div class="empty-state">
      <div class="empty-icon">🗂️</div>
      <p>${text}</p>
    </div>
  `;
}

// ---------- 路由 ----------

function parseHash() {
  let hash = location.hash || "#/";
  hash = hash.slice(1); // remove leading #
  const [path, queryString] = hash.split("?");
  const params = new URLSearchParams(queryString || "");
  const segments = path.split("/").filter(Boolean);
  return { segments, params };
}

function route() {
  const { segments, params } = parseHash();
  window.scrollTo(0, 0);
  closeNav();

  if (segments.length === 0) {
    setActiveNav("home");
    renderHome();
    return;
  }

  switch (segments[0]) {
    case "categories":
      setActiveNav("categories");
      renderCategories();
      break;
    case "category":
      setActiveNav("categories");
      renderCategory(segments[1]);
      break;
    case "article":
      setActiveNav(null);
      renderArticle(segments[1]);
      break;
    case "search":
      setActiveNav(null);
      renderSearch(params.get("q"));
      break;
    case "qa":
      setActiveNav("qa");
      if (segments[1] === "new") {
        renderNewPost();
      } else if (segments[1] === "post" && segments[2]) {
        renderPostDetail(segments[2]);
      } else {
        renderQA();
      }
      break;
    default:
      setActiveNav(null);
      renderNotFound();
  }
}

function setActiveNav(key) {
  document.querySelectorAll(".main-nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === key);
  });
}

// ---------- 移动端导航 ----------

const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

function closeNav() {
  mainNav.classList.remove("open");
}

// ---------- 启动 ----------

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
route();
