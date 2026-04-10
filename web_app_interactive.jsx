import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const CATEGORIES = ["T-shirt","Trousers","Pullover","Dress","Coat","Sandal","Shirt","Sneaker","Bag","Boot"];

function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))); }
function vary(base, spread = 2) { return base + Math.floor(Math.random() * (spread * 2 + 1)) - spread; }
function makeImg() { return new Array(784).fill(0); }
function setPx(img, r, c, v) { if (r >= 0 && r < 28 && c >= 0 && c < 28) img[r * 28 + c] = clamp(Math.max(img[r * 28 + c], v)); }
function fillRect(img, r1, c1, r2, c2, v, noise = 30) { for (let r = Math.max(0, r1); r <= Math.min(27, r2); r++) for (let c = Math.max(0, c1); c <= Math.min(27, c2); c++) setPx(img, r, c, clamp(v + (Math.random() - 0.5) * noise * 2)); }
function fillEllipse(img, cr, cc, rr, rc, v) { if (rr <= 0 || rc <= 0) return; for (let r = cr - rr; r <= cr + rr; r++) for (let c = cc - rc; c <= cc + rc; c++) if (((r - cr) / rr) ** 2 + ((c - cc) / rc) ** 2 <= 1) setPx(img, r, c, clamp(v + (Math.random() - 0.5) * 50)); }
function addNoise(img, prob = 0.03) { for (let i = 0; i < 784; i++) if (Math.random() < prob) img[i] = clamp(img[i] + Math.random() * 55); }

const generators = [
  () => { const img=makeImg(),t=vary(5),b=vary(24),l=vary(8),r=vary(19); fillRect(img,t,l,b,r,vary(190,20)); fillRect(img,t,l-vary(5,1),t+vary(4,1),l,vary(170,20)); fillRect(img,t,r,t+vary(4,1),r+vary(5,1),vary(170,20)); fillEllipse(img,t+1,(l+r)>>1,2,vary(3,1),0); addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(3),wb=vary(10),b=vary(25),l=vary(8),r=vary(19); fillRect(img,t,l,wb,r,vary(200,20)); const lw=((r-l-1)/2)|0; fillRect(img,wb,l,b,l+lw,vary(195,20)); fillRect(img,wb,r-lw,b,r,vary(195,20)); addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(4),b=vary(24),l=vary(8),r=vary(19); fillRect(img,t,l,b,r,vary(185,20)); fillRect(img,t+1,l-vary(5,1),t+vary(7,1),l,vary(165,20)); fillRect(img,t+1,r,t+vary(7,1),r+vary(5,1),vary(165,20)); fillRect(img,t-1,(l+r)/2-2|0,t+1,(l+r)/2+2|0,vary(200,15)); addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(4),mid=vary(13),b=vary(25),lt=vary(10),rt=vary(17); fillRect(img,t,lt,mid,rt,vary(195,20)); const fl=vary(3,1); for(let row=mid;row<=b;row++){const f=(row-mid)/Math.max(1,b-mid); fillRect(img,row,lt-Math.round(fl*f),row,rt+Math.round(fl*f),vary(180,20));} addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(3),b=vary(25),l=vary(7),r=vary(20); fillRect(img,t,l,b,r,vary(185,20)); fillRect(img,t+1,l-vary(5,1),t+vary(8,1),l,vary(165,20)); fillRect(img,t+1,r,t+vary(8,1),r+vary(5,1),vary(165,20)); const mc=(l+r)>>1; fillRect(img,t+3,mc-1,b,mc,vary(215,15)); fillRect(img,t,l,t+5,l+3,vary(210,15)); fillRect(img,t,r-3,t+5,r,vary(210,15)); addNoise(img); return img; },
  () => { const img=makeImg(),ts=vary(18),bs=vary(22),l=vary(4),r=vary(23); fillRect(img,ts,l,bs,r,vary(200,20)); for(let s=0;s<2+Math.floor(Math.random()*2);s++){const sy=vary(13+s*3,1); fillRect(img,sy,l+2,sy+1,r-2,vary(175,20));} addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(4),b=vary(24),l=vary(8),r=vary(19); fillRect(img,t,l,b,r,vary(175,20)); fillRect(img,t,l-vary(5,1),t+vary(5,1),l,vary(155,20)); fillRect(img,t,r,t+vary(5,1),r+vary(5,1),vary(155,20)); const mc=(l+r)>>1; for(let by=t+3;by<b-1;by+=vary(3,1)) setPx(img,by,mc,clamp(vary(230,10))); fillRect(img,t-1,l,t+1,l+3,vary(215,15)); fillRect(img,t-1,r-3,t+1,r,vary(215,15)); addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(11),bb=vary(19),l=vary(3),r=vary(24); fillRect(img,t,l,bb,r,vary(195,20)); fillRect(img,vary(8),l,t,l+vary(7,1),vary(180,20)); fillRect(img,bb+1,l,bb+vary(3,1),r,vary(220,15)); fillEllipse(img,(t+bb)>>1,Math.round((l+r*2)/3),2,2,vary(100,15)); addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(8),b=vary(24),l=vary(8),r=vary(19); fillRect(img,t,l,b,r,vary(195,20)); fillRect(img,t,l,t+1,r,vary(230,10)); fillRect(img,b-1,l,b,r,vary(230,10)); fillRect(img,t,l,b,l+1,vary(220,10)); fillRect(img,t,r-1,b,r,vary(220,10)); const hl=vary(11,1),hr=vary(16,1),ht=t-vary(4,1); for(let row=ht;row<t;row++){setPx(img,row,hl,clamp(vary(180,10)));setPx(img,row,hr,clamp(vary(180,10)));} fillRect(img,ht,hl,ht+1,hr,vary(180,15)); addNoise(img); return img; },
  () => { const img=makeImg(),t=vary(4),sb=vary(16),ls=vary(10),rs=vary(20); fillRect(img,t,ls,sb,rs,vary(195,20)); const fl=vary(6); fillRect(img,sb,fl,vary(24),rs,vary(195,20)); fillRect(img,vary(24),fl-1,vary(26),rs+1,vary(225,15)); addNoise(img); return img; }
];

