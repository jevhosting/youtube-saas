export default function UrlInput({ url, setUrl, onProcess, loading }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Paste YouTube link here..."
        className="w-full border border-gray-300 p-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-black"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
  className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-50"
  onClick={onProcess}
  disabled={loading}
>
  {loading ? "Processing..." : "Process"}
</button>
    </div>
  );
}
