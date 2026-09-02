/* ==========================================================
   哈知手册 — 设计令牌
   底色：暖白纸感 #FAF7F0
   主色：深靛蓝 #1E2A4A（草原夜空 / 稳重、可信）
   强调色：暖金 #C89B3C（哈萨克斯坦金色调，用于点睛而非铺满）
   辅助：赭红 #A84B3F（提示/相关信息，少量使用）
   字体：思源黑体系统栈作正文；标题用更收紧的字重与字距制造"手册"感
   ========================================================== */

:root {
  --ink: #1a2033;
  --ink-soft: #4a5170;
  --paper: #faf7f0;
  --paper-raised: #ffffff;
  --line: #dcd6c6;
  --navy: #1e2a4a;
  --navy-deep: #141c33;
  --gold: #c89b3c;
  --gold-soft: #e8d9b0;
  --rust: #a84b3f;

  --font-body: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
  --font-display: "PingFang SC", "Microsoft YaHei", var(--font-body);

  --radius-s: 3px;
  --radius-m: 6px;
  --content-width: 1120px;
  --content-narrow: 760px;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

.container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 24px;
}

/* ---------------- Header ---------------- */

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--navy);
  border-bottom: 3px solid var(--gold);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
  color: #fff;
}

.brand-mark {
  font-size: 1.28rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand-sub {
  font-size: 0.7rem;
  color: var(--gold-soft);
  letter-spacing: 0.08em;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
}

.main-nav {
  display: flex;
  gap: 28px;
}

.main-nav a {
  color: rgba(255,255,255,0.82);
  font-size: 0.95rem;
  padding: 6px 2px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}

.main-nav a:hover,
.main-nav a.active {
  color: #fff;
  border-bottom-color: var(--gold);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-toggle span {
  display: block;
  height: 2px;
  background: #fff;
  border-radius: 2px;
}

/* ---------------- Hero ---------------- */

.hero {
  background: linear-gradient(180deg, var(--navy) 0%, var(--navy-deep) 100%);
  color: #fff;
  padding: 56px 0 72px;
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: "";
  position: absolute;
  right: -80px;
  top: -80px;
  width: 320px;
  height: 320px;
  border: 1px solid rgba(200,155,60,0.25);
  border-radius: 50%;
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  color: var(--gold);
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 14px;
}

.hero h1 {
  font-size: clamp(1.9rem, 4vw, 2.7rem);
  font-weight: 700;
  line-height: 1.35;
  margin: 0 0 16px;
  max-width: 640px;
}

.hero p.lead {
  color: rgba(255,255,255,0.78);
  font-size: 1.05rem;
  max-width: 560px;
  margin: 0 0 32px;
}

/* Search box */

.search-box {
  max-width: 560px;
  display: flex;
  background: #fff;
  border-radius: var(--radius-m);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 15px 18px;
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--ink);
}

.search-box button {
  border: none;
  background: var(--gold);
  color: var(--navy-deep);
  font-weight: 700;
  padding: 0 24px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.15s;
}

.search-box button:hover { background: #dcb04e; }

.hero-qa-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  color: var(--gold-soft);
  font-size: 0.92rem;
  border-bottom: 1px solid rgba(232,217,176,0.4);
  padding-bottom: 2px;
}

.hero-qa-link:hover { color: var(--gold); border-color: var(--gold); }

/* ---------------- Section headings ---------------- */

.section {
  padding: 52px 0;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 14px;
}

.section-head h2 {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.section-head h2 .cn-index {
  color: var(--gold);
  font-size: 1rem;
  font-family: Georgia, serif;
  font-style: italic;
}

.section-head a.see-all {
  font-size: 0.88rem;
  color: var(--ink-soft);
  white-space: nowrap;
}

.section-head a.see-all:hover { color: var(--rust); }

/* ---------------- Category grid ---------------- */

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

.cat-card {
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-left: 3px solid var(--navy);
  padding: 18px 18px 16px;
  transition: border-color 0.15s, transform 0.15s;
}

.cat-card:hover {
  border-left-color: var(--gold);
  transform: translateY(-2px);
}

.cat-card .cat-icon {
  font-size: 1.4rem;
  display: block;
  margin-bottom: 8px;
}

.cat-card .cat-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 4px;
}

.cat-card .cat-desc {
  font-size: 0.82rem;
  color: var(--ink-soft);
  line-height: 1.5;
}

.cat-card .cat-count {
  display: inline-block;
  margin-top: 10px;
  font-size: 0.75rem;
  color: var(--gold);
  font-weight: 600;
}

/* ---------------- Article cards / list ---------------- */

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.article-card {
  background: var(--paper-raised);
  border: 1px solid var(--line);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.15s, border-color 0.15s;
}

.article-card:hover {
  border-color: var(--navy);
  box-shadow: 4px 4px 0 var(--gold-soft);
}

.article-card .cat-tag {
  font-size: 0.72rem;
  color: var(--navy);
  background: var(--gold-soft);
  align-self: flex-start;
  padding: 2px 9px;
  border-radius: 2px;
  font-weight: 600;
}

.article-card h3 {
  font-size: 1.05rem;
  margin: 0;
  line-height: 1.4;
}

.article-card p {
  font-size: 0.88rem;
  color: var(--ink-soft);
  margin: 0;
  flex: 1;
}

.article-card .meta {
  font-size: 0.76rem;
  color: #9a917a;
  margin-top: 4px;
}

/* list variant (search results / category listing) */

.article-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.article-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px 4px;
  border-bottom: 1px solid var(--line);
}