function generateDataset(nTrain = 50, nTest = 10) {
  const train = { images: [], labels: [] }, test = { images: [], labels: [] };
  for (let cat = 0; cat < 10; cat++) { for (let i = 0; i < nTrain; i++) { train.images.push(generators[cat]()); train.labels.push(cat); } for (let i = 0; i < nTest; i++) { test.images.push(generators[cat]()); test.labels.push(cat); } }
  const shuf = d => { const idx = d.labels.map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } d.images = idx.map(i => d.images[i]); d.labels = idx.map(i => d.labels[i]); };
  shuf(train); shuf(test); return { train, test };
}

function createNetwork() { const w = [], b = []; for (let n = 0; n < 10; n++) { const a = new Array(784); for (let i = 0; i < 784; i++) a[i] = (Math.random() - 0.5) * 0.02; w.push(a); b.push((Math.random() - 0.5) * 0.01); } return { w, b }; }
function forward(net, px) { const norm = px.map(p => p / 255), raw = []; for (let n = 0; n < 10; n++) { let s = net.b[n]; for (let i = 0; i < 784; i++) s += net.w[n][i] * norm[i]; raw.push(s); } const mx = Math.max(...raw), ex = raw.map(r => Math.exp(r - mx)), sm = ex.reduce((a, b) => a + b, 0); const probs = ex.map(e => e / sm); return { raw, probs, predicted: probs.indexOf(Math.max(...probs)) }; }
function trainBatch(net, imgs, labels, lr = 0.01) { let loss = 0; for (let s = 0; s < imgs.length; s++) { const norm = imgs[s].map(p => p / 255), { probs } = forward(net, imgs[s]); loss += -Math.log(Math.max(probs[labels[s]], 1e-10)); for (let n = 0; n < 10; n++) { const g = probs[n] - (n === labels[s] ? 1 : 0); for (let i = 0; i < 784; i++) net.w[n][i] -= lr * g * norm[i]; net.b[n] -= lr * g; } } return loss / imgs.length; }
function evalNet(net, imgs, labels) { let c = 0; for (let i = 0; i < imgs.length; i++) { if (forward(net, imgs[i]).predicted === labels[i]) c++; } return c / imgs.length; }
function cloneNet(net) { return { w: net.w.map(a => [...a]), b: [...net.b] }; }

