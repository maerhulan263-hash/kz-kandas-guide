/**
 * ============================================================
 * 哈知手册 · 哈国生活计算器
 * ============================================================
 * 路由：
 *   #/calculator            工具入口（8个计算器的导航页）
 *   #/calculator/cost        月生活成本计算器
 *   #/calculator/salary      工资到手计算器
 *   #/calculator/rent        房租值不值计算器
 *   #/calculator/food        外卖 vs 自己做饭
 *   #/calculator/commute     通勤计算器
 *   #/calculator/exchange    汇率购买力计算器
 *   #/calculator/level       我属于什么生活水平
 *   #/calculator/student     留学生生存预算
 *
 * ------------------------------------------------------------
 * 基准数据来源说明（写在这里方便以后更新维护）：
 *   - 阿拉木图人均最低生活保障线：71,515 ₸/月（2026年一季度，哈萨克斯坦国家统计局）
 *   - 全国平均工资 461,486 ₸；阿拉木图平均工资 574,162 ₸；全国工资中位数 331,527 ₸（2026年一季度）
 *   - 阿拉木图一居室房租：普通区约 178,000–200,000 ₸/月，市中心约 250,000–400,000 ₸/月
 *   - 最低工资（МЗП）2026：85,000 ₸；MRP 2026：4,325 ₸
 *   - 个税：ОПВ 10%（封顶50倍МЗП）、ВОСМС 2%（封顶20倍МЗП）、
 *     ИПН 10%（计税基数 = 工资-ОПВ-ВОСМС-30倍MRP，基数为负则不缴税）
 *   - 阿拉木图公交/地铁单次刷卡票价 80 ₸，成人月票 9,900 ₸，学生月票 4,200 ₸
 *   - 人民币兑坚戈参考汇率 1 CNY ≈ 69 ₸（会随市场波动，仅供换算参考）
 * 这些数字都会随时间变化，页面里会标注数据时间，建议定期更新。
 * ============================================================
 */

const CALC_BENCHMARKS = {
  almatyPovertyLine: 71515,
  nationalAvgSalary: 461486,
  almatyAvgSalary: 574162,
  nationalMedianSalary: 331527,
  almatyRentRegular: [178000, 200000],
  almatyRentCenter: [250000, 400000],
  minWage2026: 85000,
  mrp2026: 4325,
  busFareCard: 80,
  busPassAdult: 9900,
  busPassStudent: 4200,
  cnyToKzt: 69,
};

function fmtT(n) {
  n = Math.round(n);
  return n.toLocaleString("ru-RU") + " ₸";
}

function fmtCny(n) {
  return "¥" + Math.round(n).toLocaleString("zh-CN");
}

function calcDataNote() {
  return `<p class="calc-data-note">📊 页面内的物价、工资、税率等基准数据均标注了来源和时间（2026年数据），仅供参考，实际情况会随时间和个人情况变化，重要决策请以最新官方信息为准。</p>`;
}

// ---------- 入口页 ----------

function renderCalculatorHub() {
  const tools = [
    { id: "cost", icon: "🧮", name: "月生活成本计算器", desc: "拆项输入房租、吃饭、交通等，算出你的月生活成本属于什么档次" },
    { id: "salary", icon: "💰", name: "工资到手计算器", desc: "从工资条到实际到手金额，支持正算和反算" },
    { id: "rent", icon: "🏠", name: "房租值不值计算器", desc: "把房租、通勤时间都折算成钱，看这套房子到底划不划算" },
    { id: "food", icon: "🍳", name: "外卖 vs 自己做饭", desc: "算清楚这个选择一年下来到底差多少钱" },
    { id: "commute", icon: "🚌", name: "通勤计算器", desc: "公交、地铁、打车，不同方式的月成本一次看清" },
    { id: "exchange", icon: "💱", name: "汇率购买力计算器", desc: "人民币换成坚戈之后，在阿拉木图能买到什么" },
    { id: "level", icon: "📊", name: "我属于什么生活水平", desc: "跟本地真实工资、房租数据对比，看看自己的水平和结余能力" },
    { id: "student", icon: "🎒", name: "留学生生存预算", desc: "选城市、选生活方式，自动生成一份月度/年度预算" },
  ];

  app.innerHTML = `
    <section class="cat-page-head">
      <div class="container">
        <h1>🇰🇿 哈国生活计算器</h1>
        <p>把哈萨克斯坦的真实物价、工资、税率，做成几个能直接算的小工具</p>
      </div>
    </section>
    <section class="section container">
      <div class="breadcrumb"><a href="#/">首页</a><span class="sep">/</span>哈国生活计算器</div>
      <div class="calc-hub-grid">
        ${tools
          .map(
            (t) => `
          <a class="calc-hub-card" href="#/calculator/${t.id}">
            <span class="calc-hub-icon">${t.icon}</span>
            <span class="calc-hub-name">${t.name}</span>
            <span class="calc-hub-desc">${t.desc}</span>
          </a>
        `
          )
          .join("")}
      </div>
      ${calcDataNote()}
    </section>
  `;
}