.article-row:hover .article-row-title { color: var(--rust); }

.article-row-title {
  font-weight: 700;
  font-size: 1rem;
  flex: 1;
  min-width: 200px;
}

.article-row-summary {
  color: var(--ink-soft);
  font-size: 0.86rem;
  flex: 2;
  min-width: 200px;
}

.article-row-meta {
  font-size: 0.78rem;
  color: #9a917a;
  white-space: nowrap;
}

/* ---------------- Qa banner ---------------- */

.qa-banner {
  background: var(--rust);
  color: #fff;
  padding: 28px 0;
}

.qa-banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.qa-banner h3 {
  margin: 0 0 6px;
  font-size: 1.15rem;
}

.qa-banner p {
  margin: 0;
  color: rgba(255,255,255,0.85);
  font-size: 0.9rem;
}

.qa-banner .btn-ghost {
  border: 1px solid rgba(255,255,255,0.5);
  padding: 10px 20px;
  font-size: 0.88rem;
  white-space: nowrap;
  transition: background 0.15s;
}

.qa-banner .btn-ghost:hover { background: rgba(255,255,255,0.15); }

/* ---------------- Breadcrumb ---------------- */

.breadcrumb {
  font-size: 0.85rem;
  color: var(--ink-soft);
  margin-bottom: 18px;
}

.breadcrumb a:hover { color: var(--rust); }

.breadcrumb .sep { margin: 0 6px; color: var(--line); }

/* ---------------- Article page ---------------- */

.article-page {
  max-width: var(--content-narrow);
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.article-page .cat-tag {
  font-size: 0.75rem;
  color: var(--navy);
  background: var(--gold-soft);
  padding: 3px 10px;
  border-radius: 2px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 14px;
}

.article-page h1 {
  font-size: clamp(1.6rem, 3.4vw, 2.1rem);
  line-height: 1.4;
  margin: 0 0 10px;
}

.article-page .meta {
  color: #9a917a;
  font-size: 0.85rem;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.article-body h3 {
  font-size: 1.15rem;
  margin: 28px 0 10px;
  color: var(--navy);
}

.article-body p {
  margin: 0 0 16px;
  font-size: 1rem;
  color: #2a3050;
}

.article-body ul {
  margin: 0 0 16px;
  padding-left: 1.3em;
}

.article-body li {
  margin-bottom: 6px;
}

.article-body strong { color: var(--navy); }

.related-box {
  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.related-box h4 {
  font-size: 0.95rem;
  color: var(--ink-soft);
  margin: 0 0 12px;
  font-weight: 700;
}

.related-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-links a {
  font-size: 0.94rem;
  color: var(--navy);
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
}

.related-links a:hover { color: var(--rust); }

.back-row {
  margin-top: 40px;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.back-row a {
  font-size: 0.9rem;
  color: var(--navy);
  font-weight: 600;
}

.back-row a:hover { color: var(--rust); }

/* ---------------- Category page ---------------- */

.cat-page-head {
  background: var(--navy);
  color: #fff;
  padding: 40px 0;
}

.cat-page-head .cat-icon-big { font-size: 2rem; display: block; margin-bottom: 10px; }
.cat-page-head h1 { margin: 0 0 8px; font-size: 1.7rem; }
.cat-page-head p { margin: 0; color: rgba(255,255,255,0.75); }

/* ---------------- QA placeholder page ---------------- */

.qa-page {
  max-width: var(--content-narrow);
  margin: 0 auto;
  padding: 60px 24px 90px;
  text-align: center;
}

.qa-page .qa-icon { font-size: 2.6rem; margin-bottom: 16px; }
.qa-page h1 { font-size: 1.6rem; margin-bottom: 14px; }
.qa-page p { color: var(--ink-soft); font-size: 1rem; max-width: 460px; margin: 0 auto 8px; }

.qa-roadmap {
  margin-top: 36px;
  text-align: left;
  display: inline-block;
  border: 1px solid var(--line);
  padding: 20px 28px;
  background: var(--paper-raised);
}

.qa-roadmap h4 {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: var(--gold);
  text-transform: none;
}

.qa-roadmap ul { margin: 0; padding-left: 1.2em; color: var(--ink-soft); font-size: 0.9rem; }
.qa-roadmap li { margin-bottom: 5px; }

/* ---------------- Empty state ---------------- */

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--ink-soft);
}

.empty-state .empty-icon { font-size: 2rem; margin-bottom: 12px; }

/* ---------------- QA / Forum widgets ---------------- */

.qa-page-wide {
  max-width: var(--content-width);
}

.qa-list-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  text-align: left;
  margin-bottom: 20px;
}

.qa-list-head h1 {
  font-size: 1.6rem;
  margin: 0 0 6px;
  text-align: left;
}

.qa-sub {
  color: var(--ink-soft);
  margin: 0;
  text-align: left;
}

.btn-primary {
  display: inline-block;
  background: var(--navy);
  color: #fff;
  border: none;
  padding: 11px 22px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-s);
  white-space: nowrap;
  transition: background 0.15s;
}

