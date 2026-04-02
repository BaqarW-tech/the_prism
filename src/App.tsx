/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Search, 
  Loader2, 
  ShieldCheck, 
  Scale, 
  History, 
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

const SYSTEM_INSTRUCTION = `You are "The Prism" – a news analysis app that never takes sides but shows all sides.

Your job: Given any news article, evaluate it from THREE distinct political perspectives: CONSERVATIVE, CENTRIST, and LIBERAL/PROGRESSIVE.

CRITICAL RULES (break these = app fails):
1. NEVER let perspectives bleed into each other. Each lens uses its OWN vocabulary, values, and assumptions.
2. ALWAYS start with a neutral factual summary BEFORE any lens analysis. Facts are sacred.
3. NEVER claim one lens is "correct" or "the truth." You are a mirror, not a judge.
4. If an article contains false claims, state the fact first, THEN show how each lens would treat that falsehood.
5. Keep temperature low mentally – no creative drift. Be predictable by design.

Now, here are the THREE LENSES you must embody exactly:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 LIBERAL / PROGRESSIVE LENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Values: Social justice, equality, collective action, systemic analysis, government intervention for market failures.
Vocabulary: "systemic barriers," "underrepresented," "climate crisis," "safety net," "wealth gap," "reproductive freedom," "corporate accountability."
Avoid: "States' rights" (positive), "bootstraps only," regulation as evil, "socialist" as pejorative.
Frame: What does this reveal about power imbalance, equity, or collective need?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 CONSERVATIVE LENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Values: Individual liberty, free markets, traditional institutions, limited government, fiscal discipline, national security.
Vocabulary: "fiscal discipline," "personal responsibility," "sovereignty," "rule of law," "religious liberty," "regulatory burden," "traditional values."
Avoid: "Systemic oppression" (primary frame), "tax the rich" (automatic solution), regulation as always wise.
Frame: What does this reveal about government overreach, incentive problems, or individual agency?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚪ CENTRIST / MODERATE LENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Values: Pragmatism, compromise, evidence-based policy, institutional stability, incremental reform.
Vocabulary: "evidence-based," "bipartisan," "fiscal reality," "cost-benefit analysis," "stakeholder input," "gradual transition," "political feasibility," "common ground."
Avoid: False equivalence (both sides wrong equally), ideological labels as praise, default "do nothing" or "do everything."
Frame: What trade-offs exist? Where can compromise happen? What does evidence say without purity?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT FORMAT (strict – use exactly this structure):

## 📰 FACTUAL SUMMARY
[3-4 neutral sentences. No interpretation. Just who, what, when, where, how many. If a claim is disputed, say "X says Y, while Z says W."]

## 🔵 LIBERAL / PROGRESSIVE VIEW
**Interpretation:** [2-3 sentences using liberal vocabulary and framing]
**Likely Response:** [What would a progressive politician or activist propose?]

## 🔴 CONSERVATIVE VIEW
**Interpretation:** [2-3 sentences using conservative vocabulary and framing]
**Likely Response:** [What would a conservative politician or think tank propose?]

## ⚪ CENTRIST VIEW
**Interpretation:** [2-3 sentences using centrist vocabulary and framing]
**Likely Response:** [What would a bipartisan or evidence-focused moderate propose?]

## 🔍 PERSPECTIVE COMPARISON (one sentence each)
- Where liberal and conservative agree: [if anywhere]
- Where liberal and conservative irreconcilably differ: [core value clash]
- Centrist bridge: [possible compromise both might accept]

---

HANDLING EDGE CASES (do not crash or cheat):
- If article is short: Still produce all sections. Use "based on available information..."
- If article is opinion/editorial: State that clearly in factual summary. Then analyze the opinion through each lens.
- If article is purely technical (science, sports, weather): All lenses will largely agree on facts. Show minor framing differences. Say "minimal ideological divergence" in comparison section.
- If user pastes non-news: Respond "Please provide a news article. I analyze events, not general text."

FINAL SELF-CHECK BEFORE OUTPUTTING (do this silently):
✓ Did I separate facts from interpretation?
✓ Did I use each lens's distinct vocabulary?
✓ Did I avoid saying one lens is right?
✓ Did I avoid cross-contamination (liberal words in conservative section)?`;

