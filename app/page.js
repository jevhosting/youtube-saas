"use client";
import { useEffect } from "react";

import { useState } from "react";
import UrlInput from "../components/UrlInput";
import { processYouTubeVideo } from "../features/transcription/processVideo";

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);

    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v");
    }

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    if (parsed.pathname.includes("/shorts/")) {
      return parsed.pathname.split("/shorts/")[1];
    }

    return null;
  } catch {
    return null;
  }
}

function normalizeYouTubeUrl(url) {
  const id = getYouTubeId(url);
  if (!id) return url;
  return `https://www.youtube.com/watch?v=${id}`;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [status, setStatus] = useState("Starting...");
  const [videoTitle, setVideoTitle] = useState("");
  const [history, setHistory] = useState([]);

  const [notes, setNotes] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      if (
        activeTab === "transcript" &&
        (!result?.transcript || result.transcript.length < 10)
      ) {
        try {
          setStatus("Fetching transcript...");
          setLoading(true);

          const data = await processYouTubeVideo(result?.url);

          setResult(data);

          const existing = JSON.parse(localStorage.getItem("videos") || "[]");

          const updated = existing.map((video) => {
            if (video.url === result?.url) {
              return {
                ...video,
                transcript: data.transcript,
              };
            }
            return video;
          });

          localStorage.setItem("videos", JSON.stringify(updated));
          setHistory(updated);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTranscript();
  }, [activeTab]);

  const handleGenerateNotes = async () => {
    try {
      setNotesLoading(true);

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: result.transcript,
        }),
      });

      const data = await res.json();
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setNotesLoading(false);
    }
  };

  const videoId = getYouTubeId(url);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("videos") || "[]");
    setHistory(saved);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black px-6 py-6">
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        {/* HEADER */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
          <div className="w-full mb-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              YouTube Academic SaaS
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Turn YouTube videos into structured study material.
            </p>
          </div>
          <div className="w-full mt-2">
            <UrlInput
              url={url}
              setUrl={setUrl}
              loading={loading}
              onProcess={async () => {
                try {
                  setError("");
                  setResult(null);
                  setNotes("");
                  setStatus("Downloading audio...");

                  if (!url.trim()) {
                    setError("Please enter a URL");
                    return;
                  }

                  setLoading(true);

                  const normalizedUrl = normalizeYouTubeUrl(url);

                  let fetchedTitle = "";

                  try {
                    const res = await fetch(
                      `https://noembed.com/embed?url=${normalizedUrl}`,
                    );
                    const json = await res.json();
                    fetchedTitle = json.title || "";
                    setVideoTitle(fetchedTitle);
                  } catch (e) {
                    console.error("Failed to fetch title");
                  }

                  setStatus("Transcribing video...");

                  const videoData = await processYouTubeVideo(normalizedUrl);
                  const finalTitle = fetchedTitle || "Untitled Video";

                  setResult({
                    ...videoData,
                    url: normalizedUrl,
                  });
                  setUrl("");
                  setVideoTitle("");

                  const existing = JSON.parse(
                    localStorage.getItem("videos") || "[]",
                  );

                  const newVideo = {
                    id: Date.now(),
                    url: normalizedUrl,
                    title: finalTitle,
                    summary: videoData.summary,
                    transcript: videoData.transcript, // 🔥 ESTA LÍNEA
                    createdAt: new Date().toISOString(),
                  };

                  localStorage.setItem(
                    "videos",
                    JSON.stringify([newVideo, ...existing]),
                  );
                  setHistory([newVideo, ...existing]);
                } catch (err) {
                  console.error(err);
                  setError("Something went wrong.");
                } finally {
                  setLoading(false);
                }
              }}
            />

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            {loading && (
              <div className="w-full mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4 animate-pulse">
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                {videoTitle && (
                  <h2 className="text-md font-semibold text-gray-800">
                    {videoTitle}
                  </h2>
                )}

                <div>
                  <p className="text-sm text-gray-600">⏳ {status}</p>
                  <p className="text-xs text-gray-400">Transcribing audio</p>
                  <p className="text-xs text-gray-400">Generating summary</p>
                  <p className="text-xs text-gray-400">Preparing notes</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {/* LEFT */}
          <div className="md:col-span-1">
            {history.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-3">History</h2>

                <div className="space-y-3">
                  {history.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSelectedVideoId(video.id);
                        setResult({
                          summary: video.summary,
                          transcript:
                            video.transcript || "Transcript not stored",
                          url: video.url,
                        });
                        setVideoTitle(video.title);
                        setActiveTab("summary");
                      }}
                      className={`relative group flex gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 items-start
${
  selectedVideoId === video.id
    ? "bg-gray-100 shadow-sm scale-[1.01]"
    : "hover:bg-gray-50 hover:scale-[1.01]"
}`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg`}
                        className="w-32 h-20 object-cover rounded-md"
                      />

                      <div className="flex flex-col">
                        <p className="text-base font-medium text-gray-900">
                          {video.title}
                        </p>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {video.summary}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          const updated = history.filter(
                            (v) => v.id !== video.id,
                          );
                          setHistory(updated);
                          localStorage.setItem(
                            "videos",
                            JSON.stringify(updated),
                          );
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="md:col-span-3">
            {result && (
              <div className="w-full">
                <div className="p-4 space-y-4">
                  {/* TABS */}
                  <div className="flex gap-2 border-b pb-2">
                    {["summary", "transcript", "notes"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm rounded-md ${
                          activeTab === tab
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* CONTENT */}
                  {activeTab === "summary" && (
                    <div className="w-full max-w-3xl">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-5">
                        Summary
                      </h2>
<div className="text-[17px] leading-8 text-gray-700 whitespace-pre-line space-y-3">
  {result.summary.split("\n").map((line, i) => {
  // TITLES (**)
  if (line.includes("**") || line.endsWith(":")){
    return (
      <p key={i} className="font-semibold text-lg text-gray-900 mt-6">
        {line.replace(/\*\*/g, "")}
      </p>
    );
  }

  // BULLETS (-)
  if (line.trim().startsWith("- ") && line.length < 120) {
    return (
      <p key={i} className="pl-4 text-gray-700 relative">
        <span className="absolute left-0">•</span>
        {line.replace("-", "").trim()}
      </p>
    );
  }

  // NORMAL TEXT
  return (
    <p key={i} className="text-gray-700">
      {line}
    </p>
  );
})}
</div>
                    </div>
                  )}

                  {activeTab === "transcript" && (
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      <h2 className="text-xl font-semibold mb-3">Transcript</h2>
                      <p className="text-gray-600 whitespace-pre-line text-sm">
                        {result.transcript}
                      </p>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div>
                      <button
                        onClick={handleGenerateNotes}
                        className="px-4 py-2 bg-black text-white rounded-md text-sm"
                      >
                        Generate Notes
                      </button>

                      {notesLoading && <p>Generating...</p>}
                      {notes && <p className="mt-4">{notes}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