// ---------- 通用小组件 ----------

function calcPageShell(title, subtitle, bodyHtml) {
  return `
    <div class="calc-page">
      <div class="breadcrumb"><a href="#/">首页</a><span class="sep">/</span><a href="#/calculator">哈国生活计算器</a></div>
      <h1>${title}</h1>
      <p class="calc-subtitle">${subtitle}</p>
      ${bodyHtml}
      ${calcDataNote()}
    </div>
  `;
}

function inputRow(id, label, placeholder, unit = "₸") {
  return `
    <div class="calc-input-row">
      <label for="${id}">${label}</label>
      <div class="calc-input-wrap">
        <input type="number" id="${id}" min="0" placeholder="${placeholder}">
        <span class="calc-unit">${unit}</span>
      </div>
    </div>
  `;
}

function num(id) {
  const el = document.getElementById(id);
  const v = el ? parseFloat(el.value) : 0;
  return isNaN(v) ? 0 : v;
}

// ---------- 1. 月生活成本计算器 ----------

function renderCostCalculator() {
  const fields = [
    ["rent", "房租"],
    ["utilities", "水电暖"],
    ["phone", "手机/网费"],
    ["food", "吃饭"],
    ["transport", "交通"],
    ["fun", "娱乐"],
    ["daily", "日用品"],
    ["medical", "医疗"],
    ["other", "其他"],
  ];

  const presets = {
    student: { rent: 90000, utilities: 15000, phone: 6000, food: 60000, transport: 9900, fun: 20000, daily: 15000, medical: 5000, other: 10000 },
    worker: { rent: 180000, utilities: 25000, phone: 8000, food: 90000, transport: 15000, fun: 40000, daily: 20000, medical: 10000, other: 20000 },
    couple: { rent: 250000, utilities: 35000, phone: 14000, food: 150000, transport: 25000, fun: 60000, daily: 30000, medical: 15000, other: 25000 },
    solo: { rent: 150000, utilities: 20000, phone: 8000, food: 70000, transport: 12000, fun: 30000, daily: 18000, medical: 8000, other: 15000 },
  };

  const body = `
    <div class="calc-preset-row">
      <span>快速填入：</span>
      <button class="calc-preset-btn" data-preset="student">🎓 学生模式</button>
      <button class="calc-preset-btn" data-preset="worker">💼 上班族模式</button>
      <button class="calc-preset-btn" data-preset="couple">💑 情侣模式</button>
      <button class="calc-preset-btn" data-preset="solo">🏠 一人独居模式</button>
    </div>
    <div class="calc-form">
      ${inputRow("costIncome", "你的月收入（选填，用来算结余）", "500000")}
    </div>
    <div class="calc-form">
      ${fields.map(([id, label]) => inputRow(id, label, "0")).join("")}
    </div>
    <div class="calc-result-box" id="costResult"></div>
  `;

  app.innerHTML = calcPageShell("月生活成本计算器", "拆项输入你的每月开销，算出总成本和大致档次", body);

  function tierOf(total) {
    if (total < 150000) return { name: "极简", color: "#2f7a4f" };
    if (total < 300000) return { name: "普通", color: "#1e2a4a" };
    if (total < 500000) return { name: "舒适", color: "#c89b3c" };
    return { name: "比较阔", color: "#a84b3f" };
  }

  function recalc() {
    const total = fields.reduce((sum, [id]) => sum + num(id), 0);
    const tier = tierOf(total);
    const income = num("costIncome");

    let incomeLine = "";
    if (income > 0) {
      const left = income - total;
      const yearly = left * 12;
      incomeLine = `
        <p>你填的月收入是 ${fmtT(income)}，每月大约能剩 <strong>${fmtT(left)}</strong></p>
        <p>照这个节奏，一年大约能存 <strong>${fmtT(Math.max(yearly, 0))}</strong></p>
        ${left < 0 ? `<p class="calc-warning">⚠️ 支出已经超过收入了，可能需要精简一些开销，或者去"我属于什么生活水平"那个工具里再详细看看。</p>` : ""}
      `;
    } else {
      incomeLine = `<p class="calc-hint">在上面填一下你的月收入，可以看到每月能剩多少、一年能存多少。</p>`;
    }

    document.getElementById("costResult").innerHTML = `
      <div class="calc-result-main">你的月生活成本：<strong>${fmtT(total)}</strong></div>
      <div class="calc-tier-badge" style="background:${tier.color}">属于：${tier.name}</div>
      <div class="calc-result-detail">
        ${incomeLine}
      </div>
    `;
  }

  document.getElementById("costIncome").addEventListener("input", recalc);

  fields.forEach(([id]) => document.getElementById(id).addEventListener("input", recalc));
  document.querySelectorAll(".calc-preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = presets[btn.dataset.preset];
      fields.forEach(([id]) => (document.getElementById(id).value = preset[id]));
      recalc();
    });
  });
  recalc();
}

