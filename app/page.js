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

  return (
    <div className="bg-white text-black">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 border-b">
        <h1 className="font-bold text-lg text-red-500">Lumora</h1>

        <div className="flex gap-8 text-sm">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="flex gap-4">
          <button className="text-sm">Login</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">
            Sign up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-24 px-6">

        <p className="text-red-500 mb-2 text-sm">
          Trusted by 5000+ students
        </p>

        <h1 className="text-5xl font-bold mb-6">
          Turn YouTube videos into
          <span className="text-red-500"> study notes</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Generate summaries, transcripts and notes instantly.
        </p>

        <div className="max-w-2xl mx-auto">
          <UrlInput
            url={url}
            setUrl={setUrl}
            loading={loading}
            onProcess={async () => {
              try {
                setLoading(true);
                const data = await processYouTubeVideo(url);
                setResult(data);
              } catch {
                setError("Error processing video");
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </section>

      {/* RESULT */}
      {result && (
        <section className="max-w-4xl mx-auto px-6 pb-20">

          <div className="flex gap-4 border-b mb-6">
            {["summary", "transcript"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 ${
                  activeTab === tab
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            {activeTab === "summary" && result.summary}
            {activeTab === "transcript" && result.transcript}
          </div>

        </section>
      )}

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 border rounded-lg hover:shadow-md">
            <h3 className="font-semibold mb-2">Summaries</h3>
            <p className="text-gray-500 text-sm">
              Clean, structured summaries instantly
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-md">
            <h3 className="font-semibold mb-2">Transcripts</h3>
            <p className="text-gray-500 text-sm">
              Full transcription in seconds
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-md">
            <h3 className="font-semibold mb-2">Study Notes</h3>
            <p className="text-gray-500 text-sm">
              Ready-to-use notes for exams
            </p>
          </div>

        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="text-center py-16 bg-gray-50">
        <p className="text-lg font-medium mb-2">
          ⭐⭐⭐⭐⭐ 4.9 from 1200+ users
        </p>
        <p className="text-gray-500">
          “This saved me hours studying for exams”
        </p>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Simple pricing
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center">

          <div className="border p-6 rounded-lg w-64">
            <h3 className="font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0</p>
            <p className="text-sm text-gray-500">Limited usage</p>
          </div>

          <div className="border p-6 rounded-lg w-64 shadow-lg">
            <h3 className="font-semibold mb-2 text-red-500">Pro</h3>
            <p className="text-3xl font-bold mb-4">$9</p>
            <p className="text-sm text-gray-500">Unlimited videos</p>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          FAQ
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Is it free?</h3>
            <p className="text-gray-500">Yes, during beta.</p>
          </div>

          <div>
            <h3 className="font-semibold">How fast is it?</h3>
            <p className="text-gray-500">Usually under 1 minute.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 px-6 text-center text-gray-500 text-sm">
        © 2026 Lumora. All rights reserved.
      </footer>

    </div>
  );
}