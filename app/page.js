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

      {/* RESULT */}
      {result && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              {["summary", "transcript"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 capitalize font-medium ${
                    activeTab === tab
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "summary" && (
              <div className="prose max-w-none whitespace-pre-line text-gray-700 leading-8">
                {result.summary}
              </div>
            )}

            {activeTab === "transcript" && (
              <div className="max-h-[450px] overflow-y-auto whitespace-pre-line text-gray-600 leading-7">
                {result.transcript}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section id="features" className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 font-semibold mb-2">Features</p>
            <h2 className="text-4xl font-bold">
              Everything you need to learn from video faster
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Lumora helps you turn long educational videos, lectures, podcasts,
              tutorials, and research content into organized learning material.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["Smart Summaries", "Get structured summaries that highlight only what matters."],
              ["Accurate Transcripts", "Turn video audio into clean, readable text."],
              ["Study Notes", "Generate organized notes you can use for exams or research."],
              ["Time Saving", "Cut hours of watching into minutes of reading."],
              ["Academic Focus", "Built for students, teachers, and researchers."],
              ["Creator Friendly", "Repurpose videos into written content ideas."],
              ["Easy Workflow", "Paste a link, process, and get results."],
              ["Future Citations", "Designed to support academic citation features later."],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-gray-200 bg-[#fafafa] hover:shadow-md transition"
              >
                <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-4">
                  ✦
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-6">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500 font-semibold mb-2">How it works</p>
          <h2 className="text-4xl font-bold mb-12">
            From video to study material in 3 steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              ["1", "Paste a YouTube link", "Drop any video URL into Lumora. No setup, no downloads, no complicated workflow."],
              ["2", "We process it with AI", "Lumora extracts the audio, transcribes it, and organizes the content into useful sections."],
              ["3", "Get your results", "Receive summaries, transcripts, and study notes ready to read, copy, or review."],
            ].map(([num, title, desc]) => (
              <div key={num} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold mb-5">
                  {num}
                </div>
                <h3 className="font-semibold text-xl mb-3">{title}</h3>
                <p className="text-gray-600 leading-7">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 font-semibold mb-2">Loved by learners</p>
            <h2 className="text-4xl font-bold">
              Save time every time you study
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["This literally saved me during finals week.", "Daniel R.", "College Student"],
              ["I stopped rewatching long lectures and started reviewing notes instead.", "Maria S.", "Nursing Student"],
              ["Best tool for turning YouTube lessons into something I can actually study.", "Kevin L.", "Computer Science Student"],
            ].map(([quote, name, role]) => (
              <div key={name} className="p-6 rounded-2xl border border-gray-200 bg-[#fafafa]">
                <p className="text-yellow-500 mb-4">★★★★★</p>
                <p className="text-gray-700 leading-7 mb-5">“{quote}”</p>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500 font-semibold mb-2">Pricing</p>
          <h2 className="text-4xl font-bold mb-4">
            Start free while Lumora is in beta
          </h2>
          <p className="text-gray-600 mb-12">
            Simple plans designed for students, creators, and researchers.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              ["Free", "$0", "Try Lumora while in beta", ["5 videos per day", "Basic summaries", "Standard processing"]],
              ["Pro", "$9", "For serious learners", ["Unlimited videos", "Advanced notes", "Faster processing", "Priority access"]],
              ["Research", "$19", "For heavy study workflows", ["Longer videos", "Multi-video analysis soon", "Citation tools soon", "Export options soon"]],
            ].map(([plan, price, desc, features]) => (
              <div
                key={plan}
                className={`p-8 rounded-2xl border bg-white ${
                  plan === "Pro"
                    ? "border-red-500 shadow-xl scale-[1.02]"
                    : "border-gray-200"
                }`}
              >
                {plan === "Pro" && (
                  <p className="text-xs bg-red-500 text-white px-3 py-1 rounded-full inline-block mb-4">
                    Most popular
                  </p>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan}</h3>
                <p className="text-gray-500 mb-5">{desc}</p>
                <p className="text-4xl font-bold mb-6">
                  {price}
                  <span className="text-sm text-gray-500 font-normal"> / month</span>
                </p>

                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="text-gray-600">
                      <span className="text-red-500">✓</span> {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold ${
                  plan === "Pro"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "border border-red-500 text-red-500 hover:bg-red-50"
                }`}>
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 font-semibold mb-2">FAQ</p>
            <h2 className="text-4xl font-bold">Questions people ask</h2>
          </div>

          <div className="space-y-4">
            {[
              ["How long does it take?", "Most videos are processed in under a minute, depending on length."],
              ["Do I need to install anything?", "No. Just paste a YouTube link and Lumora handles the rest."],
              ["Does it work with long videos?", "Yes. Longer videos may take more time to process."],
              ["Is Lumora free?", "Lumora is free during beta. Paid plans will be added later."],
              ["Who is this for?", "Students, researchers, teachers, creators, and anyone who learns from video."],
            ].map(([q, a]) => (
              <div key={q} className="border border-gray-200 rounded-xl p-5 bg-[#fafafa]">
                <h3 className="font-semibold mb-2">{q}</h3>
                <p className="text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-[#fafafa] px-6 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-red-500 text-lg mb-3">Lumora</h3>
            <p className="text-gray-600 text-sm leading-6">
              Turn YouTube videos into structured knowledge for studying,
              research, and content creation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <p className="text-sm text-gray-500 mb-2">Features</p>
            <p className="text-sm text-gray-500 mb-2">Pricing</p>
            <p className="text-sm text-gray-500">Roadmap</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <p className="text-sm text-gray-500 mb-2">About</p>
            <p className="text-sm text-gray-500 mb-2">Contact</p>
            <p className="text-sm text-gray-500">Blog</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <p className="text-sm text-gray-500 mb-2">Privacy</p>
            <p className="text-sm text-gray-500">Terms</p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          © 2026 Lumora. All rights reserved.
        </p>
      </footer>
    </div>
  );
}