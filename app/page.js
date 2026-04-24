"use client";
import { useEffect, useState, useRef } from "react";
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
  const [history, setHistory] = useState([]);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("videos") || "[]");
    setHistory(saved);
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">

      {/* SIDEBAR */}
      <div className="w-[260px] h-screen flex flex-col p-4">

        <h1 className="text-lg font-semibold mb-6">Lumora</h1>

        <button
          onClick={() => scrollTo(heroRef)}
          className="text-left text-sm text-gray-400 mb-2 hover:text-white"
        >
          New analysis
        </button>

        <button
          onClick={() => scrollTo(featuresRef)}
          className="text-left text-sm text-gray-400 mb-4 hover:text-white"
        >
          Features
        </button>

        <p className="text-xs text-gray-500 mb-2">History</p>

        <div className="space-y-2 overflow-y-auto">
          {history.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                setResult(video);
                setVideoTitle(video.title);
                setActiveTab("summary");
                scrollTo(resultRef);
              }}
              className="p-2 text-sm text-gray-300 hover:bg-[#1a1a1a] rounded cursor-pointer"
            >
              {video.title}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">

        {/* HERO */}
        <section
          ref={heroRef}
          className="h-screen flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="text-3xl font-semibold mb-4">
            Turn YouTube videos into study-ready knowledge
          </h1>

          <div className="w-full max-w-2xl">
            <UrlInput
              url={url}
              setUrl={setUrl}
              loading={loading}
              onProcess={async () => {
                try {
                  setError("");
                  setResult(null);
                  setStatus("Processing...");

                  if (!url.trim()) {
                    setError("Enter a URL");
                    return;
                  }

                  setLoading(true);

                  const videoData = await processYouTubeVideo(url);

                  setResult(videoData);

                  const newVideo = {
                    id: Date.now(),
                    title: "Untitled Video",
                    ...videoData,
                  };

                  const existing = JSON.parse(
                    localStorage.getItem("videos") || "[]"
                  );

                  localStorage.setItem(
                    "videos",
                    JSON.stringify([newVideo, ...existing])
                  );

                  setHistory([newVideo, ...existing]);

                  setTimeout(() => scrollTo(resultRef), 300);
                } catch (err) {
                  setError("Error processing video");
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>

          {loading && <p className="mt-4 text-gray-400">{status}</p>}
          {error && <p className="mt-4 text-red-400">{error}</p>}
        </section>

        {/* FEATURES */}
        <section
          ref={featuresRef}
          className="py-20 px-6 max-w-5xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-10 text-center">
            What you can do
          </h2>

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

        {/* RESULT */}
        {result && (
          <section
            ref={resultRef}
            className="py-20 px-6 max-w-4xl mx-auto"
          >
            <h2 className="text-lg mb-4 text-gray-300">
              {videoTitle || "Video Result"}
            </h2>

            {/* TABS */}
            <div className="flex gap-2 mb-6">
              {["summary", "transcript"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* CONTENT */}
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

      </div>
    </div>
  );
}