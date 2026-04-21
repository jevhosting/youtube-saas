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

  const [notes, setNotes] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-white text-black px-4 py-8">
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* 🔥 HEADER */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-center">
            YouTube Academic SaaS
          </h1>

          <p className="text-gray-500 text-center max-w-xl">
            Turn any YouTube video into clean, structured study material.
          </p>

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

                  if (!url.trim()) {
                    setError("Please enter a URL");
                    return;
                  }

                  setLoading(true);

                  const data = await processYouTubeVideo(url);
                  setResult(data);
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
          </div>
        </div>

        {/* 🔥 RESULT PANEL */}
        {result && (
          <div className="w-full mt-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="p-4 space-y-4">
              {/* TABS */}
              <div className="flex gap-2 border-b pb-2">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`px-4 py-2 text-sm rounded-md ${
                    activeTab === "summary"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Summary
                </button>

                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`px-4 py-2 text-sm rounded-md ${
                    activeTab === "transcript"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Transcript
                </button>

                <button
                  onClick={() => setActiveTab("notes")}
                  className={`px-4 py-2 text-sm rounded-md ${
                    activeTab === "notes"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* SUMMARY */}
              {activeTab === "summary" && (
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <h2 className="text-xl font-semibold mb-3">Summary</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-[15px]">
                    {result.summary}
                  </p>
                </div>
              )}

              {/* TRANSCRIPT */}
              {activeTab === "transcript" && (
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <h2 className="text-xl font-semibold mb-3">Transcript</h2>
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">
                    {result.transcript}
                  </p>
                </div>
              )}

              {/* NOTES */}
              {activeTab === "notes" && (
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <h2 className="text-xl font-semibold mb-3">Notes</h2>

                  {!notes && (
                    <p className="text-gray-500 text-sm">
                      Click “Generate Notes” to create study notes.
                    </p>
                  )}

                  <button
                    onClick={handleGenerateNotes}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-md text-sm"
                  >
                    Generate Notes
                  </button>

                  {notesLoading && (
                    <p className="text-sm text-gray-400 mt-2">
                      Generating notes...
                    </p>
                  )}

                  {notes && (
                    <p className="text-gray-700 whitespace-pre-line mt-4">
                      {notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
