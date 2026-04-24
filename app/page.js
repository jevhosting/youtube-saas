"use client";

import { useState } from "react";
import UrlInput from "../components/UrlInput";
import { processYouTubeVideo } from "../features/transcription/processVideo";

const featureCards = [
  {
    title: "Smart summaries",
    description: "Extract the ideas that matter most without replaying the full video.",
  },
  {
    title: "Clean transcripts",
    description: "Turn spoken content into readable text you can scan, copy, and study.",
  },
  {
    title: "Study-first workflow",
    description: "Go from video link to review material in a single focused flow.",
  },
];

const highlights = [
  ["No downloads", "Paste a link and process it in your browser."],
  ["Fast review", "Jump between summary and transcript instantly."],
  ["Built for learning", "Useful for classes, tutorials, podcasts, and research."],
];

const testimonialCards = [
  {
    quote: "This cut my review time in half during exam week.",
    name: "Daniel R.",
    role: "College student",
  },
  {
    quote: "I finally get the notes I wanted from long lectures.",
    name: "Maria S.",
    role: "Nursing student",
  },
  {
    quote: "Perfect for turning tutorial videos into something actionable.",
    name: "Kevin L.",
    role: "Computer science student",
  },
];

const faqItems = [
  ["How long does it take?", "Most videos finish processing in under a minute, depending on length."],
  ["Do I need to install anything?", "No. Paste a YouTube link and Lumora handles the rest."],
  ["Does it work with longer videos?", "Yes. Longer videos may simply take a bit more processing time."],
  ["Is Lumora free?", "Lumora is free during beta while the product is still evolving."],
];

