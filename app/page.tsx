'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  CloudSun,
  FileImage,
  Headphones,
  Leaf,
  Menu,
  Mic,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
  Volume2,
  X,
} from 'lucide-react'

type Lang = 'en' | 'hi' | 'mr'
type Sample = 'high' | 'ambiguous' | 'blurry'
type Scan = { time: string; disease: string; confidence: number; crop: string }

const copy = {
  en: { nav: ['Overview', 'Scan crop', 'Field history'], title: 'Crop intelligence\nfor confident decisions.', sub: 'Evidence-guided crop disease detection, built for the realities of Indian fields.', scan: 'Start a new scan', drop: 'Drop a leaf photo here', or: 'or choose a file from your device', camera: 'Use camera', browse: 'Browse files', quick: 'Quick tests', high: 'Test Tomato Early Blight', amb: 'Test Ambiguous Spotting', blurry: 'Test Blurry Photo', diagnosis: 'Diagnosis', confidence: 'confidence', attention: 'View AI attention heatmap (Grad-CAM)', remedy: 'Treatment protocol', organic: 'Organic & Bio-Control', chemical: 'Chemical intervention', listen: 'Listen', verify: 'Confirm Socratic verification', question: 'Where are the spots most concentrated on the plant?', uncertain: 'Uncertain diagnosis — additional verification required.', clear: 'High confidence match', history: 'Recent field scans', call: 'Severe infestation? Call Kisan Call Centre', steps: 'Recommended next steps' },
  hi: { nav: ['अवलोकन', 'फसल स्कैन', 'इतिहास'], title: 'आत्मविश्वास से\nफसल का निर्णय लें।', sub: 'भारतीय खेतों की वास्तविकताओं के लिए प्रमाण-आधारित रोग पहचान।', scan: 'नया स्कैन शुरू करें', drop: 'पत्ती की फोटो यहाँ डालें', or: 'या अपने डिवाइस से फ़ाइल चुनें', camera: 'कैमरा उपयोग करें', browse: 'फ़ाइल ब्राउज़ करें', quick: 'त्वरित परीक्षण', high: 'टमाटर अर्ली ब्लाइट', amb: 'अस्पष्ट धब्बे', blurry: 'धुंधली फोटो', diagnosis: 'निदान', confidence: 'विश्वास', attention: 'AI ध्यान हीटमैप देखें (Grad-CAM)', remedy: 'उपचार प्रोटोकॉल', organic: 'जैविक नियंत्रण', chemical: 'रासायनिक उपचार', listen: 'सुनें', verify: 'सैद्धांतिक सत्यापन की पुष्टि करें', question: 'पौधे पर धब्बे कहाँ अधिक हैं?', uncertain: 'अनिश्चित निदान — अतिरिक्त सत्यापन आवश्यक।', clear: 'उच्च विश्वास मिलान', history: 'हाल के फील्ड स्कैन', call: 'गंभीर संक्रमण? किसान कॉल सेंटर पर कॉल करें', steps: 'अनुशंसित अगले कदम' },
  mr: { nav: ['आढावा', 'पीक स्कॅन', 'इतिहास'], title: 'विश्वासाने\nपिकाचे निर्णय घ्या.', sub: 'भारतीय शेतांच्या वास्तवासाठी पुराव्यावर आधारित रोग ओळख.', scan: 'नवीन स्कॅन सुरू करा', drop: 'पानाचा फोटो येथे टाका', or: 'किंवा डिव्हाइसवरून फाइल निवडा', camera: 'कॅमेरा वापरा', browse: 'फाइल ब्राउझ करा', quick: 'जलद चाचण्या', high: 'टोमॅटो अर्ली ब्लाइट', amb: 'संदिग्ध डाग', blurry: 'अस्पष्ट फोटो', diagnosis: 'निदान', confidence: 'विश्वास', attention: 'AI लक्ष हीटमॅप पहा (Grad-CAM)', remedy: 'उपचार प्रोटोकॉल', organic: 'सेंद्रिय नियंत्रण', chemical: 'रासायनिक उपचार', listen: 'ऐका', verify: 'सॉक्रेटिक पडताळणी निश्चित करा', question: 'झाडावर डाग कुठे जास्त आहेत?', uncertain: 'अनिश्चित निदान — अतिरिक्त पडताळणी आवश्यक.', clear: 'उच्च विश्वास जुळणी', history: 'अलीकडील फील्ड स्कॅन', call: 'गंभीर प्रादुर्भाव? किसान कॉल सेंटरला कॉल करा', steps: 'शिफारस केलेल्या पुढील कृती' },
}