// ---------- 2. 工资到手计算器 ----------

function renderSalaryCalculator() {
  const body = `
    <div class="calc-tabs">
      <button class="calc-tab active" data-mode="forward">正算：我税前拿多少，到手多少</button>
      <button class="calc-tab" data-mode="reverse">反算：我想到手多少，税前要谈多少</button>
    </div>
    <div class="calc-form" id="salaryForwardForm">
      ${inputRow("grossSalary", "税前月工资（Gross）", "500000")}
    </div>
    <div class="calc-form" id="salaryReverseForm" style="display:none;">
      ${inputRow("targetNet", "想要的到手月薪", "500000")}
    </div>
    <div class="calc-result-box" id="salaryResult"></div>
    <p class="calc-fine-print">计算依据 2026 年税制：ОПВ 10%（封顶 50 倍最低工资）、ВОСМС 2%（封顶 20 倍最低工资）、ИПН 10%（计税基数 = 工资－ОПВ－ВОСМС－30倍MRP免征额，MRP 2026 = 4,325 ₸）。不包含年收入超过约 3,676 万 ₸ 触发的 15% 累进部分，以及多子女、残障等专项减免，仅供大致参考，精确数字请咨询财务/会计。</p>
  `;

  app.innerHTML = calcPageShell("工资到手计算器", "从税前工资算实际到手，或者反过来算该跟公司谈多少", body);

  const MZP = CALC_BENCHMARKS.minWage2026;
  const MRP = CALC_BENCHMARKS.mrp2026;
  const deduction30MRP = 30 * MRP;

  function grossToNet(gross) {
    const opv = Math.min(gross, 50 * MZP) * 0.1;
    const vosms = Math.min(gross, 20 * MZP) * 0.02;
    const taxBase = Math.max(0, gross - opv - vosms - deduction30MRP);
    const ipn = taxBase * 0.1;
    const net = gross - opv - vosms - ipn;
    return { opv, vosms, ipn, net };
  }

  function renderForward() {
    const gross = num("grossSalary");
    if (gross <= 0) {
      document.getElementById("salaryResult").innerHTML = "";
      return;
    }
    const { opv, vosms, ipn, net } = grossToNet(gross);
    document.getElementById("salaryResult").innerHTML = `
      <div class="calc-breakdown">
        <div class="calc-breakdown-row"><span>税前工资 Gross</span><span>${fmtT(gross)}</span></div>
        <div class="calc-breakdown-row calc-minus"><span>ОПВ 养老金 (10%)</span><span>－${fmtT(opv)}</span></div>
        <div class="calc-breakdown-row calc-minus"><span>ВОСМС 医疗保险 (2%)</span><span>－${fmtT(vosms)}</span></div>
        <div class="calc-breakdown-row calc-minus"><span>ИПН 个人所得税</span><span>－${fmtT(ipn)}</span></div>
      </div>
      <div class="calc-result-main">实际到手：<strong>${fmtT(net)}</strong></div>
    `;
  }

  function renderReverse() {
    const target = num("targetNet");
    if (target <= 0) {
      document.getElementById("salaryResult").innerHTML = "";
      return;
    }
    // 二分法反推 gross
    let lo = target, hi = target * 1.6;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const { net } = grossToNet(mid);
      if (net < target) lo = mid; else hi = mid;
    }
    const gross = (lo + hi) / 2;
    const { opv, vosms, ipn } = grossToNet(gross);
    document.getElementById("salaryResult").innerHTML = `
      <div class="calc-result-main">要到手 ${fmtT(target)}，大约需要跟公司谈：<strong>${fmtT(gross)}</strong>（税前）</div>
      <div class="calc-breakdown">
        <div class="calc-breakdown-row calc-minus"><span>ОПВ 养老金</span><span>－${fmtT(opv)}</span></div>
        <div class="calc-breakdown-row calc-minus"><span>ВОСМС 医疗保险</span><span>－${fmtT(vosms)}</span></div>
        <div class="calc-breakdown-row calc-minus"><span>ИПН 个人所得税</span><span>－${fmtT(ipn)}</span></div>
      </div>
    `;
  }

  document.getElementById("grossSalary").addEventListener("input", renderForward);
  document.getElementById("targetNet").addEventListener("input", renderReverse);

  document.querySelectorAll(".calc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".calc-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const isForward = tab.dataset.mode === "forward";
      document.getElementById("salaryForwardForm").style.display = isForward ? "flex" : "none";
      document.getElementById("salaryReverseForm").style.display = isForward ? "none" : "flex";
      document.getElementById("salaryResult").innerHTML = "";
    });
  });
}

