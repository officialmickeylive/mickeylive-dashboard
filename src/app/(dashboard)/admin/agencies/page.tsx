'use client';

import React, { useState, useMemo } from 'react';

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = ({ p, s = 14, sw = 2 }: { p: string | string[]; s?: number; sw?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(p) ? p : [p]).map((d, i) => <path key={i} d={d} />)}
  </svg>
);
const I = {
  Download:  () => <Ic p={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} />,
  Calendar:  () => <Ic p={["M8 2v4M16 2v4M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"]} />,
  Building:  () => <Ic p="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />,
  Filter:    () => <Ic p="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  User:      () => <Ic p={["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]} />,
  Diamond:   () => <Ic p="M12 2L2 9l10 13L22 9z" />,
  Coin:      () => <Ic p={["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z","M12 6v12","M8 10l4-4 4 4"]} />,
  Clock:     () => <Ic p={["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z","M12 6v6l4 2"]} />,
  ChevD:     () => <Ic p="M6 9l6 6 6-6" />,
  Left:      () => <Ic p="M15 18l-6-6 6-6" />,
  Right:     () => <Ic p="M9 18l6-6-6-6" />,
  DLeft:     () => <Ic p={["M11 17l-5-5 5-5","M18 17l-5-5 5-5"]} />,
  DRight:    () => <Ic p={["M13 17l5-5-5-5","M6 17l5-5-5-5"]} />,
  Check:     () => <Ic p="M20 6L9 17l-5-5" />,
  Report:    () => <Ic p={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />,
  X:         () => <Ic p="M18 6L6 18M6 6l12 12" />,
  Star:      () => <Ic p="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const AGENCIES = [
  { id: 'AG1', name: 'Stellar Talent',  tier: 'ELITE',   status: 'ACTIVE',   commission: 15 },
  { id: 'AG2', name: 'Neon Streamers',  tier: 'PRO',     status: 'ACTIVE',   commission: 12 },
  { id: 'AG3', name: 'Void Nexus',      tier: 'STARTER', status: 'INACTIVE', commission: 10 },
  { id: 'AG4', name: 'Aether Media',    tier: 'PRO',     status: 'ACTIVE',   commission: 12 },
  { id: 'AG5', name: 'Quantum Guild',   tier: 'PRO',     status: 'ACTIVE',   commission: 12 },
  { id: 'AG6', name: 'Solar Syndicate', tier: 'ELITE',   status: 'ACTIVE',   commission: 15 },
];

const HOSTS = [
  { id: 'H001', name: 'Luna Divine',   agencyId: 'AG1', joinDate: '2023-03-12', liveDays: 89,  totalHours: 312, totalSecs: 1123200, diamonds: 85000,  coins: 210000 },
  { id: 'H002', name: 'Cyber Queen',   agencyId: 'AG1', joinDate: '2022-11-20', liveDays: 210, totalHours: 891, totalSecs: 3207600, diamonds: 450000, coins: 980000 },
  { id: 'H003', name: 'Shadow Dancer', agencyId: 'AG2', joinDate: '2023-08-01', liveDays: 34,  totalHours: 98,  totalSecs: 352800,  diamonds: 12000,  coins: 85000  },
  { id: 'H004', name: 'Storm Breaker', agencyId: 'AG2', joinDate: '2023-10-05', liveDays: 28,  totalHours: 76,  totalSecs: 273600,  diamonds: 9800,   coins: 56000  },
  { id: 'H005', name: 'Neon Viper',    agencyId: 'AG3', joinDate: '2024-03-22', liveDays: 8,   totalHours: 19,  totalSecs: 68400,   diamonds: 4100,   coins: 22000  },
  { id: 'H006', name: 'Nova Spark',    agencyId: 'AG4', joinDate: '2024-02-14', liveDays: 12,  totalHours: 28,  totalSecs: 100800,  diamonds: 2500,   coins: 15000  },
  { id: 'H007', name: 'Frost Byte',    agencyId: 'AG4', joinDate: '2024-01-09', liveDays: 19,  totalHours: 52,  totalSecs: 187200,  diamonds: 7200,   coins: 34000  },
  { id: 'H008', name: 'Pixel Phoenix', agencyId: 'AG5', joinDate: '2023-06-18', liveDays: 78,  totalHours: 228, totalSecs: 820800,  diamonds: 61000,  coins: 190000 },
  { id: 'H009', name: 'Echo Pulse',    agencyId: 'AG5', joinDate: '2023-09-22', liveDays: 42,  totalHours: 120, totalSecs: 432000,  diamonds: 18000,  coins: 67000  },
  { id: 'H010', name: 'Omega Flash',   agencyId: 'AG6', joinDate: '2022-12-01', liveDays: 145, totalHours: 510, totalSecs: 1836000, diamonds: 130000, coins: 410000 },
  { id: 'H011', name: 'Blaze Star',    agencyId: 'AG6', joinDate: '2023-01-15', liveDays: 55,  totalHours: 180, totalSecs: 648000,  diamonds: 44000,  coins: 145000 },
];

