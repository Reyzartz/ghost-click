import crxLogo from "@/assets/crx.svg";

export default function App() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <img src={crxLogo} alt="Ghost Click" className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Ghost Click Side Panel</h2>
      </div>

      <p className="text-sm text-gray-600">
        Use this side panel to interact with the current page.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
          Action 1
        </button>
        <button className="px-3 py-2 rounded bg-slate-200 hover:bg-slate-300">
          Action 2
        </button>
      </div>
    </div>
  );
}