// ---------- 3. 房租值不值计算器 ----------

function renderRentCalculator() {
  const body = `
    <div class="calc-form">
      ${inputRow("rentAmount", "月房租", "200000")}
      ${inputRow("rentUtilities", "水电/коммуналка（如果房租不含）", "0")}
      ${inputRow("rentIncome", "你的月收入（用于算占比，可不填）", "0")}
      ${inputRow("rentPeople", "合住人数（自己住填1）", "1", "人")}
      ${inputRow("commuteMinutes", "单程通勤时间", "30", "分钟")}
      ${inputRow("commuteDays", "每月通勤天数", "22", "天")}
    </div>
    <div class="calc-result-box" id="rentResult"></div>
    <p class="calc-fine-print">参考：2026年阿拉木图普通区一居室房租约 178,000–200,000 ₸/月，市中心约 250,000–400,000 ₸/月（数据来源 OLX Казахстан / Relokant.online）。</p>
  `;

  app.innerHTML = calcPageShell("房租值不值计算器", "把房租和通勤时间都折算成钱，帮你判断这套房子划不划算", body);

  const fields = ["rentAmount", "rentUtilities", "rentIncome", "rentPeople", "commuteMinutes", "commuteDays"];

  function recalc() {
    const rent = num("rentAmount");
    const utilities = num("rentUtilities");
    const income = num("rentIncome");
    const people = Math.max(1, num("rentPeople") || 1);
    const commuteMin = num("commuteMinutes");
    const commuteDays = num("commuteDays") || 22;

    if (rent <= 0) {
      document.getElementById("rentResult").innerHTML = "";
      return;
    }

    const perPersonCost = (rent + utilities) / people;
    const dailyCost = perPersonCost / 30;
    const monthlyCommuteHours = (commuteMin * 2 * commuteDays) / 60;
    const rentRatio = income > 0 ? (perPersonCost / income) * 100 : null;

    document.getElementById("rentResult").innerHTML = `
      <div class="calc-result-main">你实际承担的月住房成本：<strong>${fmtT(perPersonCost)}</strong></div>
      <div class="calc-result-detail">
        <p>平摊到每天：约 ${fmtT(dailyCost)}</p>
        <p>每月通勤总时长：约 ${monthlyCommuteHours.toFixed(1)} 小时</p>
        ${
          rentRatio !== null
            ? `<p>占你月收入的比例：<strong>${rentRatio.toFixed(0)}%</strong>${rentRatio > 30 ? "（一般经验上超过 30% 会有点吃力）" : "（在常见的 30% 参考线以内）"}</p>`
            : `<p>填一下月收入，可以看到房租占收入的比例</p>`
        }
        <p class="calc-hint">阿拉木图普通区一居室参考价约 178,000–200,000 ₸，市中心约 250,000–400,000 ₸，可以对照看看现在这套房子处于什么水平。</p>
      </div>
    `;
  }

  fields.forEach((id) => document.getElementById(id).addEventListener("input", recalc));
}