export default function App() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const analyzeArticle = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2, // Low temperature for predictability
        },
      });

      if (response.text) {
        setAnalysis(response.text);
      } else {
        setError("Failed to generate analysis. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while analyzing the article. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (analysis && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysis]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg bg-indigo-600 shadow-lg shadow-indigo-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-indigo-400 to-white opacity-50" />
              <Sparkles className="w-5 h-5 text-white relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">The Prism</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Methodology</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            See the <span className="text-indigo-600">Full Spectrum</span> of News
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            The Prism splits news into its core perspectives. No bias, just clarity. 
            Paste an article or URL below to begin.
          </motion.p>
        </section>

        {/* Input Section */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 md:p-8">
            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste news article text or URL here..."
                className="w-full h-48 md:h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-lg leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setInput('')}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={analyzeArticle}
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    isLoading && "animate-pulse"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze Article
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div ref={resultRef}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex flex-col items-center justify-center gap-6"
              >
                <div className="relative w-24 h-24">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Splitting the Spectrum</h3>
                  <p className="text-slate-500">Evaluating perspectives through multiple lenses...</p>
                </div>
              </motion.div>
            ) : analysis ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    Analysis Complete
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>

                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:border-b prose-h2:pb-4 prose-h2:mt-12 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                   <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <ReactMarkdown
                      components={{
                        h2: ({node, ...props}) => {
                          const text = String(props.children);
                          let icon = <Info className="w-6 h-6" />;
                          let colorClass = "text-slate-900";
                          let bgClass = "bg-slate-100";

                          if (text.includes("FACTUAL")) {
                            icon = <ShieldCheck className="w-6 h-6" />;
                            colorClass = "text-indigo-600";
                            bgClass = "bg-indigo-50";
                          } else if (text.includes("LIBERAL")) {
                            icon = <div className="w-3 h-3 rounded-full bg-blue-500" />;
                            colorClass = "text-blue-700";
                            bgClass = "bg-blue-50";
                          } else if (text.includes("CONSERVATIVE")) {
                            icon = <div className="w-3 h-3 rounded-full bg-red-500" />;
                            colorClass = "text-red-700";
                            bgClass = "bg-red-50";
                          } else if (text.includes("CENTRIST")) {
                            icon = <div className="w-3 h-3 rounded-full bg-slate-400" />;
                            colorClass = "text-slate-700";
                            bgClass = "bg-slate-50";
                          } else if (text.includes("COMPARISON")) {
                            icon = <Scale className="w-6 h-6" />;
                            colorClass = "text-amber-700";
                            bgClass = "bg-amber-50";
                          }

                          return (
                            <div className="flex items-center gap-4 mb-8 mt-12 first:mt-0">
                              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", bgClass)}>
                                {icon}
                              </div>
                              <h2 {...props} className={cn("m-0 border-none pb-0", colorClass)} />
                            </div>
                          );
                        },
                        p: ({node, ...props}) => (
                          <p {...props} className="text-lg mb-6 last:mb-0" />
                        ),
                        li: ({node, ...props}) => (
                          <li {...props} className="text-lg mb-3 last:mb-0" />
                        ),
                        strong: ({node, ...props}) => (
                          <strong {...props} className="text-slate-900 font-bold" />
                        )
                      }}
                    >
                      {analysis}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-indigo-600 rounded-3xl text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Stay Informed</h4>
                      <p className="text-indigo-100 text-sm">Analyze another article to see more perspectives.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setInput('');
                      setAnalysis(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    New Analysis
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mb-6">
                  <Info className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to analyze</h3>
                <p className="text-slate-500">Enter a news article above to see it through different lenses.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 flex items-center justify-center rounded bg-indigo-600 shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">The Prism</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            Our mission is to provide objective news analysis by highlighting the diversity of perspectives 
            that shape our world.
          </p>
          <div className="flex justify-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-slate-400 text-xs">
            © 2026 The Prism Analysis Group. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
