import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-[#120609] text-slate-900 dark:text-slate-100">
      <span className="text-xs font-bold uppercase tracking-widest text-maroon-700 dark:text-maroon-400 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl font-extrabold mb-3">Resource Not Found</h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mb-6">
        The requested research node or portal path does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white text-sm font-semibold rounded-xl shadow transition-colors"
      >
        Return to MINDH Hub
      </Link>
    </div>
  );
}
