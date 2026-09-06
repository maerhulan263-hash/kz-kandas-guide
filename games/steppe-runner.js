/**
 * ============================================================
 * 草原骑手 Steppe Runner · Phase 1 核心引擎
 * ============================================================
 * 本文件只实现 Phase 1（真正可玩的核心）：
 *   Canvas 渲染、骑马角色、自动奔跑、跳跃、下蹲、
 *   障碍生成与碰撞、速度随距离平滑提升、计分、Game Over、Retry
 *
 * 暂不包含（留到后续阶段）：
 *   - Phase 2：哈萨克草原背景层、山脉/湖泊/蒙古包/马群/昼夜/天气
 *   - Phase 3：Combo 连击、道具、特殊事件、音效、进阶手势
 *   - Phase 4：Supabase 排行榜、今日/本周/总榜、防作弊
 *
 * 扩展点说明（方便以后接入真正美术资源）：
 *   - drawPlayer()   未来替换成 sprite 动画，只需改这一个函数
 *   - drawObstacle() 同上，按 obstacle.avoid / key 分支绘制
 *   - OBSTACLE_TYPES 未来加新障碍类型，在这个数组里加一项即可
 * ============================================================
 */

(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const wrap = document.getElementById("gameWrap");

  const startScreen = document.getElementById("startScreen");
  const pauseScreen = document.getElementById("pauseScreen");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const gameHud = document.getElementById("gameHud");
  const hudDistance = document.getElementById("hudDistance");
  const hudScore = document.getElementById("hudScore");
  const finalDistance = document.getElementById("finalDistance");
  const finalScore = document.getElementById("finalScore");
  const finalBest = document.getElementById("finalBest");

  const BEST_KEY = "steppeRunnerBest";

  let CW = 900, CH = 500;
  let DPR = window.devicePixelRatio || 1;
  let GROUND_Y = CH * 0.8;

  function resize() {
    const rect = wrap.getBoundingClientRect();
    CW = rect.width;
    CH = rect.height;
    DPR = window.devicePixelRatio || 1;
    canvas.width = CW * DPR;
    canvas.height = CH * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    GROUND_Y = CH * 0.8;
    if (player) player.x = CW * 0.25;
  }

  // ---------- 游戏状态 ----------

  const STATE = { READY: "ready", RUNNING: "running", PAUSED: "paused", DEAD: "dead" };
  let state = STATE.READY;

  let distanceMeters = 0;
  let score = 0;
  let worldSpeed = 0;
  let scrolledSinceStart = 0;
  const PIXELS_PER_METER = 18;

  // ---------- 玩家 ----------

  const player = {
    x: 0,
    y: 0,      // 离地高度，0 = 站在地上
    vy: 0,
    standHeight: 62,
    duckHeight: 32,
    width: 74,
    ducking: false,
    onGround: true,
    legPhase: 0,
  };

  const GRAVITY = 2600;
  const JUMP_VELOCITY = 980;

  function playerHeight() {
    return player.ducking && player.onGround ? player.duckHeight : player.standHeight;
  }

  function playerHitbox() {
    const h = playerHeight();
    const feetY = GROUND_Y - player.y;
    return {
      top: feetY - h,
      bottom: feetY,
      left: player.x - player.width / 2 + 8,
      right: player.x + player.width / 2 - 8,
    };
  }

  function jump() {
    if (player.onGround && !player.ducking) {
      player.vy = JUMP_VELOCITY; // 向上的初速度
      player.onGround = false;
    }
  }

  function setDuck(v) {
    if (player.onGround) player.ducking = v;
  }

  function physicsStep(dt) {
    if (!player.onGround) {
      player.vy -= GRAVITY * dt;
      player.y += player.vy * dt;
      if (player.y <= 0) {
        player.y = 0;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }

  // ---------- 障碍物 ----------
  // avoid: "jump" 需要跳过去；"duck" 需要蹲过去

  const OBSTACLE_TYPES = [
    { key: "rock", avoid: "jump", width: 46, height: 46, color: "#8a8a86" },
    { key: "tree", avoid: "jump", width: 40, height: 78, color: "#5b4636" },
    { key: "fence", avoid: "duck", width: 70, height: 20, gapAboveGround: 40, color: "#7a5a35" },
  ];

  let obstacles = [];
  let nextSpawnDistance = 600;

  function resetObstacles() {
    obstacles = [];
    scrolledSinceStart = 0;
    nextSpawnDistance = 600;
  }

  function scheduleNextSpawn() {
    // 跳跃完整耗时约 0.75s（起跳到落地），这里的下限必须明显超过这个数字，
    // 否则可能出现"上一次跳跃还没落地，下一个障碍已经逼近"的不公平情况。
    // 不随速度提高而缩短这个时间下限，难度提升交给障碍密度/随机性，不牺牲公平性。
    const minGapTime = 0.95;
    const jitter = Math.random() * 0.5;
    nextSpawnDistance = scrolledSinceStart + worldSpeed * (minGapTime + jitter) + 40;
  }

  function spawnObstacle() {
    const def = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    obstacles.push({
      key: def.key,
      avoid: def.avoid,
      width: def.width,
      height: def.height,
      gapAboveGround: def.gapAboveGround || 0,
      color: def.color,
      x: CW + 40,
    });
  }

  function obstacleHitbox(o) {
    if (o.avoid === "duck") {
      return {
        left: o.x,
        right: o.x + o.width,
        bottom: GROUND_Y - o.gapAboveGround,
        top: GROUND_Y - o.gapAboveGround - o.height - 40,
      };
    }
    return {
      left: o.x,
      right: o.x + o.width,
      bottom: GROUND_Y,
      top: GROUND_Y - o.height,
    };
  }

  function aabbOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  // ---------- 速度曲线：平滑增长，不突变 ----------

  function speedForDistance(distM) {
    const base = 300;
    const maxAdd = 420;
    const ramp = 1 - Math.exp(-distM / 3200);
    return base + maxAdd * ramp;
  }

  // ---------- 绘制（占位美术，方便以后换 sprite） ----------

  function drawSky() {
    ctx.fillStyle = "#87b8d8";
    ctx.fillRect(0, 0, CW, CH);
  }

  function drawGround(scrollX) {
    ctx.fillStyle = "#c9a24b";
    ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    const tickGap = 60;
    const offset = scrollX % tickGap;
    for (let x = -offset; x < CW; x += tickGap) {
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y + 6);
      ctx.lineTo(x + 30, GROUND_Y + 6);
      ctx.stroke();
    }
  }

  function drawPlayer() {
    const feetY = GROUND_Y - player.y;
    const cx = player.x;
    const h = playerHeight();

    ctx.save();
    ctx.translate(cx, feetY);

    const horseH = h * 0.62;
    ctx.fillStyle = "#6b4a30";
    ctx.beginPath();
    ctx.ellipse(0, -horseH * 0.5, 42, horseH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#4a3220";
    ctx.lineWidth = 6;
    const legSwing = Math.sin(player.legPhase) * 10;
    [[-24, legSwing], [-8, -legSwing], [10, legSwing], [26, -legSwing]].forEach(([lx, sw]) => {
      ctx.beginPath();
      ctx.moveTo(lx, -horseH * 0.15);
      ctx.lineTo(lx + sw * 0.3, 0);
      ctx.stroke();
    });

    ctx.fillStyle = "#5b3f28";
    ctx.beginPath();
    ctx.ellipse(38, -horseH * 0.75, 14, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();

    if (!player.ducking) {
      ctx.fillStyle = "#2a3050";
      ctx.fillRect(-10, -horseH - 30, 20, 28);
      ctx.fillStyle = "#e8d9b0";
      ctx.beginPath();
      ctx.arc(0, -horseH - 38, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#2a3050";
      ctx.fillRect(-10, -horseH - 14, 22, 16);
    }

    ctx.restore();
  }

  function drawObstacle(o) {
    if (o.avoid === "duck") {
      const barBottom = GROUND_Y - o.gapAboveGround;
      const barTop = barBottom - o.height;
      ctx.fillStyle = "#5b4636";
      ctx.fillRect(o.x + 6, barTop, 8, o.height + o.gapAboveGround);
      ctx.fillRect(o.x + o.width - 14, barTop, 8, o.height + o.gapAboveGround);
      ctx.fillStyle = o.color;
      ctx.fillRect(o.x, barTop, o.width, o.height);
    } else if (o.key === "tree") {
      ctx.fillStyle = "#5b4636";
      ctx.fillRect(o.x + o.width / 2 - 6, GROUND_Y - o.height, 12, o.height);
      ctx.fillStyle = "#3f6b3a";
      ctx.beginPath();
      ctx.ellipse(o.x + o.width / 2, GROUND_Y - o.height, o.width / 2 + 6, 28, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = o.color;
      ctx.beginPath();
      ctx.ellipse(o.x + o.width / 2, GROUND_Y - o.height / 2, o.width / 2, o.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---------- 主循环 ----------

  let lastTime = 0;

  function resetGame() {
    distanceMeters = 0;
    score = 0;
    worldSpeed = speedForDistance(0);
    player.y = 0;
    player.vy = 0;
    player.onGround = true;
    player.ducking = false;
    player.x = CW * 0.25;
    resetObstacles();
  }

  function startGame() {
    resetGame();
    state = STATE.RUNNING;
    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    pauseScreen.style.display = "none";
    gameHud.style.display = "flex";
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function endGame() {
    state = STATE.DEAD;
    gameHud.style.display = "none";
    const best = Math.max(Math.floor(score), parseInt(localStorage.getItem(BEST_KEY) || "0", 10));
    localStorage.setItem(BEST_KEY, String(best));
    finalDistance.textContent = Math.floor(distanceMeters).toLocaleString("ru-RU") + " m";
    finalScore.textContent = Math.floor(score).toLocaleString("ru-RU");
    finalBest.textContent = best.toLocaleString("ru-RU");
    gameOverScreen.style.display = "flex";
  }

  function togglePause() {
    if (state === STATE.RUNNING) {
      state = STATE.PAUSED;
      pauseScreen.style.display = "flex";
    } else if (state === STATE.PAUSED) {
      state = STATE.RUNNING;
      pauseScreen.style.display = "none";
      lastTime = performance.now();
      requestAnimationFrame(loop);
    }
  }

  function loop(now) {
    if (state !== STATE.RUNNING) return;
    let dt = (now - lastTime) / 1000;
    dt = Math.min(dt, 0.05);
    lastTime = now;

    update(dt);
    render();

    if (state === STATE.RUNNING) requestAnimationFrame(loop);
  }

  function update(dt) {
    worldSpeed = speedForDistance(distanceMeters);
    const scrollPx = worldSpeed * dt;
    distanceMeters += scrollPx / PIXELS_PER_METER;
    score += (scrollPx / PIXELS_PER_METER) * 10;

    physicsStep(dt);
    player.legPhase += dt * (8 + worldSpeed / 60);

    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= scrollPx;
      if (obstacles[i].x + obstacles[i].width < -60) obstacles.splice(i, 1);
    }

    scrolledSinceStart += scrollPx;
    if (scrolledSinceStart >= nextSpawnDistance) {
      spawnObstacle();
      scheduleNextSpawn();
    }

    const hb = playerHitbox();
    for (const o of obstacles) {
      if (aabbOverlap(hb, obstacleHitbox(o))) {
        endGame();
        return;
      }
    }

    hudDistance.textContent = Math.floor(distanceMeters).toLocaleString("ru-RU");
    hudScore.textContent = Math.floor(score).toLocaleString("ru-RU");
  }

  function render() {
    drawSky();
    drawGround(scrolledSinceStart);
    for (const o of obstacles) drawObstacle(o);
    drawPlayer();
  }

  // ---------- 输入 ----------

  function handleJumpInput() {
    if (state === STATE.READY) { startGame(); return; }
    if (state === STATE.DEAD) { startGame(); return; }
    if (state === STATE.RUNNING) jump();
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      handleJumpInput();
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      if (state === STATE.RUNNING) setDuck(true);
    } else if (e.code === "KeyP") {
      if (state === STATE.RUNNING || state === STATE.PAUSED) togglePause();
    } else if (e.code === "KeyR") {
      if (state === STATE.DEAD || state === STATE.RUNNING) startGame();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowDown") setDuck(false);
  });

  // 触屏：点击=跳跃，向下滑动=下蹲
  let touchStartY = null;
  let touchStartTime = 0;

  wrap.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  wrap.addEventListener("touchend", (e) => {
    if (touchStartY === null) return;
    const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
    const dy = endY - touchStartY;
    const dt = Date.now() - touchStartTime;

    if (dy > 40) {
      setDuck(true);
      setTimeout(() => setDuck(false), 650);
    } else if (dt < 250) {
      handleJumpInput();
    }
    touchStartY = null;
  });

  document.getElementById("startBtn").addEventListener("click", startGame);
  document.getElementById("retryBtn").addEventListener("click", startGame);
  document.getElementById("resumeBtn").addEventListener("click", togglePause);

  // ---------- 初始化 ----------

  window.addEventListener("resize", resize);
  resize();

  const savedBest = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
  if (savedBest > 0) {
    const hint = document.querySelector(".overlay-hint");
    if (hint) hint.insertAdjacentHTML("afterend", `<p class="overlay-controls">历史最高分：${savedBest.toLocaleString("ru-RU")}</p>`);
  }

  drawSky();
  drawGround(0);
})();