// ---------- 4. 外卖 vs 自己做饭 ----------

function renderFoodCalculator() {
  const body = `
    <div class="calc-form">
      ${inputRow("cookCost", "自己做饭，每天大约花", "1800")}
      ${inputRow("takeoutCost", "点外卖/在外面吃，每天大约花", "5000")}
    </div>
    <div class="calc-result-box" id="foodResult"></div>
  `;

  app.innerHTML = calcPageShell("外卖 vs 自己做饭", "算清楚这个每天的小选择，一年下来差多少钱", body);

  function recalc() {
    const cook = num("cookCost");
    const takeout = num("takeoutCost");
    if (cook <= 0 && takeout <= 0) {
      document.getElementById("foodResult").innerHTML = "";
      return;
    }
    const cookMonth = cook * 30;
    const takeoutMonth = takeout * 30;
    const diffYear = (takeout - cook) * 365;

    document.getElementById("foodResult").innerHTML = `
      <div class="calc-compare-row">
        <div class="calc-compare-card">
          <div class="calc-compare-label">自己做饭</div>
          <div class="calc-compare-value">${fmtT(cook)}/天</div>
          <div class="calc-compare-sub">约 ${fmtT(cookMonth)}/月</div>
        </div>
        <div class="calc-compare-vs">VS</div>
        <div class="calc-compare-card">
          <div class="calc-compare-label">外卖/在外吃</div>
          <div class="calc-compare-value">${fmtT(takeout)}/天</div>
          <div class="calc-compare-sub">约 ${fmtT(takeoutMonth)}/月</div>
        </div>
      </div>
      <div class="calc-result-main" style="margin-top:16px;">一年下来，两者相差：<strong>${fmtT(Math.abs(diffYear))}</strong> ${diffYear > 0 ? "（外卖更贵）" : diffYear < 0 ? "（做饭更贵，可能是食材买多了或口味比较讲究）" : ""}</div>
    `;
  }

  document.getElementById("cookCost").addEventListener("input", recalc);
  document.getElementById("takeoutCost").addEventListener("input", recalc);
  recalc();
}

// ---------- 5. 通勤计算器 ----------

