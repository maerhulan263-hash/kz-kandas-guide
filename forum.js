/**
 * ============================================================
 * 哈知手册 · 问答社区逻辑
 * 依赖 config.js 中的 supabaseClient。
 * 路由（在 script.js 的 route() 里接入）：
 *   #/qa                本社区首页：帖子列表 + 登录/发帖入口
 *   #/qa/new             发新帖（需要登录）
 *   #/qa/post/<id>       帖子详情 + 回复
 * ============================================================
 */

let currentUser = null; // { id, email, nickname } | null

// ---------- 会话管理 ----------

async function refreshSession() {
  const { data } = await supabaseClient.auth.getSession();
  const session = data.session;
  if (!session) {
    currentUser = null;
    return;
  }
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("nickname")
    .eq("id", session.user.id)
    .single();

  currentUser = {
    id: session.user.id,
    email: session.user.email,
    nickname: profile ? profile.nickname : "用户",
  };
}

supabaseClient.auth.onAuthStateChange(() => {
  // 登录状态变化时，如果用户正停留在问答相关页面，重新渲染
  if (location.hash.startsWith("#/qa")) {
    route();
  }
});

// ---------- 工具 ----------

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  return new Date(iso).toLocaleDateString("zh-CN");
}

function authWidgetHtml() {
  if (currentUser) {
    return `
      <div class="qa-auth-bar">
        <span>你好，<strong>${escapeHtml(currentUser.nickname)}</strong></span>
        <button class="btn-link" id="logoutBtn">退出登录</button>
      </div>
    `;
  }
  return `
    <div class="qa-auth-bar">
      <span>登录后可以发帖、回复</span>
      <button class="btn-link" id="showAuthBtn">登录 / 注册</button>
    </div>
  `;
}

function bindAuthWidget() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
    });
  }
  const showAuthBtn = document.getElementById("showAuthBtn");
  if (showAuthBtn) {
    showAuthBtn.addEventListener("click", () => {
      renderAuthModal();
    });
  }
}

// ---------- 登录/注册 弹层 ----------

function renderAuthModal() {
  const existing = document.getElementById("authModal");
  if (existing) existing.remove();

  const wrap = document.createElement("div");
  wrap.id = "authModal";
  wrap.className = "modal-overlay";
  wrap.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="authModalClose">×</button>
      <div class="modal-tabs">
        <button class="modal-tab active" data-tab="login">登录</button>
        <button class="modal-tab" data-tab="register">注册</button>
      </div>

      <form id="loginForm" class="modal-form">
        <input type="email" id="loginEmail" placeholder="邮箱" required autocomplete="email">
        <input type="password" id="loginPassword" placeholder="密码" required autocomplete="current-password">
        <p class="modal-error" id="loginError"></p>
        <button type="submit" class="btn-primary">登录</button>
      </form>

      <form id="registerForm" class="modal-form" style="display:none;">
        <input type="text" id="registerNickname" placeholder="昵称（会公开显示）" required maxlength="20">
        <input type="email" id="registerEmail" placeholder="邮箱" required autocomplete="email">
        <input type="password" id="registerPassword" placeholder="密码（至少 6 位）" required minlength="6" autocomplete="new-password">
        <p class="modal-error" id="registerError"></p>
        <p class="modal-hint" id="registerHint"></p>
        <button type="submit" class="btn-primary">注册</button>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);

  document.getElementById("authModalClose").addEventListener("click", () => wrap.remove());
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap) wrap.remove();
  });

  const tabs = wrap.querySelectorAll(".modal-tab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const isLogin = tab.dataset.tab === "login";
      loginForm.style.display = isLogin ? "flex" : "none";
      registerForm.style.display = isLogin ? "none" : "flex";
    });
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      errorEl.textContent = "登录失败：邮箱或密码不对，或者账号还没验证邮箱。";
      return;
    }
    wrap.remove();
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nickname = document.getElementById("registerNickname").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const errorEl = document.getElementById("registerError");
    const hintEl = document.getElementById("registerHint");
    errorEl.textContent = "";
    hintEl.textContent = "";

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    });

    if (error) {
      errorEl.textContent = "注册失败：" + (error.message.includes("already registered") ? "这个邮箱已经注册过了" : "请检查邮箱格式和密码长度");
      return;
    }
    hintEl.textContent = "注册成功！大多数情况下需要先去邮箱点击确认链接，然后才能登录。";
  });
}