function extractYouTubeVideoId(value) {
  try {
    const parsedUrl = new URL(value);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }

    return parsedUrl.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [status, setStatus] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  async function handleProcess() {
    try {
      setError("");
      setResult(null);

      if (!url.trim()) {
        setError("Please enter a YouTube URL.");
        return;
      }

      const trimmedUrl = url.trim();

      setLoading(true);
      setStatus("Processing your video...");

      const data = await processYouTubeVideo(trimmedUrl);
      setResult(data);
      setProcessedUrl(trimmedUrl);
      setVideoId(extractYouTubeVideoId(trimmedUrl));
      setActiveTab("summary");
      setStatus("");
      setUrl("");
    } catch (err) {
      console.error(err);
      setError("We couldn't process this video. Try another one.");
    } finally {
      setLoading(false);
    }
  }

  const showWorkspace = loading || error || result;
  const summaryText = result?.summary || "Your summary will appear here once the video is ready.";
  const transcriptText =
    result?.transcript || "The transcript will appear here after processing finishes.";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.15),_transparent_32%),linear-gradient(180deg,_#fffaf8_0%,_#ffffff_42%,_#fff6f1_100%)] text-slate-900">
      {!result && (
        <>
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-red-200/60">
              L
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
                Lumora
              </p>
              <p className="text-sm text-slate-500">Learn faster from YouTube</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-950">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-slate-950">
              Workflow
            </a>
            <a href="#results" className="transition hover:text-slate-950">
              Results
            </a>
            <a href="#faq" className="transition hover:text-slate-950">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 sm:inline-flex">
              Login
            </button>
            <button className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Start free
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/85 px-4 py-2 text-sm text-slate-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Built for students, researchers, and creators
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance text-slate-950 md:text-7xl">
            Turn long YouTube videos into clear study material.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Lumora helps you convert lectures, tutorials, podcasts, and explainers
            into summaries and transcripts you can review in minutes instead of hours.
          </p>

          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
            <UrlInput
              url={url}
              setUrl={setUrl}
              loading={loading}
              onProcess={handleProcess}
            />

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1.5">No downloads</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">One link, one click</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5">Summary + transcript</span>
            </div>
          </div>

          {(loading || error) && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm">
              {loading && <p className="text-slate-600">{status}</p>}
              {error && <p className="text-red-600">{error}</p>}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>4.9 average rating</span>
            <span className="hidden sm:inline">•</span>
            <span>10,000+ videos processed this month</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-12 -top-6 h-40 rounded-full bg-red-300/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.75)]">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-red-300">Preview</p>
                <h2 className="mt-2 text-2xl font-semibold">Study-ready workspace</h2>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-200">
                Live output
              </div>
            </div>

            <div className="space-y-4">
              {featureCards.map((card, index) => (
                <div
                  key={card.title}
                  className={`rounded-3xl border p-5 ${
                    index === 0
                      ? "border-red-400/40 bg-red-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-200">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Summary", "Readable in seconds"],
                ["Transcript", "Searchable reference"],
                ["Workflow", "Built for repeat use"],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-1 text-xs text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map(([title, description]) => (
            <div
              key={title}
              className="rounded-[1.75rem] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.55)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-500">
                {title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
        </>
      )}


      {result && (
<>
<nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
<div className="flex items-center gap-3">
<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-red-200/60">
L
</div>
<div>
<p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
Lumora
</p>
<p className="text-sm text-slate-500">Learn faster from YouTube</p>
</div>
</div>

    <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
      <a href="#results" className="transition hover:text-slate-950">
        Results
      </a>
      <a href="#faq" className="transition hover:text-slate-950">
        FAQ
      </a>
    </div>

    <div className="flex items-center gap-3">
      <button className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-950 sm:inline-flex">
        Login
      </button>
      <button className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
        Start free
      </button>
    </div>
  </div>
</nav>

<section id="results" className="px-6 py-10">
  <div className="mx-auto max-w-6xl space-y-8">
    <div className="rounded-[1.5rem] bg-white/80 px-6 py-5 backdrop-blur-sm">
      <UrlInput
        url={url}
        setUrl={setUrl}
        loading={loading}
        onProcess={handleProcess}
      />
    </div>

    <div className="px-1">
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </div>
        {loading && (
          <div className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
            {status}
          </div>
        )}
        {error && (
          <div className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && result && (
          <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
            Video processed successfully
          </div>
        )}
        {!showWorkspace && (
          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            Paste a link to start
          </div>
        )}
      </div>
    </div>

    <div className="rounded-[1.75rem] bg-white px-6 py-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        {videoId && (
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube video thumbnail"
            className="h-40 w-full rounded-2xl object-cover md:w-[280px]"
          />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
            Video
          </p>
          <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950">
            {processedUrl}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ready for summary & transcript
          </p>
        </div>
      </div>
    </div>

    <div className="px-1">
      <div className="flex gap-2">
        {["summary", "transcript"].map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium capitalize transition ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>

    <div className="bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-red-500">
          {activeTab}
        </p>
        <div className="whitespace-pre-line text-[15px] leading-8 text-slate-700">
          {activeTab === "summary" ? summaryText : transcriptText}
        </div>
      </div>
    </div>

    <div className="rounded-[1.75rem] bg-slate-50 px-6 py-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-white p-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
            Upgrade
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            Unlock longer videos and faster processing
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Get more capacity for deep study sessions, tutorials, and full lecture workflows.
          </p>
        </div>

        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Upgrade now
        </button>
      </div>
    </div>
  </div>
</section>
</>
)}

      {!result && (
        <>
      <section id="workflow" className="bg-white/70 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
              Workflow
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              From YouTube link to useful notes in three steps
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                "01",
                "Paste the video link",
                "Start with any YouTube URL you want to review, study, or reference later.",
              ],
              [
                "02",
                "Let Lumora process it",
                "The app sends the request, gets the transcript and summary, and keeps feedback visible while it runs.",
              ],
              [
                "03",
                "Read, scan, and reuse",
                "Switch between summary and transcript to review the content in the format you need.",
              ],
            ].map(([step, title, description]) => (
              <div
                key={step}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.6)]"
              >
                <div className="mb-6 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                  {step}
                </div>
                <h3 className="text-2xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
            Loved by learners
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            A calmer study experience for video-heavy work
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonialCards.map((item) => (
            <div
              key={item.name}
              className="rounded-[2rem] border border-slate-200 bg-white/90 p-7 shadow-[0_20px_70px_-55px_rgba(15,23,42,0.65)]"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-red-500">Five-star feedback</p>
              <p className="mt-4 text-lg leading-8 text-slate-700">"{item.quote}"</p>
              <p className="mt-6 font-semibold text-slate-950">{item.name}</p>
              <p className="text-sm text-slate-500">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-300">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Questions people ask before they try it
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map(([question, answer]) => (
              <div
                key={question}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold">{question}</h3>
                <p className="mt-2 leading-7 text-slate-300">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-950">Lumora</p>
            <p className="text-sm text-slate-500">
              Turn YouTube videos into structured knowledge for faster learning.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-500">
            <span>Features</span>
            <span>Pricing</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-7xl text-sm text-slate-400">
          © 2026 Lumora. All rights reserved.
        </p>
      </footer>
        </>
      )}
    </div>
  );
}
