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
  <div className="min-h-screen bg-[#0f0f0f] text-white flex">

    {/* SIDEBAR */}
    <div className="w-[280px] h-screen border-r border-gray-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-400">History</h2>

      <div className="space-y-2">
        {history.map((video) => (
          <div
            key={video.id}
            onClick={() => {
              setSelectedVideoId(video.id);
              setResult({
                summary: video.summary,
                transcript: video.transcript,
                url: video.url,
              });
              setVideoTitle(video.title);
              setActiveTab("summary");
            }}
            className="p-3 bg-[#1a1a1a] rounded-lg cursor-pointer hover:bg-[#222]"
          >
            <p className="text-sm">{video.title}</p>
          </div>
        ))}
      </div>
    </div>

    {/* MAIN AREA */}
    <div className="flex-1 flex flex-col items-center p-10">

      {/* HEADER */}
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Lumora
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Turn YouTube videos into structured study material.
        </p>
      </div>

      {/* INPUT */}
      <div className="w-full max-w-2xl">
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
                transcript: videoData.transcript,
                createdAt: new Date().toISOString(),
              };

              localStorage.setItem(
                "videos",
                JSON.stringify([newVideo, ...existing]),
              );
              setHistory([newVideo, ...existing]);

            } catch (err) {
              console.error(err);
              setError("We couldn’t process this video.");
            } finally {
              setLoading(false);
            }
          }}
        />

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="w-full max-w-2xl mt-6 bg-[#1a1a1a] p-5 rounded-lg animate-pulse">
          <p className="text-sm text-gray-400">⏳ {status}</p>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="w-full max-w-2xl mt-10 bg-[#1a1a1a] p-6 rounded-xl">

          {/* TABS */}
          <div className="flex gap-2 border-b border-gray-700 pb-2 mb-4">
            {["summary", "transcript", "notes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === tab
                    ? "bg-white text-black"
                    : "bg-gray-800 text-gray-400"
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
            <div className="max-h-[400px] overflow-y-auto">
              <p className="text-gray-400 text-sm whitespace-pre-line">
                {result.transcript}
              </p>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <button
                onClick={handleGenerateNotes}
                className="px-4 py-2 bg-white text-black rounded-md text-sm"
              >
                Generate Notes
              </button>

              {notesLoading && <p className="mt-3">Generating...</p>}
              {notes && <p className="mt-4 text-gray-300">{notes}</p>}
            </div>
          )}
        </div>
      )}

    </div>
  </div>
    );
}