function useR() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  const m = w < 600, t = w >= 600 && w < 900;
  return { m, canvasMain: m ? 196 : t ? 240 : 280, smpSz: m ? 38 : 48, thSz: m ? 30 : 38, inSz: m ? 65 : 80, wSm: m ? 48 : t ? 58 : 68, wLg: m ? 120 : 160, cW: m ? 240 : t ? 300 : 360, cH: m ? 70 : 90 };
}

function PixelGrid({ pixels, onPixelsChange, size = 196, interactive = true }) {
  const ref = useRef(null), drawing = useRef(false);
  const draw = useCallback(() => { const cv = ref.current; if (!cv) return; const ctx = cv.getContext("2d"), cs = size / 28; ctx.fillStyle = "#000"; ctx.fillRect(0, 0, size, size); for (let r = 0; r < 28; r++) for (let c = 0; c < 28; c++) { const v = pixels[r * 28 + c]; if (v > 0) { ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(c * cs, r * cs, cs, cs); } } if (size >= 80) { ctx.strokeStyle = "rgba(128,128,128,0.15)"; ctx.lineWidth = 0.5; for (let i = 0; i <= 28; i++) { ctx.beginPath(); ctx.moveTo(i * cs, 0); ctx.lineTo(i * cs, size); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * cs); ctx.lineTo(size, i * cs); ctx.stroke(); } } }, [pixels, size]);
  useEffect(() => { draw(); }, [draw]);
  const paint = e => { if (!interactive || !onPixelsChange) return; const cv = ref.current, rect = cv.getBoundingClientRect(), cs = size / 28; const cx = (e.clientX ?? e.touches?.[0]?.clientX), cy = (e.clientY ?? e.touches?.[0]?.clientY); if (cx == null) return; const col = Math.floor((cx - rect.left) / cs), row = Math.floor((cy - rect.top) / cs); if (row < 0 || row > 27 || col < 0 || col > 27) return; const np = [...pixels]; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = row + dr, nc = col + dc; if (nr >= 0 && nr < 28 && nc >= 0 && nc < 28) np[nr * 28 + nc] = Math.min(255, Math.max(np[nr * 28 + nc], (Math.abs(dr) + Math.abs(dc)) === 0 ? 240 : 150)); } onPixelsChange(np); };
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: 4, cursor: interactive ? "crosshair" : "default", display: "block" }} onMouseDown={e => { drawing.current = true; paint(e); }} onMouseMove={e => { if (drawing.current) paint(e); }} onMouseUp={() => drawing.current = false} onMouseLeave={() => drawing.current = false} onTouchStart={e => { drawing.current = true; paint(e); }} onTouchMove={e => { e.preventDefault(); if (drawing.current) paint(e); }} onTouchEnd={() => drawing.current = false} />;
}

function WeightGrid({ weights, size = 56 }) {
  const ref = useRef(null);
  useEffect(() => { const cv = ref.current; if (!cv) return; const ctx = cv.getContext("2d"), cs = size / 28; let mx = 0; for (let i = 0; i < 784; i++) mx = Math.max(mx, Math.abs(weights[i])); if (mx === 0) mx = 1; ctx.fillStyle = "#111"; ctx.fillRect(0, 0, size, size); for (let r = 0; r < 28; r++) for (let c = 0; c < 28; c++) { const n = weights[r * 28 + c] / mx; ctx.fillStyle = n > 0 ? `rgba(42,138,80,${n})` : `rgba(210,70,70,${-n})`; ctx.fillRect(c * cs, r * cs, cs, cs); } }, [weights, size]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: 3, display: "block" }} />;
}