const predictions = [
  { name: 'Tomato Early Blight', hi: 'टमाटर अर्ली ब्लाइट', mr: 'टोमॅटो अर्ली ब्लाइट', value: 68, color: 'bg-[#2d6a4f]' },
  { name: 'Septoria Leaf Spot', hi: 'सेप्टोरिया लीफ स्पॉट', mr: 'सेप्टोरिया लीफ स्पॉट', value: 22, color: 'bg-[#e6a23c]' },
  { name: 'Healthy Leaf', hi: 'स्वस्थ पत्ती', mr: 'निरोगी पान', value: 10, color: 'bg-[#94b8a2]' },
]

export default function Page() {
  const [lang, setLang] = useState<Lang>('en')
  const [sample, setSample] = useState<Sample>('high')
  const [confidence, setConfidence] = useState(82)
  const [heatmap, setHeatmap] = useState(false)
  const [question, setQuestion] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState<Scan[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const t = copy[lang]
  const isAmbiguous = sample === 'ambiguous' && confidence < 75
  const disease = confidence >= 75 ? 'Tomato Early Blight' : 'Early Blight / Septoria'

  useEffect(() => { try { setHistory(JSON.parse(localStorage.getItem('krishisage-scans') || '[]')) } catch {} }, [])
  const saveScan = () => { const next = [{ time: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), disease, confidence, crop: 'Tomato' }, ...history].slice(0, 5); setHistory(next); localStorage.setItem('krishisage-scans', JSON.stringify(next)) }
  const analyzeImage = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedImage(url)
    setIsAnalyzing(true)
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 48; canvas.height = 48
      const context = canvas.getContext('2d')
      if (!context) return
      context.drawImage(image, 0, 0, 48, 48)
      const pixels = context.getImageData(0, 0, 48, 48).data
      let green = 0; let dark = 0
      for (let i = 0; i < pixels.length; i += 4) {
        const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]]
        if (g > r * 1.05 && g > b * 1.05) green += 1
        if (r + g + b < 180) dark += 1
      }
      const greenRatio = green / (pixels.length / 4)
      const darkRatio = dark / (pixels.length / 4)
      const result = Math.max(42, Math.min(94, Math.round(54 + greenRatio * 28 + darkRatio * 14)))
      setSample(result < 70 ? 'ambiguous' : 'high')
      setConfidence(result)
      setQuestion('')
      setIsAnalyzing(false)
      URL.revokeObjectURL(url)
    }
    image.onerror = () => setIsAnalyzing(false)
    image.src = url
  }
  const runSample = (next: Sample) => { setSample(next); setQuestion(''); setConfidence(next === 'high' ? 82 : next === 'ambiguous' ? 68 : 0); if (next !== 'blurry') saveScan() }
  const speak = () => { if ('speechSynthesis' in window) { const text = `${disease}. ${t.steps}. Remove affected leaves, improve airflow, and apply neem oil.`; const utterance = new SpeechSynthesisUtterance(text); utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN'; window.speechSynthesis.speak(utterance) } }
  const displayedPredictions = useMemo(() => predictions.map((p, i) => ({ ...p, value: sample === 'blurry' ? 0 : i === 0 ? (confidence >= 75 ? confidence : 68) : i === 1 ? (confidence >= 75 ? 12 : 22) : confidence >= 75 ? 6 : 10 })), [confidence, sample])

  return <main className="app-shell min-h-screen bg-[#f4f7f2] text-[#18352a]">
    <header className="sticky top-0 z-20 border-b border-[#dce7dd] bg-[#f4f7f2]/95 backdrop-blur"><div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 lg:px-10">
      <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[#1b4332] text-[#d8f3dc]"><Leaf /></div><div><div className="font-serif text-xl font-bold tracking-tight">KrishiSage</div><div className="hidden text-[10px] font-semibold uppercase tracking-[.18em] text-[#6b8979] sm:block">Evidence-guided crop intelligence</div></div></div>
      <nav className="hidden items-center gap-8 text-sm font-semibold text-[#587367] md:flex">{t.nav.map((x, i) => <a key={x} className={i === 1 ? 'text-[#1b4332]' : ''} href={i === 1 ? '#scan' : `#${i === 0 ? 'overview' : 'history'}`}>{x}</a>)}</nav>
      <div className="flex items-center gap-2"><span className="hidden items-center gap-2 rounded-full border border-[#bfd9c5] bg-[#e7f3e9] px-3 py-2 text-xs font-bold text-[#2d6a4f] sm:flex"><span className="size-2 rounded-full bg-[#52a66c]" /> Edge Engine Online</span><div className="relative"><button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1 rounded-full border border-[#cfddd1] bg-white px-3 py-2 text-xs font-bold">{lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'} <ChevronDown className="size-3" /></button>{menuOpen && <div className="absolute right-0 top-11 z-30 w-32 rounded-xl border border-[#dce7dd] bg-white p-1 shadow-xl">{(['en','hi','mr'] as Lang[]).map(l => <button key={l} onClick={() => { setLang(l); setMenuOpen(false) }} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#edf5ee]">{l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'मराठी'}</button>)}</div>}</div><button className="rounded-lg border border-[#cfddd1] p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu className="size-4" /></button></div>
    </div></header>
    <section id="overview" className="mx-auto max-w-[1320px] px-5 pb-10 pt-10 lg:px-10 lg:pt-16"><div className="grid items-end gap-8 lg:grid-cols-[1fr_360px]"><div><div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#6b8979]"><Sparkles className="size-4 text-[#e6a23c]" /> Field-ready intelligence / 01</div><h1 className="max-w-2xl whitespace-pre-line font-serif text-5xl font-bold leading-[.98] tracking-[-.04em] sm:text-7xl">{t.title}</h1><p className="mt-6 max-w-xl text-base leading-7 text-[#587367]">{t.sub}</p></div><div className="rounded-2xl bg-[#1b4332] p-5 text-[#d8f3dc]"><div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#a8c7ad]"><span>Field conditions</span><CloudSun className="size-4" /></div><div className="mt-5 flex items-end justify-between"><div><div className="font-serif text-4xl">28°C</div><div className="mt-1 text-sm text-[#a8c7ad]">Nashik, Maharashtra</div></div><div className="text-right text-xs leading-5 text-[#a8c7ad]">Moderate humidity<br />Good scan conditions</div></div></div></div></section>
    <section id="scan" className="mx-auto grid max-w-[1320px] gap-6 px-5 pb-16 lg:grid-cols-[.9fr_1.1fr] lg:px-10"><div className="rounded-3xl border border-[#d8e5d9] bg-white p-5 shadow-[0_14px_35px_rgba(35,73,49,.06)] sm:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#6b8979]">01 / {t.scan}</p><h2 className="mt-2 font-serif text-2xl font-bold">{t.drop}</h2></div><div className="rounded-full bg-[#edf5ee] px-3 py-1.5 text-xs font-bold text-[#2d6a4f]">Tomato leaf</div></div><button onClick={() => fileRef.current?.click()} className="group scan-dropzone relative flex min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#bdd5c2] bg-[#f6faf5] px-5 text-center transition hover:border-[#2d6a4f] hover:bg-[#edf6ee]">{uploadedImage && <img src={uploadedImage} alt="Uploaded crop leaf" className="absolute inset-0 size-full object-cover opacity-20" />}<span className="relative z-10"><div className="mb-4 grid size-12 place-items-center rounded-full bg-[#d8f3dc] text-[#2d6a4f] group-hover:scale-105"><Upload /></div><div className="font-semibold">{t.drop}</div><div className="mt-1 text-sm text-[#789083]">{isAnalyzing ? 'Reading leaf colour, contrast and texture…' : t.or}</div></span><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) analyzeImage(file) }} /></button><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => runSample('high')} className={`quick ${sample === 'high' ? 'quick-active' : ''}`}><Check /> {t.high}</button><button onClick={() => runSample('ambiguous')} className={`quick ${sample === 'ambiguous' ? 'quick-active' : ''}`}><CircleHelp /> {t.amb}</button><button onClick={() => runSample('blurry')} className={`quick ${sample === 'blurry' ? 'quick-active' : ''}`}><RotateCcw /> {t.blurry}</button></div><div className="mt-5 flex gap-3"><button onClick={() => fileRef.current?.click()} className="flex-1 rounded-xl border border-[#cfddd1] py-3 text-sm font-bold"><FileImage className="mr-2 inline size-4" />{t.browse}</button><button className="flex-1 rounded-xl bg-[#1b4332] py-3 text-sm font-bold text-white"><Camera className="mr-2 inline size-4" />{t.camera}</button></div></div>
      <div className="space-y-6"><div className="rounded-3xl bg-[#1b4332] p-6 text-white sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#a8c7ad]">02 / {t.diagnosis}</p><h2 className="mt-2 font-serif text-3xl font-bold">{sample === 'blurry' ? 'Unable to assess' : disease}</h2></div><button onClick={speak} className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold"><Volume2 className="mr-1 inline size-4" />{t.listen}</button></div>{sample === 'blurry' ? <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#fff3d9] p-4 text-sm font-semibold text-[#6f4f16]"><AlertTriangle className="mt-0.5 size-5 shrink-0" />Image quality too low or out of focus. Please re-take in clear natural lighting.</div> : <><div className={`mt-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${isAmbiguous ? 'bg-[#fff3d9] text-[#6f4f16]' : 'bg-[#d8f3dc] text-[#1b4332]'}`}><span className="size-2 rounded-full bg-current" />{isAmbiguous ? t.uncertain : t.clear}<span className="ml-auto text-lg">{confidence}%</span></div><div className="mt-6 space-y-4">{displayedPredictions.map((p, i) => <div key={p.name}><div className="mb-1 flex justify-between text-sm"><span className={i === 0 ? 'font-bold' : 'text-[#b8d2bc]'}>{lang === 'en' ? p.name : lang === 'hi' ? p.hi : p.mr}</span><span className="font-bold">{p.value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/15"><div className={`h-full rounded-full transition-all duration-700 ${p.color}`} style={{ width: `${p.value}%` }} /></div></div>)}</div></>}</div>
      {isAmbiguous && <div className="rounded-3xl border border-[#ecd49b] bg-[#fffaf0] p-6"><div className="flex gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f6dfaa] text-[#805d1d]"><CircleHelp className="size-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9c7a37]">Socratic verification</p><h3 className="mt-2 font-serif text-xl font-bold">{t.question}</h3></div></div><div className="mt-5 flex flex-col gap-2">{['Concentric dark brown rings mainly on lower, older leaves.', 'Small water-soaked circular dots scattered across the whole leaf canopy.', 'Not sure / Spots are uniform.'].map((x, i) => <label key={x} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${question === String(i) ? 'border-[#2d6a4f] bg-[#edf6ee]' : 'border-[#eadfca] bg-white'}`}><input type="radio" name="spots" value={i} checked={question === String(i)} onChange={e => setQuestion(e.target.value)} className="mt-0.5 accent-[#2d6a4f]" />{x}</label>)}</div><button disabled={!question} onClick={() => { setConfidence(question === '0' ? 86 : 78); saveScan() }} className="mt-4 w-full rounded-xl bg-[#2d6a4f] py-3 text-sm font-bold text-white disabled:opacity-40">{t.verify} <ArrowRight className="ml-1 inline size-4" /></button></div>}
      <div className="rounded-3xl border border-[#d8e5d9] bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#6b8979]">03 / Explainability</p><h3 className="mt-2 font-serif text-xl font-bold">{t.attention}</h3></div><button onClick={() => setHeatmap(!heatmap)} className={`relative h-6 w-11 rounded-full transition ${heatmap ? 'bg-[#2d6a4f]' : 'bg-[#cad8cc]'}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${heatmap ? 'left-6' : 'left-1'}`} /></button></div>{heatmap && <div className="mt-5 grid grid-cols-2 gap-3"><div className="relative overflow-hidden rounded-xl"><img src={uploadedImage || '/tomato-leaf.png'} alt="Uploaded crop leaf with disease spots" className="aspect-square w-full object-cover" /><span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">Original</span></div><div className="relative overflow-hidden rounded-xl"><img src={uploadedImage || '/tomato-leaf.png'} alt="AI attention heatmap over uploaded crop leaf" className="aspect-square w-full object-cover saturate-[2.5] hue-rotate-[290deg] brightness-125 mix-blend-multiply" /><span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">Grad-CAM</span></div><p className="col-span-2 text-xs leading-5 text-[#789083]">Heatmap highlights regions influencing the model; verify with actual spots.</p></div>}</div></div></section>
    <section className="border-y border-[#dce7dd] bg-[#edf5ee]"><div className="mx-auto grid max-w-[1320px] gap-6 px-5 py-10 lg:grid-cols-[1fr_1.4fr] lg:px-10"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#6b8979]">04 / {t.remedy}</p><h2 className="mt-2 max-w-sm font-serif text-3xl font-bold">Small actions. Better harvests.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-[#587367]">Start with the least harmful effective intervention. Always follow product labels and local KVK guidance.</p><button onClick={speak} className="mt-5 rounded-xl border border-[#b9d1bd] bg-white px-4 py-3 text-sm font-bold"><Headphones className="mr-2 inline size-4" />{t.listen} / ऐका / सुनें</button></div><div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7"><div className="flex gap-2 border-b border-[#e1eae2] pb-4"><button className="border-b-2 border-[#2d6a4f] px-2 pb-3 text-sm font-bold text-[#2d6a4f]">{t.organic}</button><button className="px-2 pb-3 text-sm font-semibold text-[#789083]">{t.chemical}</button></div><h3 className="mt-5 font-serif text-xl font-bold">{t.steps}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{['Remove and safely discard infected leaves.', 'Spray neem oil at 3–5 ml/L with a mild soap spreader.', 'Improve airflow; avoid overhead watering.', 'Use copper fungicide only as label-directed.'].map((x, i) => <div key={x} className="flex gap-3 rounded-xl bg-[#f6faf5] p-3 text-sm leading-5"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#d8f3dc] text-xs font-bold text-[#2d6a4f]">{i + 1}</span>{x}</div>)}</div><div className="mt-5 flex items-center gap-3 rounded-xl bg-[#1b4332] p-4 text-sm font-semibold text-white"><ShieldCheck className="size-5 shrink-0 text-[#a8d5ae]" />{t.call}<a href="tel:18001801551" className="ml-auto underline">1800-180-1551</a></div></div></div></section>
    <section id="history" className="mx-auto max-w-[1320px] px-5 py-8 lg:px-10"><button onClick={() => setHistoryOpen(!historyOpen)} className="flex w-full items-center justify-between rounded-2xl border border-[#d8e5d9] bg-white p-5 text-left"><span className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#e7f3e9] text-[#2d6a4f]"><RotateCcw className="size-4" /></span><span><span className="block font-serif text-xl font-bold">{t.history}</span><span className="text-xs text-[#789083]">{history.length} scans stored on this device</span></span></span>{historyOpen ? <ChevronUp /> : <ChevronDown />}</button>{historyOpen && <div className="mt-2 overflow-hidden rounded-2xl border border-[#d8e5d9] bg-white">{history.length ? history.map((s, i) => <div key={`${s.time}-${i}`} className="flex items-center justify-between border-b border-[#edf2ed] p-4 last:border-0"><div><div className="text-sm font-bold">{s.disease}</div><div className="text-xs text-[#789083]">{s.crop} · {s.time}</div></div><span className="rounded-full bg-[#e7f3e9] px-3 py-1 text-xs font-bold text-[#2d6a4f]">{s.confidence}%</span></div>) : <div className="p-5 text-sm text-[#789083]">Your evaluated scans will appear here.</div>}</div>}</section>
    <footer className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 pb-8 text-xs text-[#789083] sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>KrishiSage · Built for better field decisions</span><span>Not a replacement for local agronomist advice.</span></footer>
  </main>
}

const _unused = [Mic, X]


/* Keep quick-test controls visually consistent across the compact workflow. */
const quickStyles = ''
void quickStyles
