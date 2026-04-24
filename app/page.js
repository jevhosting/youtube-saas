"use client";
import { useEffect, useState } from "react";
import UrlInput from "../components/UrlInput";
import { processYouTubeVideo } from "../features/transcription/processVideo";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [status, setStatus] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className="font-semibold text-lg">Lumora</h1>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl font-semibold mb-4">
          Turn YouTube videos into study-ready knowledge
        </h1>

        <p className="text-gray-400 mb-8 max-w-xl">
          Generate summaries, transcripts, and notes instantly from any YouTube video.
        </p>

        <div className="w-full max-w-2xl">
          <UrlInput
            url={url}
            setUrl={setUrl}
            loading={loading}
            onProcess={async () => {
              try {
                setError("");
                setResult(null);
                setStatus("Processing video...");

                if (!url.trim()) {
                  setError("Enter a YouTube URL");
                  return;
                }

                setLoading(true);

                const videoData = await processYouTubeVideo(url);

                setResult(videoData);
                setVideoTitle("Untitled Video");

              } catch (err) {
                setError("We couldn’t process this video.");
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>

        {loading && <p className="mt-4 text-gray-400">{status}</p>}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </section>

      {/* RESULT */}
      {result && (
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <h2 className="text-lg text-gray-300 mb-4">{videoTitle}</h2>

          <div className="flex gap-4 mb-6">
            {["summary", "transcript"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm ${
                  activeTab === tab
                    ? "text-white border-b border-white"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "summary" && (
            <p className="text-gray-300 whitespace-pre-line">
              {result.summary}
            </p>
          )}

          {activeTab === "transcript" && (
            <p className="text-gray-400 whitespace-pre-line">
              {result.transcript}
            </p>
          )}
        </section>
      )}

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-10">Features</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Summaries</h3>
            <p className="text-sm text-gray-400">
              Get structured summaries instantly
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Transcripts</h3>
            <p className="text-sm text-gray-400">
              Full video transcription
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-sm text-gray-400">
              Study-ready key points
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-10">How it works</h2>

        <div className="flex flex-col md:flex-row justify-center gap-10 text-gray-400">
          <div>Paste a YouTube link</div>
          <div>Process with AI</div>
          <div>Get study material</div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Free during beta
        </h2>
        <p className="text-gray-400">
          Pro features coming soon
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-10 text-center">FAQ</h2>

        <div className="space-y-6 text-gray-400">
          <div>
            <h3 className="text-white font-medium">Is it free?</h3>
            <p>Yes, currently free during beta.</p>
          </div>

          <div>
            <h3 className="text-white font-medium">What videos work?</h3>
            <p>Most public YouTube videos.</p>
          </div>

          <div>
            <h3 className="text-white font-medium">What does it generate?</h3>
            <p>Summaries, transcripts, and notes.</p>
          </div>
        </div>
      </section>

    </div>
  );
}