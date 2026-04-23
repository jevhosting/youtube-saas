export default function UrlInput({ url, setUrl, onProcess, loading }) {
  return (
  <div className="w-full flex items-center gap-2">

    <input
      type="text"
      placeholder="Paste YouTube link..."
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      className="flex-1 px-4 py-3 rounded-lg border border-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-black/10 
                 text-sm"
    />

    <button
      onClick={onProcess}
      disabled={loading}
      className="px-5 py-3 bg-black text-white rounded-lg text-sm 
           hover:bg-gray-800 active:scale-95 transition-all duration-150 
           disabled:opacity-50"
    >
      {loading ? "..." : "Process"}
    </button>

  </div>
);
}