function renderCommuteCalculator() {
  const body = `
    <div class="calc-form">
      ${inputRow("commuteTripsPerDay", "每天往返趟数（一般填2，来回各一次）", "2", "趟")}
      ${inputRow("commuteDaysPerMonth", "每月通勤天数", "22", "天")}
      ${inputRow("commuteTaxiPrice", "打车（Yandex Go / inDrive）单程大约费用", "1200")}
      ${inputRow("commuteCarCost", "自驾单程油费/停车等大约成本（可不填）", "0")}
    </div>
    <div class="calc-result-box" id="commuteResult"></div>
    <p class="calc-fine-print">公交/地铁按阿拉木图 2026 年刷卡票价 80 ₸/次、成人月票 9,900 ₸、学生月票 4,200 ₸ 计算；打车和自驾费用波动较大，以你实际填的单价为准。</p>
  `;

  app.innerHTML = calcPageShell("通勤计算器", "公交、地铁、打车，一次性看清每种方式的月成本和年成本", body);

  const fields = ["commuteTripsPerDay", "commuteDaysPerMonth", "commuteTaxiPrice", "commuteCarCost"];

  function recalc() {
    const trips = num("commuteTripsPerDay") || 2;
    const days = num("commuteDaysPerMonth") || 22;
    const taxiPrice = num("commuteTaxiPrice");
    const carCost = num("commuteCarCost");

    const monthlyTrips = trips * days;
    const busCardMonth = monthlyTrips * CALC_BENCHMARKS.busFareCard;
    const busPassMonth = CALC_BENCHMARKS.busPassAdult;
    const busStudentPassMonth = CALC_BENCHMARKS.busPassStudent;
    const taxiMonth = monthlyTrips * taxiPrice;
    const carMonth = monthlyTrips * carCost;

    const options = [
      { name: "公交/地铁（单次刷卡）", month: busCardMonth },
      { name: "公交/地铁（成人月票）", month: busPassMonth },
      { name: "公交/地铁（学生月票）", month: busStudentPassMonth },
      { name: "打车（Yandex Go / inDrive）", month: taxiMonth },
    ];
    if (carCost > 0) options.push({ name: "自驾", month: carMonth });

    const cheapest = options.reduce((min, o) => (o.month < min.month ? o : min));
    const priciest = options.reduce((max, o) => (o.month > max.month ? o : max));
    const yearDiff = (priciest.month - cheapest.month) * 12;

    document.getElementById("commuteResult").innerHTML = `
      <div class="calc-breakdown">
        ${options
          .map(
            (o) => `
          <div class="calc-breakdown-row">
            <span>${o.name}</span>
            <span>${fmtT(o.month)}/月</span>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="calc-result-detail" style="margin-top:12px;">
        <p>最省的是 <strong>${cheapest.name}</strong>，最贵的是 <strong>${priciest.name}</strong></p>
        <p>两者一年下来相差：<strong>${fmtT(yearDiff)}</strong></p>
      </div>
    `;
  }

  fields.forEach((id) => document.getElementById(id).addEventListener("input", recalc));
  recalc();
}

// ---------- 6. 汇率购买力计算器 ----------

function renderExchangeCalculator() {
  const body = `
    <div class="calc-form">
      ${inputRow("cnyAmount", "人民币金额", "10000", "¥")}
      ${inputRow("exchangeRate", "参考汇率（1 CNY = ? ₸，可自行修改）", CALC_BENCHMARKS.cnyToKzt, "₸")}
    </div>
    <div class="calc-result-box" id="exchangeResult"></div>
    <p class="calc-fine-print">参考汇率取自 2026 年 8 月市场汇率，实际汇率每天波动，兑换前请查当天实时汇率。下面的购买力换算基于本站整理的阿拉木图房租、公交票价等参考基准，仅作直观感受，不是精确统计。</p>
  `;

  app.innerHTML = calcPageShell("汇率购买力计算器", "人民币换成坚戈之后，在阿拉木图到底能买到什么", body);

  function recalc() {
    const cny = num("cnyAmount");
    const rate = num("exchangeRate") || CALC_BENCHMARKS.cnyToKzt;
    if (cny <= 0) {
      document.getElementById("exchangeResult").innerHTML = "";
      return;
    }
    const kzt = cny * rate;
    const rentMonths = kzt / 190000; // 取普通区房租中间值
    const busRides = kzt / CALC_BENCHMARKS.busFareCard;
    const mealTimes = kzt / 2000; // 普通一餐参考区间中值
    const coffeeTimes = kzt / 1200; // 咖啡厅一杯参考中值

    document.getElementById("exchangeResult").innerHTML = `
      <div class="calc-result-main">¥${cny.toLocaleString("zh-CN")} ≈ <strong>${fmtT(kzt)}</strong></div>
      <div class="calc-result-detail">
        <p>大约可以支付：</p>
        <ul>
          <li>房租（普通区一居室）：约 <strong>${rentMonths.toFixed(1)} 个月</strong></li>
          <li>公交/地铁：约 <strong>${Math.floor(busRides)} 次</strong></li>
          <li>普通一餐（快餐/食堂水平）：约 <strong>${Math.floor(mealTimes)} 次</strong></li>
          <li>咖啡厅饮品：约 <strong>${Math.floor(coffeeTimes)} 杯</strong></li>
        </ul>
        <p class="calc-hint">餐饮、咖啡的参考价是大致区间估算，不同店铺和城市差异较大，仅供直观感受用。</p>
      </div>
    `;
  }

  document.getElementById("cnyAmount").addEventListener("input", recalc);
  document.getElementById("exchangeRate").addEventListener("input", recalc);
  recalc();
}

// ---------- 7. 我属于什么生活水平 ----------

function renderLevelCalculator() {
  const body = `
    <div class="calc-form">
      ${inputRow("levelIncome", "你的月收入", "800000")}
      ${inputRow("levelRent", "月房租", "250000")}
    </div>
    <div class="calc-result-box" id="levelResult"></div>
    <p class="calc-fine-print">对比基准（2026年一季度，阿拉木图）：全国工资中位数 331,527 ₸、全国平均工资 461,486 ₸、阿拉木图平均工资 574,162 ₸、阿拉木图人均最低生活保障线 71,515 ₸。这是本站根据公开统计数据做的估算模型，不代表任何官方阶层认定。</p>
  `;

  app.innerHTML = calcPageShell("我属于什么生活水平", "跟阿拉木图真实工资、房租数据对比一下，供参考的自评估模型", body);

  function recalc() {
    const income = num("levelIncome");
    const rent = num("levelRent");
    if (income <= 0) {
      document.getElementById("levelResult").innerHTML = "";
      return;
    }

    const B = CALC_BENCHMARKS;
    let levelLabel, levelDesc;
    if (income < B.almatyPovertyLine * 1.5) {
      levelLabel = "紧张";
      levelDesc = "收入接近或低于阿拉木图的最低生活保障线附近，建议优先保障基本开销，谨慎消费。";
    } else if (income < B.nationalMedianSalary) {
      levelLabel = "偏低";
      levelDesc = "低于全国工资中位数，在阿拉木图这种生活成本较高的城市里会感觉手头偏紧。";
    } else if (income < B.nationalAvgSalary) {
      levelLabel = "中等偏下";
      levelDesc = "高于全国中位数，但还没到全国平均水平。";
    } else if (income < B.almatyAvgSalary) {
      levelLabel = "中等";
      levelDesc = "高于全国平均工资，接近阿拉木图本地平均工资水平。";
    } else if (income < B.almatyAvgSalary * 1.8) {
      levelLabel = "中等偏上";
      levelDesc = "明显高于阿拉木图平均工资，生活会比较宽裕。";
    } else {
      levelLabel = "较高";
      levelDesc = "远高于阿拉木图平均工资水平，属于收入较高的一档。";
    }

    const rentRatio = rent > 0 ? (rent / income) * 100 : 0;
    let housingPressure;
    if (rentRatio === 0) housingPressure = "未填写房租";
    else if (rentRatio < 20) housingPressure = "很轻松";
    else if (rentRatio < 30) housingPressure = "合理";
    else if (rentRatio < 45) housingPressure = "偏高";
    else housingPressure = "压力较大";

    const estimatedLeft = income - rent;
    const yearlyLeft = estimatedLeft * 12;

    document.getElementById("levelResult").innerHTML = `
      <div class="calc-result-main">生活水平：<strong>${levelLabel}</strong></div>
      <div class="calc-result-detail">
        <p>${levelDesc}</p>
        <p>住房压力：<strong>${housingPressure}</strong>${rentRatio > 0 ? `（房租占收入 ${rentRatio.toFixed(0)}%）` : ""}</p>
        <p>扣除房租后，大致结余：约 ${fmtT(estimatedLeft)}/月</p>
        <p>如果保持这个节奏，一年大约能存：约 ${fmtT(Math.max(yearlyLeft, 0))}</p>
        <p class="calc-hint">这里只算了房租，其他开销（吃饭、交通等）可以去"月生活成本计算器"里详细拆算，再回来对照结余情况会更准确。</p>
      </div>
    `;
  }

  document.getElementById("levelIncome").addEventListener("input", recalc);
  document.getElementById("levelRent").addEventListener("input", recalc);
  recalc();
}

// ---------- 8. 留学生生存预算 ----------

function renderStudentBudgetCalculator() {
  const budgets = {
    almaty: {
      极省: { rent: 80000, food: 55000, transport: 4200, phone: 5000, utilities: 12000, daily: 10000, fun: 8000, medical: 5000, misc: 8000 },
      普通: { rent: 130000, food: 80000, transport: 9900, phone: 7000, utilities: 18000, daily: 15000, fun: 20000, medical: 8000, misc: 12000 },
      舒适: { rent: 220000, food: 120000, transport: 15000, phone: 10000, utilities: 25000, daily: 20000, fun: 40000, medical: 12000, misc: 20000 },
    },
    astana: {
      极省: { rent: 85000, food: 55000, transport: 4500, phone: 5000, utilities: 15000, daily: 10000, fun: 8000, medical: 5000, misc: 8000 },
      普通: { rent: 140000, food: 80000, transport: 10000, phone: 7000, utilities: 22000, daily: 15000, fun: 20000, medical: 8000, misc: 12000 },
      舒适: { rent: 230000, food: 120000, transport: 16000, phone: 10000, utilities: 30000, daily: 20000, fun: 40000, medical: 12000, misc: 20000 },
    },
  };

  const labels = {
    rent: "房租", food: "食物", transport: "交通", phone: "手机/网费",
    utilities: "水电", daily: "日用品", fun: "娱乐", medical: "医疗", misc: "签证/证件等杂费",
  };

  const body = `
    <div class="calc-form">
      <div class="calc-input-row">
        <label>城市</label>
        <select id="studentCity">
          <option value="almaty">阿拉木图</option>
          <option value="astana">阿斯塔纳</option>
        </select>
      </div>
      <div class="calc-input-row">
        <label>生活方式</label>
        <select id="studentLifestyle">
          <option value="极省">极省</option>
          <option value="普通" selected>普通</option>
          <option value="舒适">舒适</option>
        </select>
      </div>
      <div class="calc-input-row">
        <label>学费（每年，可不填，因不同学校差异极大）</label>
        <div class="calc-input-wrap">
          <input type="number" id="studentTuition" min="0" placeholder="0">
          <span class="calc-unit">₸/年</span>
        </div>
      </div>
    </div>
    <div class="calc-result-box" id="studentResult"></div>
    <p class="calc-fine-print">阿拉木图各档位参考本站整理的真实房租、公交票价等数据；阿斯塔纳数据置信度略低于阿拉木图，建议再结合当地实际询价核实。学费因学校、专业差异极大，此处不做默认估算，需要自己填写才会计入总预算。</p>
  `;

  app.innerHTML = calcPageShell("留学生生存预算", "选城市、选生活方式，自动生成一份月度/年度预算参考", body);

  function recalc() {
    const city = document.getElementById("studentCity").value;
    const lifestyle = document.getElementById("studentLifestyle").value;
    const tuitionYear = num("studentTuition");
    const b = budgets[city][lifestyle];

    const monthTotal = Object.values(b).reduce((a, c) => a + c, 0);
    const tuitionMonth = tuitionYear / 12;
    const grandMonthTotal = monthTotal + tuitionMonth;
    const grandYearTotal = grandMonthTotal * 12;
    const cny = grandYearTotal / CALC_BENCHMARKS.cnyToKzt;

    document.getElementById("studentResult").innerHTML = `
      <div class="calc-breakdown">
        ${Object.entries(b)
          .map(([k, v]) => `<div class="calc-breakdown-row"><span>${labels[k]}</span><span>${fmtT(v)}</span></div>`)
          .join("")}
        ${tuitionYear > 0 ? `<div class="calc-breakdown-row"><span>学费（分摊到月）</span><span>${fmtT(tuitionMonth)}</span></div>` : ""}
      </div>
      <div class="calc-result-main" style="margin-top:12px;">每月预计：<strong>${fmtT(grandMonthTotal)}</strong></div>
      <div class="calc-result-detail">
        <p>每年预计：约 ${fmtT(grandYearTotal)}</p>
        <p>折合人民币：约 ${fmtCny(cny)}</p>
      </div>
    `;
  }

  document.getElementById("studentCity").addEventListener("change", recalc);
  document.getElementById("studentLifestyle").addEventListener("change", recalc);
  document.getElementById("studentTuition").addEventListener("input", recalc);
  recalc();
}