// ---------- 问答首页：帖子列表 ----------

async function renderQA() {
  await refreshSession();

  app.innerHTML = `
    <div class="qa-page qa-page-wide">
      <div class="breadcrumb"><a href="#/">首页</a><span class="sep">/</span>问答社区</div>
      <div class="qa-list-head">
        <div>
          <h1>问答社区</h1>
          <p class="qa-sub">有具体问题？在这里提问，或者看看别人遇到过的坑。</p>
        </div>
        <a href="#/qa/new" class="btn-primary" id="newPostBtn">✏️ 发新帖</a>
      </div>
      <div id="authWidgetSlot"></div>
      <div id="postListSlot"><div class="empty-state"><p>加载中…</p></div></div>
    </div>
  `;

  document.getElementById("authWidgetSlot").innerHTML = authWidgetHtml();
  bindAuthWidget();

  document.getElementById("newPostBtn").addEventListener("click", (e) => {
    if (!currentUser) {
      e.preventDefault();
      renderAuthModal();
    }
  });

  const { data: posts, error } = await supabaseClient
    .from("posts")
    .select("id, title, content, category, created_at, profiles(nickname)")
    .order("created_at", { ascending: false })
    .limit(50);

  const slot = document.getElementById("postListSlot");
  if (error) {
    slot.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>加载失败，请刷新重试。</p></div>`;
    return;
  }
  if (!posts || posts.length === 0) {
    slot.innerHTML = `<div class="empty-state"><div class="empty-icon">💬</div><p>还没有人发帖，第一个提问的人是你？</p></div>`;
    return;
  }

  slot.innerHTML = `
    <div class="post-list">
      ${posts
        .map(
          (p) => `
        <a class="post-row" href="#/qa/post/${p.id}">
          <div class="post-row-main">
            <span class="post-row-title">${escapeHtml(p.title)}</span>
            <span class="post-row-snippet">${escapeHtml(p.content.slice(0, 60))}${p.content.length > 60 ? "…" : ""}</span>
          </div>
          <div class="post-row-meta">
            <span>${escapeHtml(p.profiles ? p.profiles.nickname : "匿名")}</span>
            <span>${timeAgo(p.created_at)}</span>
          </div>
        </a>
      `
        )
        .join("")}
    </div>
  `;
}

// ---------- 发新帖 ----------

async function renderNewPost() {
  await refreshSession();

  if (!currentUser) {
    app.innerHTML = `
      <div class="qa-page">
        <div class="qa-icon">🔒</div>
        <h1>需要先登录</h1>
        <p>登录或注册之后才能发帖。</p>
        <div class="back-row" style="justify-content:center; margin-top:24px;">
          <button class="btn-primary" id="goLoginBtn">登录 / 注册</button>
        </div>
        <div class="back-row" style="justify-content:center; margin-top:16px;">
          <a href="#/qa">← 返回问答社区</a>
        </div>
      </div>
    `;
    document.getElementById("goLoginBtn").addEventListener("click", () => renderAuthModal());
    return;
  }

  app.innerHTML = `
    <div class="article-page">
      <div class="breadcrumb"><a href="#/">首页</a><span class="sep">/</span><a href="#/qa">问答社区</a><span class="sep">/</span>发新帖</div>
      <h1>发新帖</h1>
      <form id="newPostForm" class="post-form">
        <label>分类</label>
        <select id="postCategory">
          ${CATEGORIES.map((c) => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("")}
          <option value="qa-general" selected>💬 综合提问</option>
        </select>
        <label>标题</label>
        <input type="text" id="postTitle" required maxlength="80" placeholder="用一句话概括你的问题">
        <label>正文</label>
        <textarea id="postContent" required rows="8" placeholder="具体描述一下情况，方便大家帮你解答"></textarea>
        <p class="modal-error" id="postError"></p>
        <div class="back-row">
          <button type="submit" class="btn-primary">发布</button>
          <a href="#/qa">取消</a>
        </div>
      </form>
    </div>
  `;

  document.getElementById("newPostForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("postTitle").value.trim();
    const content = document.getElementById("postContent").value.trim();
    const category = document.getElementById("postCategory").value;
    const errorEl = document.getElementById("postError");

    const { data, error } = await supabaseClient
      .from("posts")
      .insert({ title, content, category, user_id: currentUser.id })
      .select("id")
      .single();

    if (error) {
      errorEl.textContent = "发布失败，请稍后重试。";
      return;
    }
    location.hash = `#/qa/post/${data.id}`;
  });
}