function ProbBar({ probs, label, m }) {
  const mx = probs.indexOf(Math.max(...probs));
  return <div>{probs.map((p, i) => <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: m ? 2 : 3, gap: m ? 4 : 6 }}>
    <div style={{ width: m ? 62 : 90, fontSize: m ? 10 : 13, textAlign: "right", fontFamily: "var(--mono)", color: i === mx ? "#2a8a50" : "#888", fontWeight: i === mx ? 700 : 400 }}>{CATEGORIES[i]}</div>
    <div style={{ flex: 1, height: m ? 12 : 16, background: "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: i === mx ? "linear-gradient(90deg,#2a8a50,#4caf68)" : "rgba(0,0,0,0.06)", borderRadius: 3, transition: "width 0.3s" }} />
    </div>
    <div style={{ width: m ? 34 : 48, fontSize: m ? 9 : 12, fontFamily: "var(--mono)", color: i === mx ? "#2a8a50" : "#999" }}>{(p * 100).toFixed(1)}%</div>
    {label !== undefined && i === label && <span style={{ fontSize: 9, color: "#c89020" }}>✓</span>}
  </div>)}</div>;
}

function Bio({ children, color = "#2a8a50" }) {
  return <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 6, background: `${color}0c`, border: `1px solid ${color}25`, fontSize: "clamp(12px,1.6vw,14px)", color: "#3a3a4a", lineHeight: 1.7 }}>{children}</div>;
}

function S1({ pixels, setPixels, activeCat, setActiveCat, dataset, R }) {
  const samples = useMemo(() => { const s = {}; for (let i = 0; i < dataset.train.labels.length; i++) { const l = dataset.train.labels[i]; if (!s[l]) s[l] = []; if (s[l].length < 8) s[l].push(dataset.train.images[i]); } return s; }, [dataset]);
  return <div>
    <h2 style={ST.h2}>1. From images to numbers <span style={ST.sub}>Signal transduction</span></h2>
    <p style={ST.p}>Photoreceptors convert light into electrical signals. Similarly, the first layer of the network converts pixels into numbers (0=black, 255=white). Draw on the canvas or select a category to see training examples:</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
      {CATEGORIES.map((cat, i) => <button key={i} onClick={() => { setActiveCat(i); setPixels(samples[i]?.[Math.floor(Math.random() * (samples[i]?.length || 1))] || generators[i]()); }} style={{ ...ST.btn, background: activeCat === i ? "rgba(42,138,80,0.1)" : undefined, borderColor: activeCat === i ? "#2a8a50" : undefined, color: activeCat === i ? "#2a8a50" : undefined }}>{cat}</button>)}
    </div>
    {activeCat >= 0 && samples[activeCat] && <div style={{ marginBottom: 12 }}>
      <div style={ST.label}>Training set examples (click to select):</div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {samples[activeCat].map((img, i) => <div key={i} onClick={() => setPixels([...img])} style={{ cursor: "pointer", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 3, padding: 1 }}><PixelGrid pixels={img} size={R.smpSz} interactive={false} /></div>)}
      </div>
    </div>}
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div>
        <PixelGrid pixels={pixels} onPixelsChange={setPixels} size={R.canvasMain} />
        <button onClick={() => { setPixels(new Array(784).fill(0)); setActiveCat(-1); }} style={{ ...ST.btn, marginTop: 6 }}>Clear</button>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={ST.label}>Pixel values (first row):</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(9px,1.2vw,11px)", background: "rgba(0,0,0,0.04)", padding: 8, borderRadius: 5, lineHeight: 1.5, wordBreak: "break-all", maxHeight: 100, overflow: "auto", color: "#666" }}>
          [{pixels.slice(0, 28).map(p => String(Math.round(p)).padStart(3)).join(",")}]
        </div>
        <div style={{ fontSize: "clamp(11px,1.5vw,14px)", color: "#555", marginTop: 8 }}>28×28 = <strong>784</strong> values → input layer</div>
        <Bio><strong style={{ color: "#2a8a50" }}>Biological analogy:</strong> Each pixel is like a single photoreceptor converting light into a signal. The input layer performs signal transduction, not integration, so its elements are not true neurons but input nodes.</Bio>
      </div>
    </div>
  </div>;
}