// Diamond → USD conversion rate (1000 diamonds = $1)zz
const DIAMOND_RATE = 0.001;
const COIN_RATE    = 0.0001;

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmtN   = (n: number) => n.toLocaleString();
const fmtUSD = (n: number) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fmtT   = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// Proportionally scale host stats to a date range (fraction of year)
function scaleStats(host: typeof HOSTS[0], dateFrom: string, dateTo: string) {
  if (!dateFrom || !dateTo) return host;
  const from  = new Date(dateFrom).getTime();
  const to    = new Date(dateTo).getTime();
  const total = new Date(host.joinDate) > new Date(dateFrom)
    ? new Date('2025-01-01').getTime() - new Date(host.joinDate).getTime()
    : new Date('2025-01-01').getTime() - new Date('2022-01-01').getTime();
  const range = Math.max(0, to - from);
  const ratio = Math.min(1, range / total);
  return {
    ...host,
    liveDays:   Math.round(host.liveDays   * ratio),
    totalHours: Math.round(host.totalHours * ratio),
    totalSecs:  Math.round(host.totalSecs  * ratio),
    diamonds:   Math.round(host.diamonds   * ratio),
    coins:      Math.round(host.coins      * ratio),
  };
}

const TIER_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  ELITE:   { text: '#facc15', bg: 'rgba(250,204,21,0.12)',  border: 'rgba(250,204,21,0.3)'  },
  PRO:     { text: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  border: 'rgba(56,189,248,0.3)'  },
  STARTER: { text: '#94a3b8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.25)'},
};

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function Pagination({ page, total, count, perPage, onChange }: {
  page: number; total: number; count: number; perPage: number; onChange: (p: number) => void;
}) {
  const start = count === 0 ? 0 : (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, count);
  const pages = total <= 7
    ? Array.from({ length: total }, (_, i) => i + 1) as (number | string)[]
    : page <= 4 ? [1,2,3,4,5,'…',total] as (number|string)[]
    : page >= total - 3 ? [1,'…',total-4,total-3,total-2,total-1,total] as (number|string)[]
    : [1,'…',page-1,page,page+1,'…',total] as (number|string)[];

  const b: React.CSSProperties = { height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s', border: 'none', outline: 'none' };
  const idle: React.CSSProperties = { ...b, width: 28, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' };
  const act:  React.CSSProperties = { ...b, width: 28, background: 'rgba(0,255,255,0.14)', color: '#00ffff', border: '1px solid rgba(0,255,255,0.4)' };
  const dis:  React.CSSProperties = { ...b, width: 28, background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.04)', cursor: 'not-allowed' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }}>
      <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)' }}>
        {count === 0 ? 'No results' : <><span style={{ color: '#00ffff' }}>{start}–{end}</span> of {count}</>}
      </span>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <button style={page === 1 ? dis : idle} disabled={page === 1} onClick={() => onChange(1)}><I.DLeft /></button>
        <button style={page === 1 ? dis : idle} disabled={page === 1} onClick={() => onChange(page - 1)}><I.Left /></button>
        {pages.map((p, i) => p === '…'
          ? <span key={`e${i}`} style={{ width: 20, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, userSelect: 'none' }}>·</span>
          : <button key={p} style={page === p ? act : idle} onClick={() => onChange(Number(p))}>{p}</button>
        )}
        <button style={page === total ? dis : idle} disabled={page === total} onClick={() => onChange(page + 1)}><I.Right /></button>
        <button style={page === total ? dis : idle} disabled={page === total} onClick={() => onChange(total)}><I.DRight /></button>
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)' }}>
        pg <span style={{ color: '#fff' }}>{page}/{total}</span>
      </span>
    </div>
  );
}

// ─── REPORT MODAL ─────────────────────────────────────────────────────────────
interface ReportConfig { ratePerHour: number; ratePerDay: number; ratePerDiamond: number; currency: string; }