// ---------- 帖子详情 ----------

async function renderPostDetail(id) {
  app.innerHTML = `<div class="article-page"><div class="empty-state"><p>加载中…</p></div></div>`;
  await refreshSession();

  const { data: post, error } = await supabaseClient
    .from("posts")
    .select("id, title, content, category, created_at, user_id, profiles(nickname)")
    .eq("id", id)
    .single();

  if (error || !post) {
    renderNotFound();
    return;
  }

  const { data: replies } = await supabaseClient
    .from("replies")
    .select("id, content, created_at, user_id, profiles(nickname)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const cat = getCategory(post.category);

  app.innerHTML = `
    <div class="article-page">
      <div class="breadcrumb"><a href="#/">首页</a><span class="sep">/</span><a href="#/qa">问答社区</a></div>
      <span class="cat-tag">${cat ? cat.name : "综合提问"}</span>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="meta">${escapeHtml(post.profiles ? post.profiles.nickname : "匿名")} · ${timeAgo(post.created_at)}</div>
      <div class="article-body"><p>${escapeHtml(post.content).replace(/\n/g, "<br>")}</p></div>

      <div class="related-box">
        <h4>${replies && replies.length ? replies.length + " 条回复" : "还没有回复"}</h4>
        <div class="reply-list" id="replyList">
          ${
            replies && replies.length
              ? replies
                  .map(
                    (r) => `
              <div class="reply-item">
                <div class="reply-meta">${escapeHtml(r.profiles ? r.profiles.nickname : "匿名")} · ${timeAgo(r.created_at)}</div>
                <div class="reply-content">${escapeHtml(r.content).replace(/\n/g, "<br>")}</div>
              </div>
            `
                  )
                  .join("")
              : ""
          }
        </div>
      </div>

      <div id="replyFormSlot"></div>

      <div class="back-row">
        <a href="#/qa">← 返回问答社区</a>
      </div>
    </div>
  `;

  const slot = document.getElementById("replyFormSlot");
  if (currentUser) {
    slot.innerHTML = `
      <form id="replyForm" class="post-form" style="margin-top:20px;">
        <textarea id="replyContent" required rows="3" placeholder="写下你的回复"></textarea>
        <p class="modal-error" id="replyError"></p>
        <button type="submit" class="btn-primary">回复</button>
      </form>
    `;
    document.getElementById("replyForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = document.getElementById("replyContent").value.trim();
      const { error: replyErr } = await supabaseClient
        .from("replies")
        .insert({ post_id: id, content, user_id: currentUser.id });
      if (replyErr) {
        document.getElementById("replyError").textContent = "回复失败，请稍后重试。";
        return;
      }
      renderPostDetail(id);
    });
  } else {
    slot.innerHTML = `
      <div class="qa-auth-bar" style="margin-top:20px;">
        <span>登录后可以回复</span>
        <button class="btn-link" id="replyLoginBtn">登录 / 注册</button>
      </div>
    `;
    document.getElementById("replyLoginBtn").addEventListener("click", () => renderAuthModal());
  }
}