function S2({ pixels, net, epoch, R }) {
  const result = forward(net, pixels);
  const [sel, setSel] = useState(null);
  return <div>
    <h2 style={ST.h2}>2. Weights <span style={ST.sub}>Synaptic strength</span></h2>
    <p style={ST.p}>Each of the 10 neurons has 784 weights, one per pixel. Click a neuron for an enlarged view. {epoch > 0 ? <strong style={{ color: "#2a8a50" }}>After training, the weights have developed recognizable structure!</strong> : "Before training, the weights are random."}</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
      {net.w.map((w, i) => <div key={i} style={{ textAlign: "center", cursor: "pointer", padding: 3, borderRadius: 5, border: sel === i ? "2px solid #2a8a50" : "2px solid transparent", transition: "border 0.15s" }} onClick={() => setSel(sel === i ? null : i)}>
        <WeightGrid weights={w} size={R.wSm} />
        <div style={{ fontSize: "clamp(8px,1.1vw,11px)", marginTop: 2, fontFamily: "var(--mono)", color: result.predicted === i ? "#2a8a50" : "#888" }}>{CATEGORIES[i]}</div>
      </div>)}
    </div>
    {sel !== null && <div style={{ marginBottom: 12, display: "flex", gap: 14, alignItems: "center", background: "rgba(0,0,0,0.03)", padding: 12, borderRadius: 8 }}>
      <WeightGrid weights={net.w[sel]} size={R.wLg} />
      <div style={{ fontSize: "clamp(12px,1.6vw,14px)", color: "#444", lineHeight: 1.7 }}>
        <strong style={{ color: "#2a8a50", fontSize: "clamp(14px,1.8vw,17px)" }}>{CATEGORIES[sel]}</strong><br />
        <span style={{ color: "#3a9960" }}>■</span> Green = positive (excitatory)<br />
        <span style={{ color: "#d05050" }}>■</span> Red = negative (inhibitory)<br />
        <span style={{ fontFamily: "var(--mono)", fontSize: "clamp(10px,1.3vw,12px)", color: "#888" }}>bias = {net.b[sel].toFixed(4)}</span>
        {epoch > 0 && <div style={{ marginTop: 6, fontSize: "clamp(11px,1.4vw,13px)", color: "#2a8a50" }}>Notice: the green regions resemble the silhouette of {CATEGORIES[sel].toLowerCase()}!</div>}
      </div>
    </div>}
    <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(11px,1.4vw,13px)", color: "#666" }}>y = w₀x₀ + w₁x₁ + ... + w₇₈₃x₇₈₃ + b &nbsp;(7850 parameters total)</div>
    <Bio><strong style={{ color: "#2a8a50" }}>Biological analogy:</strong> Weights are analogous to synaptic strength. Positive weight ≈ excitatory synapse (EPSP), negative ≈ inhibitory (IPSP). The neuron integrates all inputs weighted by their connection strengths, plus bias (analogous to resting membrane potential).</Bio>
  </div>;
}

function S3({ pixels, net, activeCat, R }) {
  const result = forward(net, pixels); const hasInput = pixels.some(p => p > 0);
  return <div>
    <h2 style={ST.h2}>3. Softmax <span style={ST.sub}>Competitive dynamics</span></h2>
    <p style={ST.p}>Softmax normalizes scores into probabilities (sum=1). This is not analogous to a single-neuron threshold, but to competitive dynamics among neuronal populations: lateral inhibition amplifies dominant signals and suppresses weaker ones. The prediction below updates in real time as you draw or select an image above.</p>
    {hasInput ? <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ textAlign: "center" }}><PixelGrid pixels={pixels} size={R.inSz} interactive={false} /><div style={ST.label}>Input</div></div>
      <div style={{ flex: 1, minWidth: 220 }}>
        <ProbBar probs={result.probs} label={activeCat >= 0 ? activeCat : undefined} m={R.m} />
        <div style={{ marginTop: 6, fontSize: "clamp(12px,1.6vw,15px)", fontWeight: 600 }}>
          <span style={{ color: "#2a8a50" }}>→ {CATEGORIES[result.predicted]} ({(result.probs[result.predicted] * 100).toFixed(1)}%)</span>
          {activeCat >= 0 && <span style={{ color: result.predicted === activeCat ? "#2a8a50" : "#d04040", marginLeft: 8 }}>{result.predicted === activeCat ? "✓ Correct" : "✗ Wrong"}</span>}
        </div>
      </div>
    </div> : <p style={{ color: "#888", fontStyle: "italic", fontSize: "clamp(12px,1.5vw,14px)" }}>Select or draw an image in Step 1.</p>}
    <Bio><strong style={{ color: "#2a8a50" }}>Biological analogy:</strong> In deeper networks, each hidden neuron uses an activation function (ReLU, sigmoid) that decides whether to transmit a signal, a direct analogy to the threshold of excitation. Softmax in the output layer is analogous to winner-takes-all population dynamics in the cortex.</Bio>
  </div>;
}