.btn-primary:hover { background: var(--navy-deep); }

.btn-link {
  background: none;
  border: none;
  color: var(--rust);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.btn-link:hover { text-decoration: underline; }

.qa-auth-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--paper-raised);
  border: 1px solid var(--line);
  padding: 12px 18px;
  font-size: 0.9rem;
  color: var(--ink-soft);
  margin-bottom: 24px;
  border-radius: var(--radius-s);
}

.post-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.post-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 4px;
  border-bottom: 1px solid var(--line);
}

.post-row:hover .post-row-title { color: var(--rust); }

.post-row-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.post-row-title {
  font-weight: 700;
  font-size: 1rem;
}

.post-row-snippet {
  font-size: 0.85rem;
  color: var(--ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 0.78rem;
  color: #9a917a;
  white-space: nowrap;
}

/* Post form (new post / reply) */

.post-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.post-form label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--navy);
  margin-top: 6px;
}

.post-form input,
.post-form select,
.post-form textarea {
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-s);
  background: var(--paper-raised);
  color: var(--ink);
  resize: vertical;
}

.post-form input:focus,
.post-form select:focus,
.post-form textarea:focus {
  outline: none;
  border-color: var(--navy);
}

/* Replies */

.reply-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reply-item {
  border-left: 2px solid var(--gold-soft);
  padding-left: 14px;
}

.reply-meta {
  font-size: 0.78rem;
  color: #9a917a;
  margin-bottom: 4px;
}

.reply-content {
  font-size: 0.94rem;
  color: #2a3050;
}

/* Error / hint text */

.modal-error {
  color: var(--rust);
  font-size: 0.82rem;
  margin: 0;
  min-height: 1em;
}

.modal-hint {
  color: #2f7a4f;
  font-size: 0.82rem;
  margin: 0;
}

/* ---------------- Auth modal ---------------- */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 28, 51, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-box {
  background: var(--paper-raised);
  width: 100%;
  max-width: 400px;
  padding: 32px 28px 28px;
  position: relative;
  border-radius: var(--radius-m);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--ink-soft);
  cursor: pointer;
  line-height: 1;
}

.modal-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.modal-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 10px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.modal-tab.active {
  color: var(--navy);
  border-bottom-color: var(--gold);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-form input {
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-s);
}

.modal-form input:focus {
  outline: none;
  border-color: var(--navy);
}

.modal-form .btn-primary {
  margin-top: 4px;
  text-align: center;
}

@media (max-width: 760px) {
  .qa-list-head { flex-direction: column; align-items: stretch; }
  .post-row { flex-direction: column; align-items: flex-start; gap: 6px; }
  .post-row-meta { flex-direction: row; gap: 10px; }
  .qa-auth-bar { flex-direction: column; align-items: flex-start; gap: 8px; }
}

/* ---------------- Footer ---------------- */

.site-footer {
  border-top: 1px solid var(--line);
  padding: 28px 0 40px;
  margin-top: 20px;
}

.footer-inner p {
  margin: 0 0 4px;
  font-size: 0.85rem;
  color: var(--ink-soft);
}

.footer-sub { color: #a39c88 !important; font-size: 0.78rem !important; }

/* ---------------- Responsive ---------------- */

@media (max-width: 760px) {
  .main-nav { display: none; }
  .nav-toggle { display: flex; }

  .main-nav.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--navy);
    padding: 12px 24px 20px;
    gap: 4px;
    border-bottom: 3px solid var(--gold);
  }

  .main-nav.open a { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }

  .hero { padding: 40px 0 52px; }
  .search-box { flex-direction: column; box-shadow: none; border: 1px solid var(--line); }
  .search-box button { padding: 13px; }

  .article-row { flex-direction: column; gap: 4px; }

  .qa-banner-inner { flex-direction: column; align-items: flex-start; }

  .section { padding: 36px 0; }
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; scroll-behavior: auto !important; }
}

/* Focus visibility */
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 2px solid var(--rust);
  outline-offset: 2px;
}
