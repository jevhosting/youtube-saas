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

  const isWorkspace = !!result;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111827]">
      
      {/* NAVBAR DINÁMICO */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold">
              L
            </div>
            <span className="font-bold text-lg">Lumora</span>
          </div>

          {/* CAMBIO SEGÚN MODO */}
          {!isWorkspace ? (
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#features" className="hover:text-red-500">Features</a>
              <a href="#how" className="hover:text-red-500">How it works</a>
              <a href="#pricing" className="hover:text-red-500">Pricing</a>
              <a href="#faq" className="hover:text-red-500">FAQ</a>
            </div>
          ) : (
            <div className="flex gap-6 text-sm font-medium">
              {["summary", "transcript"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize ${
                    activeTab === tab
                      ? "text-red-500 border-b-2 border-red-500 pb-1"
                      : "text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-red-500">
              Login
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition">
              {isWorkspace ? "Upgrade" : "Sign up"}
            </button>
          </div>
        </div>
      </nav>

      {/* 🔴 WORKSPACE */}
      {isWorkspace ? (
        <section className="max-w-6xl mx-auto px-6 py-10">

          {/* INPUT ARRIBA */}
          <div className="mb-6">
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

          {/* CONTENIDO LIMPIO */}
          <div className="text-gray-700 leading-8 whitespace-pre-line">
            {activeTab === "summary" && result.summary}
            {activeTab === "transcript" && result.transcript}
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-sm text-gray-700 mb-3">
              Want faster processing, longer videos, and advanced study tools?
            </p>
            <button className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
              Upgrade to Pro
            </button>
          </div>

        </section>
      ) : (
        <>
          {/* 🟢 LANDING */}
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
            </div>

            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <p className="text-gray-400">Preview</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}