function S4({ net, setNet, epoch, setEpoch, dataset, R }) {
  const [losses, setLosses] = useState([]); const [trAcc, setTrAcc] = useState(0); const [teAcc, setTeAcc] = useState(0); const [training, setTraining] = useState(false); const [testRes, setTestRes] = useState([]); const tRef = useRef(false);
  const runTraining = useCallback(async () => { tRef.current = true; setTraining(true); const n = cloneNet(net); const nl = [...losses]; const se = epoch; for (let ep = 0; ep < 60; ep++) { if (!tRef.current) break; const loss = trainBatch(n, dataset.train.images, dataset.train.labels, 0.05); nl.push(loss); if (ep % 3 === 0 || ep === 59) { const ta = evalNet(n, dataset.train.images, dataset.train.labels); const te = evalNet(n, dataset.test.images, dataset.test.labels); setTrAcc(ta); setTeAcc(te); const res = []; for (let i = 0; i < Math.min(20, dataset.test.images.length); i++) { const { predicted } = forward(n, dataset.test.images[i]); res.push({ pixels: dataset.test.images[i], label: dataset.test.labels[i], predicted, correct: predicted === dataset.test.labels[i] }); } setTestRes(res); setNet(cloneNet(n)); setEpoch(se + ep + 1); setLosses([...nl]); await new Promise(r => setTimeout(r, 40)); } } setTraining(false); tRef.current = false; }, [net, epoch, losses, dataset, setNet, setEpoch]);
  const reset = () => { tRef.current = false; setNet(createNetwork()); setEpoch(0); setLosses([]); setTrAcc(0); setTeAcc(0); setTestRes([]); };
  const cW = R.cW, cH = R.cH, maxL = losses.length > 0 ? Math.max(...losses, 0.5) : 3;
  return <div>
    <h2 style={ST.h2}>4. Training <span style={ST.sub}>Synaptic plasticity</span></h2>
    <p style={ST.p}>The training set contains {dataset.train.images.length} images (50 per category). The network processes all of them, computes the error (loss function), and adjusts the weights via gradient descent. Like an exam where a confident wrong answer is penalized more harshly, the loss function penalizes the network more when it assigns high probability to the wrong category.</p>
    <p style={ST.p}>The test set (100 images) measures generalization: the ability to recognize images the network has not seen during training.</p>
    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
      <button onClick={runTraining} disabled={training} style={{ ...ST.btn, background: training ? undefined : "rgba(42,138,80,0.08)", borderColor: "#2a8a50", color: "#2a8a50" }}>{training ? "Training..." : epoch > 0 ? "Continue (+60 epochs)" : "Start training (60 epochs)"}</button>
      <button onClick={reset} style={ST.btn}>Reset</button>
    </div>
    {epoch > 0 && <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div>
        <div style={ST.label}>Loss per epoch:</div>
        <svg width={cW} height={cH} style={{ background: "rgba(0,0,0,0.03)", borderRadius: 5 }}>
          {losses.length > 1 && losses.slice(0, -1).map((l, i) => { const x1 = (i / (losses.length - 1)) * (cW - 12) + 6, y1 = cH - 4 - (l / maxL) * (cH - 8); const x2 = ((i + 1) / (losses.length - 1)) * (cW - 12) + 6, y2 = cH - 4 - (losses[i + 1] / maxL) * (cH - 8); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a8a50" strokeWidth={1.5} />; })}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(9px,1.2vw,11px)", color: "#888", fontFamily: "var(--mono)", marginTop: 3, width: cW }}><span>Epoch {epoch}</span><span>Loss {losses[losses.length - 1]?.toFixed(3)}</span></div>
        <div style={{ marginTop: 10, fontSize: "clamp(12px,1.5vw,14px)", fontFamily: "var(--mono)" }}>
          <span style={{ color: "#2a8a50" }}>Train: {(trAcc * 100).toFixed(0)}%</span>
          <span style={{ color: trAcc - teAcc > 0.15 ? "#d04040" : "#3080c0", marginLeft: 12 }}>Test: {(teAcc * 100).toFixed(0)}%</span>
          {trAcc - teAcc > 0.15 && <span style={{ fontSize: "clamp(9px,1.2vw,11px)", color: "#d04040", marginLeft: 8 }}>⚠ overfitting</span>}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={ST.label}>Test images (unseen by the network):</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {testRes.map((t, i) => <div key={i} style={{ textAlign: "center", padding: 2, borderRadius: 3, background: t.correct ? "rgba(42,138,80,0.06)" : "rgba(210,64,64,0.06)", border: `1px solid ${t.correct ? "rgba(42,138,80,0.2)" : "rgba(210,64,64,0.2)"}` }}>
            <PixelGrid pixels={t.pixels} size={R.thSz} interactive={false} />
            <div style={{ fontSize: "clamp(7px,1vw,9px)", color: t.correct ? "#2a8a50" : "#d04040", fontFamily: "var(--mono)" }}>{t.correct ? "✓" : "✗"}</div>
          </div>)}
        </div>
      </div>
    </div>}
    {epoch > 0 && <Bio><strong style={{ color: "#2a8a50" }}>Hebbian learning:</strong> Return to Step 2 and compare the weights before and after training. After training, each neuron develops weights resembling the silhouette of its category: pixels consistently active in images of that category gain increased weights. This is a functional equivalent of Hebb's principle: "neurons that fire together, wire together." Gradient descent uses error information (which pure Hebbian learning does not), but the observed result, preferential strengthening of co-active pathways, is the same.</Bio>}
    {epoch > 30 && trAcc - teAcc > 0.08 && <Bio color="#c08820"><strong style={{ color: "#c08820" }}>Overfitting:</strong> Training accuracy ({(trAcc*100).toFixed(0)}%) is higher than test accuracy ({(teAcc*100).toFixed(0)}%). The network has started memorizing training images instead of learning general patterns. Biological analogue: pareidolia, when the brain recognizes faces in clouds because it over-relies on learned templates.</Bio>}
  </div>;
}

function S5({ R }) {
  const layers = [{ l: "V1", bio: "Edges, orientations", ai: "Layers 1-2" }, { l: "V2", bio: "Textures, contours", ai: "Layers 3-5" }, { l: "V4", bio: "Shapes, colors", ai: "Layers 6-10" }, { l: "IT", bio: "Whole objects", ai: "Output layer" }];
  return <div>
    <h2 style={ST.h2}>5. Deep networks <span style={ST.sub}>Visual cortex hierarchy</span></h2>
    <p style={ST.p}>Our network has only two layers. Modern deep networks contain dozens of layers, each learning increasingly abstract features, directly corresponding to the hierarchical organization of the visual cortex:</p>
    <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
      {layers.map((ly, i) => <div key={i} style={{ flex: 1, position: "relative" }}>
        <div style={{ background: `rgba(42,138,80,${0.04 + i * 0.04})`, border: "1px solid rgba(42,138,80,0.18)", borderRadius: 6, padding: R.m ? "6px 5px" : "10px 8px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div><div style={{ fontSize: "clamp(14px,2vw,18px)", fontWeight: 800, color: "#2a8a50", fontFamily: "var(--mono)" }}>{ly.l}</div><div style={{ fontSize: "clamp(9px,1.3vw,12px)", color: "#555", marginTop: 3, lineHeight: 1.35 }}>{ly.bio}</div></div>
          <div style={{ fontSize: "clamp(8px,1.1vw,10px)", color: "#999", marginTop: 8, borderTop: "1px solid rgba(42,138,80,0.12)", paddingTop: 5, fontFamily: "var(--mono)" }}>{ly.ai}</div>
        </div>
        {i < 3 && <div style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", fontSize: "clamp(12px,1.5vw,16px)", color: "rgba(42,138,80,0.4)", zIndex: 1 }}>→</div>}
      </div>)}
    </div>
    <p style={ST.p}>Our two-layer network achieves ~80% accuracy. Convolutional neural networks (CNNs) with dozens of layers achieve over 90% on Fashion-MNIST, precisely because they can learn features hierarchically.</p>
    <Bio><strong style={{ color: "#2a8a50" }}>Large language models (LLMs):</strong> Instead of pixels, they process sequences of words. Instead of classifying, they predict which word follows in a sentence. The principle of learning through weight adjustment is the same, but the architecture is adapted for sequential data (Transformer).</Bio>
  </div>;
}

const ST = {
  h2: { fontSize: "clamp(17px,2.2vw,22px)", fontWeight: 700, margin: "0 0 8px 0", color: "#1a1a2e", letterSpacing: "-0.02em", lineHeight: 1.3 },
  sub: { fontSize: "clamp(11px,1.4vw,14px)", fontWeight: 400, color: "#2a8a50", marginLeft: 8, fontFamily: "var(--mono)" },
  p: { fontSize: "clamp(13px,1.7vw,16px)", lineHeight: 1.75, color: "#3a3a4a", margin: "0 0 10px 0" },
  btn: { padding: "6px 14px", fontSize: "clamp(11px,1.4vw,14px)", borderRadius: 5, border: "1px solid rgba(0,0,0,0.15)", background: "rgba(0,0,0,0.02)", color: "#555", cursor: "pointer", fontFamily: "var(--mono)", transition: "all 0.15s" },
  sec: { background: "rgba(0,0,0,0.015)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "clamp(14px,2.5vw,24px)" },
  label: { fontSize: "clamp(10px,1.3vw,12px)", color: "#888", marginBottom: 4, fontFamily: "var(--mono)" },
};

export default function App() {
  const [dataset] = useState(() => generateDataset(50, 10));
  const [pixels, setPixels] = useState(() => generators[1]());
  const [activeCat, setActiveCat] = useState(1);
  const [net, setNet] = useState(() => createNetwork());
  const [epoch, setEpoch] = useState(0);
  const R = useR();

  return <div style={{ "--mono": "'JetBrains Mono','Fira Code',monospace", minHeight: "100vh", background: "#fafafa", color: "#1a1a2e", fontFamily: "'Crimson Pro','Source Serif 4',Georgia,serif", padding: "clamp(16px,3vw,32px) clamp(12px,2.5vw,28px)", maxWidth: 920, margin: "0 auto" }}>
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <header style={{ marginBottom: "clamp(20px,3vw,36px)", paddingBottom: "clamp(12px,2vw,20px)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <h1 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.3 }}>From Biological to Artificial Neural Networks</h1>
      <p style={{ fontSize: "clamp(11px,1.4vw,14px)", color: "#888", margin: "6px 0 0 0", lineHeight: 1.4 }}>Interactive guide · {dataset.train.images.length} training images · {dataset.test.images.length} test images · 10 categories</p>
    </header>
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2.5vw,28px)" }}>
      <section style={ST.sec}><S1 pixels={pixels} setPixels={setPixels} activeCat={activeCat} setActiveCat={setActiveCat} dataset={dataset} R={R} /></section>
      <section style={ST.sec}><S2 pixels={pixels} net={net} epoch={epoch} R={R} /></section>
      <section style={ST.sec}><S3 pixels={pixels} net={net} activeCat={activeCat} R={R} /></section>
      <section style={ST.sec}><S4 net={net} setNet={setNet} epoch={epoch} setEpoch={setEpoch} dataset={dataset} R={R} /></section>
      <section style={ST.sec}><S5 R={R} /></section>
    </div>
    <footer style={{ marginTop: "clamp(20px,3vw,32px)", paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: "clamp(9px,1.2vw,11px)", color: "rgba(0,0,0,0.35)", textAlign: "center" }}>
      Supplemental material: Using Visual Cortex Knowledge to Scaffold Artificial Neural Network Concepts · Data: procedurally generated Fashion-MNIST images (Xiao et al., 2017)
    </footer>
  </div>;
}