function ReportModal({ agency, dateFrom, dateTo, onClose }: {
  agency: typeof AGENCIES[0]; dateFrom: string; dateTo: string; onClose: () => void;
}) {
  const [config, setConfig] = useState<ReportConfig>({
    ratePerHour:    5,
    ratePerDay:    50,
    ratePerDiamond: 0.001,
    currency:      'USD',
  });
  const [generating, setGenerating] = useState(false);
  const [pg, setPg] = useState(1);
  const PPP = 8;

  const agencyHosts = useMemo(() =>
    HOSTS
      .filter(h => h.agencyId === agency.id)
      .map(h => scaleStats(h, dateFrom, dateTo)),
    [agency.id, dateFrom, dateTo]
  );

  const hostRows = useMemo(() => agencyHosts.map(h => {
    const incomeFromHours    = h.totalHours * config.ratePerHour;
    const incomeFromDays     = h.liveDays   * config.ratePerDay;
    const incomeFromDiamonds = h.diamonds   * config.ratePerDiamond;
    const totalIncome        = incomeFromHours + incomeFromDays + incomeFromDiamonds;
    const agencyShare        = totalIncome * (agency.commission / 100);
    const hostShare          = totalIncome - agencyShare;
    return { ...h, incomeFromHours, incomeFromDays, incomeFromDiamonds, totalIncome, agencyShare, hostShare };
  }), [agencyHosts, config, agency.commission]);

  const totals = useMemo(() => ({
    liveDays:     hostRows.reduce((s, h) => s + h.liveDays,     0),
    totalHours:   hostRows.reduce((s, h) => s + h.totalHours,   0),
    totalSecs:    hostRows.reduce((s, h) => s + h.totalSecs,    0),
    diamonds:     hostRows.reduce((s, h) => s + h.diamonds,     0),
    coins:        hostRows.reduce((s, h) => s + h.coins,        0),
    totalIncome:  hostRows.reduce((s, h) => s + h.totalIncome,  0),
    agencyShare:  hostRows.reduce((s, h) => s + h.agencyShare,  0),
    hostShare:    hostRows.reduce((s, h) => s + h.hostShare,    0),
  }), [hostRows]);

  const totalPgs = Math.max(1, Math.ceil(hostRows.length / PPP));
  const paged    = hostRows.slice((pg - 1) * PPP, pg * PPP);

  const IS: React.CSSProperties = { height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 11, fontWeight: 700, outline: 'none', fontFamily: 'inherit', padding: '0 10px', boxSizing: 'border-box', width: '100%', transition: 'border-color .2s' };

  // ── PDF GENERATION ───────────────────────────────────────────────────────────
  const downloadPDF = async () => {
    setGenerating(true);
    try {
      // Dynamically load jsPDF from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(script);
      await new Promise<void>((res, rej) => { script.onload = () => res(); script.onerror = () => rej(); });

      // Also load jspdf-autotable
      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
      document.head.appendChild(script2);
      await new Promise<void>((res, rej) => { script2.onload = () => res(); script2.onerror = () => rej(); });

      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210, M = 14;
      const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      const ts  = TIER_STYLE[agency.tier] || TIER_STYLE.STARTER;

      // ── PAGE 1: COVER ──────────────────────────────────────────────────────
      // Dark background
      doc.setFillColor(6, 8, 16);
      doc.rect(0, 0, W, 297, 'F');

      // Top accent bar
      doc.setFillColor(0, 255, 255);
      doc.rect(0, 0, W, 2, 'F');

      // Decorative grid lines
      doc.setDrawColor(255, 255, 255, 0.03);
      doc.setLineWidth(0.1);
      for (let x = 0; x < W; x += 20) { doc.line(x, 0, x, 297); }
      for (let y = 0; y < 297; y += 20) { doc.line(0, y, W, y); }

      // Platform name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 255, 255);
      doc.text('SPARKLIVE PLATFORM  ·  ADMIN PORTAL', M, 18);

      // Report type
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text('Agency Earnings', M, 40);
      doc.setFontSize(28);
      doc.setTextColor(0, 255, 255);
      doc.text('Report', M, 52);

      // Divider line
      doc.setDrawColor(0, 255, 255);
      doc.setLineWidth(0.4);
      doc.line(M, 58, W - M, 58);

      // Agency info box
      doc.setFillColor(15, 20, 35);
      doc.roundedRect(M, 64, W - 2 * M, 52, 4, 4, 'F');
      doc.setDrawColor(0, 200, 210);
      doc.setLineWidth(0.3);
      doc.roundedRect(M, 64, W - 2 * M, 52, 4, 4, 'S');

      doc.setFontSize(10);
      doc.setTextColor(0, 200, 210);
      doc.text('AGENCY', M + 6, 74);
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(agency.name, M + 6, 84);

      doc.setFontSize(8);
      doc.setTextColor(150, 160, 180);
      doc.text(`ID: ${agency.id}`, M + 6, 91);
      doc.text(`Tier: ${agency.tier}`, M + 6, 97);
      doc.text(`Commission Rate: ${agency.commission}%`, M + 6, 103);
      doc.text(`Status: ${agency.status}`, M + 6, 109);

      // Date range box
      doc.setFillColor(20, 12, 35);
      doc.roundedRect(M, 122, W - 2 * M, 38, 4, 4, 'F');
      doc.setDrawColor(168, 85, 247);
      doc.setLineWidth(0.3);
      doc.roundedRect(M, 122, W - 2 * M, 38, 4, 4, 'S');

      doc.setFontSize(8);
      doc.setTextColor(168, 85, 247);
      doc.text('REPORT PERIOD', M + 6, 132);
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`${dateFrom || 'All Time'}  →  ${dateTo || 'Present'}`, M + 6, 143);
      doc.setFontSize(8);
      doc.setTextColor(150, 160, 180);
      doc.text(`Generated on ${now}  ·  ${hostRows.length} host(s) included`, M + 6, 153);

      // Rate config used
      doc.setFillColor(12, 18, 30);
      doc.roundedRect(M, 166, W - 2 * M, 42, 4, 4, 'F');
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(0.3);
      doc.roundedRect(M, 166, W - 2 * M, 42, 4, 4, 'S');

      doc.setFontSize(8);
      doc.setTextColor(255, 215, 0);
      doc.text('INCOME CALCULATION RATES', M + 6, 176);
      doc.setFontSize(9);
      doc.setTextColor(200, 210, 220);
      doc.text(`Rate per Live Hour:     ${config.currency} ${config.ratePerHour.toFixed(2)}`, M + 6, 185);
      doc.text(`Rate per Live Day:      ${config.currency} ${config.ratePerDay.toFixed(2)}`, M + 6, 193);
      doc.text(`Rate per Diamond:       ${config.currency} ${config.ratePerDiamond.toFixed(4)}`, M + 6, 201);

      // Agency totals summary boxes
      const boxes = [
        { label: 'Total Hosts',    value: String(hostRows.length),       color: [0, 255, 255]   },
        { label: 'Total Live Days',value: fmtN(totals.liveDays),         color: [56, 189, 248]  },
        { label: 'Total Hours',    value: `${fmtN(totals.totalHours)}h`, color: [168, 85, 247]  },
        { label: 'Total Diamonds', value: fmtN(totals.diamonds),         color: [191, 0, 255]   },
        { label: 'Total Income',   value: fmtUSD(totals.totalIncome),    color: [34, 197, 94]   },
        { label: 'Agency Earning', value: fmtUSD(totals.agencyShare),    color: [255, 215, 0]   },
      ];
      const bW = (W - 2 * M - 10) / 3;
      boxes.forEach((b, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const bx = M + col * (bW + 5), by = 216 + row * 26;
        doc.setFillColor(10 + b.color[0] * 0.05, 12 + b.color[1] * 0.03, 20 + b.color[2] * 0.04);
        doc.roundedRect(bx, by, bW, 22, 3, 3, 'F');
        doc.setDrawColor(b.color[0], b.color[1], b.color[2]);
        doc.setLineWidth(0.2);
        doc.roundedRect(bx, by, bW, 22, 3, 3, 'S');
        doc.setFontSize(7);
        doc.setTextColor(180, 190, 200);
        doc.text(b.label.toUpperCase(), bx + 4, by + 8);
        doc.setFontSize(11);
        doc.setTextColor(b.color[0], b.color[1], b.color[2]);
        doc.text(b.value, bx + 4, by + 17);
      });

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(80, 90, 110);
      doc.text('CONFIDENTIAL — For authorized personnel only. SparkLive Admin Portal.', M, 290);
      doc.text('Page 1', W - M - 12, 290);

      // ── PAGE 2: HOST EARNINGS TABLE ────────────────────────────────────────
      doc.addPage();
      doc.setFillColor(6, 8, 16);
      doc.rect(0, 0, W, 297, 'F');
      doc.setFillColor(0, 255, 255);
      doc.rect(0, 0, W, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 255, 255);
      doc.text('SPARKLIVE PLATFORM  ·  ADMIN PORTAL', M, 14);
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(`${agency.name} — Host Earnings List`, M, 26);
      doc.setFontSize(8);
      doc.setTextColor(150, 160, 180);
      doc.text(`Period: ${dateFrom || 'All Time'} to ${dateTo || 'Present'}  ·  ${hostRows.length} hosts`, M, 33);

      // Table via autotable
      const tableData = hostRows.map((h, idx) => [
        String(idx + 1),
        h.id,
        h.name,
        fmtN(h.liveDays),
        `${fmtN(h.totalHours)}h`,
        fmtT(h.totalSecs),
        fmtN(h.diamonds),
        fmtN(h.coins),
        fmtUSD(h.incomeFromHours),
        fmtUSD(h.incomeFromDays),
        fmtUSD(h.incomeFromDiamonds),
        fmtUSD(h.totalIncome),
        fmtUSD(h.agencyShare),
        fmtUSD(h.hostShare),
      ]);

      // Totals row
      tableData.push([
        '', '', 'TOTAL',
        fmtN(totals.liveDays),
        `${fmtN(totals.totalHours)}h`,
        fmtT(totals.totalSecs),
        fmtN(totals.diamonds),
        fmtN(totals.coins),
        fmtUSD(totals.totalIncome * (config.ratePerHour / (config.ratePerHour + config.ratePerDay + config.ratePerDiamond * 1000))),
        fmtUSD(totals.totalIncome * (config.ratePerDay / (config.ratePerHour + config.ratePerDay + config.ratePerDiamond * 1000))),
        fmtUSD(49),
        fmtUSD(totals.totalIncome),
        fmtUSD(totals.agencyShare),
        fmtUSD(totals.hostShare),
      ]);

      (doc as any).autoTable({
        startY: 40,
        margin: { left: M, right: M },
        head: [[
          '#', 'Host ID', 'Host Name',
          'Days', 'Hours', 'Time',
          'Diamonds', 'Coins',
          'Hour Income', 'Day Income', 'Diamond Income',
          'Total Income', 'Agency Share', 'Host Share',
        ]],
        body: tableData,
        theme: 'plain',
        styles: {
          font: 'helvetica',
          fontSize: 6.5,
          textColor: [200, 210, 225],
          fillColor: [8, 12, 22],
          lineColor: [30, 40, 60],
          lineWidth: 0.15,
          cellPadding: 2.2,
        },
        headStyles: {
          fillColor: [12, 20, 40],
          textColor: [0, 220, 235],
          fontStyle: 'bold',
          fontSize: 6,
          lineColor: [0, 180, 200],
          lineWidth: 0.3,
        },
        alternateRowStyles: {
          fillColor: [10, 15, 28],
        },
        didParseCell: (data: any) => {
          // Totals row styling
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fillColor = [20, 35, 55];
            data.cell.styles.textColor = [0, 255, 200];
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fontSize  = 7;
          }
          // Income columns highlight
          if ([11].includes(data.column.index) && data.section === 'body') {
            data.cell.styles.textColor = [34, 197, 94];
            data.cell.styles.fontStyle = 'bold';
          }
          if ([12].includes(data.column.index) && data.section === 'body') {
            data.cell.styles.textColor = [255, 215, 0];
          }
        },
        foot: [[
          '', '', '', '', '', '', '', '', '', '', '',
          fmtUSD(totals.totalIncome),
          fmtUSD(totals.agencyShare),
          fmtUSD(totals.hostShare),
        ]],
        footStyles: {
          fillColor: [18, 30, 50],
          textColor: [255, 215, 0],
          fontStyle: 'bold',
          fontSize: 7.5,
          lineColor: [255, 180, 0],
          lineWidth: 0.3,
        },
      });

      // Page footer
      doc.setFontSize(7);
      doc.setTextColor(80, 90, 110);
      doc.text('CONFIDENTIAL — For authorized personnel only. SparkLive Admin Portal.', M, 290);
      doc.text('Page 2', W - M - 12, 290);

      // ── PAGE 3: PER-HOST BREAKDOWN ─────────────────────────────────────────
      doc.addPage();
      doc.setFillColor(6, 8, 16);
      doc.rect(0, 0, W, 297, 'F');
      doc.setFillColor(0, 255, 255);
      doc.rect(0, 0, W, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 255, 255);
      doc.text('SPARKLIVE PLATFORM  ·  ADMIN PORTAL', M, 14);
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('Income Breakdown — Summary', M, 26);

      let y = 34;
      hostRows.forEach((h, i) => {
        if (y > 255) {
          doc.addPage();
          doc.setFillColor(6, 8, 16);
          doc.rect(0, 0, W, 297, 'F');
          doc.setFillColor(0, 255, 255);
          doc.rect(0, 0, W, 2, 'F');
          y = 20;
        }
        // Host card background
        doc.setFillColor(12, 18, 32);
        doc.roundedRect(M, y, W - 2 * M, 36, 3, 3, 'F');
        doc.setDrawColor(30, 45, 70);
        doc.setLineWidth(0.2);
        doc.roundedRect(M, y, W - 2 * M, 36, 3, 3, 'S');

        // Left accent stripe
        doc.setFillColor(0, 255, 255);
        doc.roundedRect(M, y, 2, 36, 1, 1, 'F');

        // Host info
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(h.name, M + 8, y + 9);
        doc.setFontSize(7);
        doc.setTextColor(0, 200, 210);
        doc.text(`ID: ${h.id}`, M + 8, y + 15);
        doc.setTextColor(120, 135, 155);
        doc.text(`${h.liveDays} days  ·  ${h.totalHours}h  ·  ${fmtT(h.totalSecs)}  ·  ${fmtN(h.diamonds)} diamonds  ·  ${fmtN(h.coins)} coins`, M + 8, y + 21);

        // Income breakdown bar
        const barX = M + 8, barY = y + 27, barW = W - 2 * M - 16, barH = 4;
        const total = h.totalIncome || 1;
        const hFrac = h.incomeFromHours    / total;
        const dFrac = h.incomeFromDays     / total;
        const dmFrac= h.incomeFromDiamonds / total;

        doc.setFillColor(30, 40, 60);
        doc.roundedRect(barX, barY, barW, barH, 2, 2, 'F');
        doc.setFillColor(168, 85, 247);
        doc.roundedRect(barX, barY, barW * hFrac, barH, 2, 2, 'F');
        doc.setFillColor(34, 197, 94);
        doc.roundedRect(barX + barW * hFrac, barY, barW * dFrac, barH, 0, 0, 'F');
        doc.setFillColor(191, 0, 255);
        doc.roundedRect(barX + barW * (hFrac + dFrac), barY, barW * dmFrac, barH, 0, 2, 'F');

        // Income figures right side
        doc.setFontSize(9);
        doc.setTextColor(34, 197, 94);
        doc.setFont('helvetica', 'bold');
        doc.text(fmtUSD(h.totalIncome), W - M - 5, y + 10, { align: 'right' });
        doc.setFontSize(7);
        doc.setTextColor(255, 215, 0);
        doc.text(`Agency: ${fmtUSD(h.agencyShare)}`, W - M - 5, y + 17, { align: 'right' });
        doc.setTextColor(120, 135, 155);
        doc.text(`Host:   ${fmtUSD(h.hostShare)}`, W - M - 5, y + 23, { align: 'right' });

        y += 40;
      });

      // Page footer on last page
      doc.setFontSize(7);
      doc.setTextColor(80, 90, 110);
      doc.text('CONFIDENTIAL — For authorized personnel only. SparkLive Admin Portal.', M, 290);

      // Save
      const fileName = `${agency.name.replace(/\s+/g, '_')}_Report_${dateFrom}_to_${dateTo || 'Present'}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const ts = TIER_STYLE[agency.tier] || TIER_STYLE.STARTER;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 61, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ width: '100%', maxWidth: 820, maxHeight: '94vh', overflowY: 'auto', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -1, borderRadius: 22, background: 'linear-gradient(135deg,rgba(255,215,0,0.2),transparent 60%)', filter: 'blur(6px)' }} />
          <div style={{ position: 'relative', borderRadius: 22, border: '1px solid rgba(255,215,0,0.2)', background: '#070b14', overflow: 'hidden' }}>

            {/* Scan line */}
            <style>{`@keyframes scan2{0%{transform:translateX(-100%)}100%{transform:translateX(340%)}}`}</style>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: 1, background: 'linear-gradient(90deg,transparent,#ffd700,transparent)', animation: 'scan2 3s linear infinite', zIndex: 10 }} />

            {/* Header */}
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg,rgba(255,215,0,0.06),transparent 55%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffd700' }}>
                    <I.Report />
                  </div>
                  <div>
                    <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,215,0,0.5)', margin: '0 0 2px' }}>Agency Earnings Report</p>
                    <h2 style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: 0 }}>{agency.name}</h2>
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '3px 9px', borderRadius: 6, background: ts.bg, border: `1px solid ${ts.border}`, color: ts.text, alignSelf: 'center' }}>{agency.tier}</span>
                </div>
                <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}>
                  <I.X />
                </button>
              </div>
            </div>

            {/* Rate Config */}
            <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,215,0,0.45)', margin: '0 0 10px' }}>
                Income Rate Configuration
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {([
                  { label: `Rate per Live Hour (${config.currency})`, key: 'ratePerHour',    placeholder: '5.00'   },
                  { label: `Rate per Live Day (${config.currency})`,  key: 'ratePerDay',     placeholder: '50.00'  },
                  { label: `Rate per Diamond (${config.currency})`,   key: 'ratePerDiamond', placeholder: '0.001'  },
                ] as { label: string; key: keyof ReportConfig; placeholder: string }[]).map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input
                      type="number" min="0" step="0.001"
                      value={config[key] as number}
                      onChange={e => setConfig(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))}
                      style={IS}
                      placeholder={placeholder}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.45)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>
                Period: <span style={{ color: '#ffd700' }}>{dateFrom || 'All Time'}</span> → <span style={{ color: '#ffd700' }}>{dateTo || 'Present'}</span>
                &nbsp;·&nbsp; Commission: <span style={{ color: '#22c55e' }}>{agency.commission}%</span>
              </div>
            </div>

            {/* Summary Stats */}
            <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {([
                  { l: 'Total Live Days',    v: fmtN(totals.liveDays),                          c: '#00ffff'  },
                  { l: 'Total Live Hours',   v: `${fmtN(totals.totalHours)}h`,                  c: '#a855f7'  },
                  { l: 'Total Diamonds',     v: fmtN(totals.diamonds),                          c: '#bf00ff'  },
                  { l: 'Total Income',       v: fmtUSD(totals.totalIncome),                     c: '#22c55e'  },
                  { l: 'Hour-Based Income',  v: fmtUSD(hostRows.reduce((s,h)=>s+h.incomeFromHours,0)),    c: '#a855f7'  },
                  { l: 'Day-Based Income',   v: fmtUSD(hostRows.reduce((s,h)=>s+h.incomeFromDays,0)),     c: '#38bdf8'  },
                  { l: 'Diamond Income',     v: fmtUSD(hostRows.reduce((s,h)=>s+h.incomeFromDiamonds,0)), c: '#bf00ff'  },
                  { l: 'Agency Commission',  v: fmtUSD(totals.agencyShare),                    c: '#ffd700'  },
                ] as { l: string; v: string; c: string }[]).map(({ l, v, c }) => (
                  <div key={l} style={{ borderRadius: 11, border: `1px solid ${c}20`, background: `${c}07`, padding: '9px 12px' }}>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: c, textShadow: `0 0 12px ${c}40`, lineHeight: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Table Preview */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ padding: '12px 22px 8px', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                <I.Report /> Host Breakdown Preview
              </div>
              {/* thead */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.7fr 0.7fr 0.8fr 0.9fr 0.9fr 1fr', padding: '7px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                {['Host', 'Days', 'Hours', 'Diamonds', 'Total Income', 'Agency Share', 'Host Share'].map(h => (
                  <div key={h} style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>{h}</div>
                ))}
              </div>
              {paged.map((h, i) => (
                <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '2fr 0.7fr 0.7fr 0.8fr 0.9fr 0.9fr 1fr', padding: '9px 22px', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background .14s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,215,0,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: '#fff' }}>{h.name}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,215,0,0.5)', marginTop: 1 }}>{h.id}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#00ffff' }}>{fmtN(h.liveDays)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#a855f7' }}>{fmtN(h.totalHours)}h</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#bf00ff', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#bf00ff' }}>{fmtN(h.diamonds)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 900, color: '#22c55e' }}>{fmtUSD(h.totalIncome)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#ffd700' }}>{fmtUSD(h.agencyShare)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{fmtUSD(h.hostShare)}</div>
                </div>
              ))}
              <Pagination page={pg} total={totalPgs} count={hostRows.length} perPage={PPP} onChange={setPg} />
            </div>

            {/* Download Button */}
            <div style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={onClose} style={{ height: 40, padding: '0 18px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={downloadPDF} disabled={generating}
                style={{ height: 40, padding: '0 22px', borderRadius: 12, background: generating ? 'rgba(255,215,0,0.05)' : 'rgba(255,215,0,0.12)', border: `1px solid rgba(255,215,0,${generating ? '0.2' : '0.4'})`, color: generating ? 'rgba(255,215,0,0.4)' : '#ffd700', fontSize: 11, fontWeight: 900, cursor: generating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, letterSpacing: '0.05em', boxShadow: generating ? 'none' : '0 0 20px rgba(255,215,0,0.15)' }}>
                <I.Download />
                {generating ? 'Generating PDF…' : '⬇ Download PDF Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const APPP = 4;

export default function AgencyReportPage() {
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo,   setDateTo]   = useState('2024-12-31');
  const [tierF,    setTierF]    = useState('');
  const [statusF,  setStatusF]  = useState('');
  const [pg,       setPg]       = useState(1);
  const [reportAg, setReportAg] = useState<typeof AGENCIES[0] | null>(null);

  const filtered = useMemo(() => AGENCIES
    .filter(a => !tierF   || a.tier   === tierF)
    .filter(a => !statusF || a.status === statusF),
    [tierF, statusF]
  );

  const totalPgs = Math.max(1, Math.ceil(filtered.length / APPP));
  const safePg   = Math.min(pg, totalPgs);
  const paged    = filtered.slice((safePg - 1) * APPP, safePg * APPP);
  const hasF     = tierF || statusF;

  const IS2: React.CSSProperties = { height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 700, outline: 'none', fontFamily: 'inherit', padding: '0 22px 0 9px', cursor: 'pointer', appearance: 'none' as any, transition: 'border-color .2s', boxSizing: 'border-box' as const };

  const GS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    select option{background:#0c1020;color:#fff;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);border-radius:8px;}
    ::-webkit-scrollbar-thumb{background:rgba(255,215,0,0.18);border-radius:8px;}
    input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5) brightness(1.4);}
    button{outline:none;}
  `;

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: '#060810', minHeight: '100vh', padding: '24px 22px', color: '#fff' }}>
      <style>{GS}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 3, height: 22, borderRadius: 4, background: '#ffd700', boxShadow: '0 0 10px rgba(255,215,0,0.7)' }} />
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Agency Reports</h1>
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase', paddingLeft: 13 }}>Download Earnings Reports Per Agency</p>
        </div>
      </div>

      {/* DATE RANGE */}
      <div style={{ borderRadius: 16, border: '1px solid rgba(255,215,0,0.14)', background: 'rgba(255,215,0,0.03)', padding: '14px 18px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'rgba(255,215,0,0.5)', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em' }}>
          <I.Calendar /> Report Date Range
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500 }}>
          {([['From', dateFrom, setDateFrom], ['To', dateTo, setDateTo]] as [string, string, (v: string) => void][]).map(([label, val, setter]) => (
            <div key={label}>
              <label style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.16em', display: 'block', marginBottom: 5 }}>{label} Date</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,215,0,0.4)', pointerEvents: 'none' }}><I.Calendar /></span>
                <input type="date" value={val} onChange={e => setter(e.target.value)}
                  style={{ ...IS2, paddingLeft: 30, width: '100%', colorScheme: 'dark' as any }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.45)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'} />
              </div>
            </div>
          ))}
        </div>
        {dateFrom && dateTo && (
          <div style={{ marginTop: 10, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
            Period selected:&nbsp;
            <span style={{ color: '#ffd700', fontWeight: 700 }}>{dateFrom}</span>
            &nbsp;→&nbsp;
            <span style={{ color: '#ffd700', fontWeight: 700 }}>{dateTo}</span>
            &nbsp;·&nbsp;
            <span style={{ color: '#22c55e' }}>
              {Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000)} days
            </span>
          </div>
        )}
      </div>

      {/* FILTER BAR */}
      <div style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '11px 16px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.28)', fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            <I.Filter /> Filter Agencies
            {hasF && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffd700', display: 'inline-block', marginLeft: 2 }} />}
          </div>
          {hasF && <button onClick={() => { setTierF(''); setStatusF(''); setPg(1); }} style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,215,0,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.12em' }}>× Reset</button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 400 }}>
          {([
            { l: 'Tier',   v: tierF,   s: setTierF,   opts: [['', 'All Tiers'], ['ELITE', 'Elite'], ['PRO', 'Pro'], ['STARTER', 'Starter']] },
            { l: 'Status', v: statusF, s: setStatusF, opts: [['', 'All Status'], ['ACTIVE', 'Active'], ['INACTIVE', 'Inactive']] },
          ] as { l: string; v: string; s: (v: string) => void; opts: [string, string][] }[]).map(({ l, v, s, opts }) => (
            <div key={l}>
              <label style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.24)', textTransform: 'uppercase', letterSpacing: '0.16em', display: 'block', marginBottom: 4 }}>{l}</label>
              <div style={{ position: 'relative' }}>
                <select value={v} onChange={e => { s(e.target.value); setPg(1); }} style={{ ...IS2, width: '100%' }}>
                  {opts.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
                <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.28)', pointerEvents: 'none' }}><I.ChevD /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AGENCY LIST */}
      <div style={{ borderRadius: 20, border: '1px solid rgba(255,215,0,0.1)', overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
        {/* thead */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr 1fr 1fr 0.9fr 1.2fr', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.35)' }}>
          {['Agency', 'Tier', 'Status', 'Commission', 'Hosts', 'Total Diamonds', 'Total Income', 'Report'].map(h => (
            <div key={h} style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.27)' }}>{h}</div>
          ))}
        </div>

        {paged.map(ag => {
          const agHosts   = HOSTS.filter(h => h.agencyId === ag.id).map(h => scaleStats(h, dateFrom, dateTo));
          const totalDiam = agHosts.reduce((s, h) => s + h.diamonds, 0);
          const totalCoin = agHosts.reduce((s, h) => s + h.coins, 0);
          const estIncome = agHosts.reduce((s, h) => s + h.totalHours * 5 + h.liveDays * 50 + h.diamonds * 0.001, 0);
          const ts = TIER_STYLE[ag.tier] || TIER_STYLE.STARTER;

          return (
            <div key={ag.id}
              style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 0.8fr 1fr 1fr 0.9fr 1.2fr', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background .14s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,215,0,0.02)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
              {/* Agency Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#ffd700', flexShrink: 0 }}>
                  {ag.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{ag.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{ag.id}</div>
                </div>
              </div>
              {/* Tier */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 5, background: ts.bg, border: `1px solid ${ts.border}`, color: ts.text }}>{ag.tier}</span>
              </div>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: ag.status === 'ACTIVE' ? '#22c55e' : '#ff4444', boxShadow: `0 0 6px ${ag.status === 'ACTIVE' ? '#22c55e' : '#ff4444'}` }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: ag.status === 'ACTIVE' ? '#22c55e' : '#ff5555' }}>{ag.status}</span>
              </div>
              {/* Commission */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 900, color: '#38bdf8' }}>{ag.commission}%</div>
              {/* Hosts */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <I.User />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{agHosts.length}</span>
              </div>
              {/* Diamonds */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#bf00ff', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#bf00ff' }}>{fmtN(totalDiam)}</span>
              </div>
              {/* Est Income */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 900, color: '#22c55e' }}>{fmtUSD(estIncome)}</div>
              {/* Download Button */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => setReportAg(ag)}
                  disabled={agHosts.length === 0}
                  style={{ height: 34, padding: '0 14px', borderRadius: 10, background: agHosts.length ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,215,0,${agHosts.length ? '0.35' : '0.1'})`, color: agHosts.length ? '#ffd700' : 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900, cursor: agHosts.length ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.05em', transition: 'all .18s', boxShadow: agHosts.length ? '0 0 14px rgba(255,215,0,0.1)' : 'none' }}
                  onMouseEnter={e => { if (agHosts.length) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,215,0,0.18)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(255,215,0,0.25)'; } }}
                  onMouseLeave={e => { if (agHosts.length) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,215,0,0.1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 14px rgba(255,215,0,0.1)'; } }}>
                  <I.Download />
                  Download Report
                </button>
              </div>
            </div>
          );
        })}

        <Pagination page={safePg} total={totalPgs} count={filtered.length} perPage={APPP} onChange={setPg} />
      </div>

      {/* REPORT MODAL */}
      {reportAg && (
        <ReportModal
          agency={reportAg}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onClose={() => setReportAg(null)}
        />
      )}
    </div>
  );
}