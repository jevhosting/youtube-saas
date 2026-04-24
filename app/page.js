"use client";

import { useState } from "react";
import UrlInput from "../components/UrlInput";
import { processYouTubeVideo } from "../features/transcription/processVideo";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [status, setStatus] = useState("");

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111827]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold">
              L
            </div>
            <span className="font-bold text-lg">Lumora</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-red-500">Features</a>
            <a href="#how" className="hover:text-red-500">How it works</a>
            <a href="#pricing" className="hover:text-red-500">Pricing</a>
            <a href="#faq" className="hover:text-red-500">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-red-500">
              Login
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition">
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-red-500 font-semibold mb-4">
            Built for students, researchers, and creators
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Turn YouTube videos into{" "}
            <span className="text-red-500">study-ready knowledge</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-xl leading-8">
            Stop wasting hours watching long videos. Lumora extracts summaries,
            transcripts, and study notes from YouTube videos so you can learn
            faster, review better, and save time.
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200 max-w-2xl">
            <UrlInput
              url={url}
              setUrl={setUrl}
              loading={loading}
              onProcess={async () => {
                try {
                  setError("");
                  setResult(null);

                  if (!url.trim()) {
                    setError("Please enter a YouTube URL.");
                    return;
                  }

                  setLoading(true);
                  setStatus("Processing your video...");

                  const data = await processYouTubeVideo(url);
                  setResult(data);
                  setStatus("");

                  // 🔥 SCROLL AUTOMÁTICO AL WORKSPACE
                  setTimeout(() => {
                    document.getElementById("workspace")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 200);

                } catch (err) {
                  console.error(err);
                  setError("We couldn’t process this video. Try another one.");
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>

          {loading && (
            <p className="mt-4 text-gray-500 text-sm">⏳ {status}</p>
          )}

          {error && (
            <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
            <span>✔ No downloads</span>
            <span>✔ No editing</span>
            <span>✔ Paste a link and go</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>⭐ 4.9 average rating</span>
            <span>•</span>
            <span>10,000+ videos processed this month</span>
          </div>
        </div>

        {/* HERO CARD */}
        <div className="relative">
          <div className="absolute -inset-4 bg-red-500 rounded-[2rem] rotate-3 opacity-90"></div>

          <div className="relative bg-white rounded-[2rem] shadow-2xl border border-gray-200 p-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
              <p className="text-sm text-gray-400 mb-2">YouTube URL</p>
              <div className="h-10 bg-white rounded-lg border border-gray-200"></div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl">
                <h3 className="font-semibold text-red-600">Smart Summary</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get the important ideas without watching the full video.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold">Transcript</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Clean readable text generated from the video audio.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold">Study Notes</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Turn content into review-ready learning material.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔴 WORKSPACE (RESULTADOS MEJORADOS) */}
      {result && (
        <section id="workspace" className="max-w-6xl mx-auto px-6 pb-24">

          {/* INPUT ARRIBA */}
          <div className="mb-8">
            <UrlInput
              url={url}
              setUrl={setUrl}
              loading={loading}
              onProcess={async () => {
                try {
                  setError("");
                  setResult(null);

                  if (!url.trim()) {
                    setError("Please enter a YouTube URL.");
                    return;
                  }

                  setLoading(true);
                  setStatus("Processing your video...");

                  const data = await processYouTubeVideo(url);
                  setResult(data);
                  setStatus("");
                } catch (err) {
                  console.error(err);
                  setError("We couldn’t process this video. Try another one.");
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>

          {loading && (
            <p className="mb-4 text-gray-500 text-sm">⏳ {status}</p>
          )}

          {error && (
            <p className="mb-4 text-red-500 text-sm font-medium">{error}</p>
          )}

          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-200 mb-6 text-sm font-medium">
            {["summary", "transcript"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize ${
                  activeTab === tab
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* CONTENIDO SIN CAJA */}
          <div className="text-gray-700 leading-8 whitespace-pre-line">
            {activeTab === "summary" && result.summary}
            {activeTab === "transcript" && result.transcript}
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-sm text-gray-700 mb-3">
              Unlock longer videos, faster processing, and advanced study tools.
            </p>
            <button className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
              Upgrade to Pro
            </button>
          </div>

        </section>
      )}

      {/* TODO LO DEMÁS SE QUEDA IGUAL (features, pricing, etc) */}

    </div>
  );
}