"use client";

import { Loader2, Search } from "lucide-react";

interface SearchBarProps {
  isFetching: boolean;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  totalResults: number | undefined;
}

export default function SearchBar({
  isFetching,
  searchTerm,
  setSearchTerm,
  totalResults,
}: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {isFetching ? (
            <Loader2 className="size-5 text-violet-500 animate-spin" />
          ) : (
            <Search className="size-5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search global news insights..."
          className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all shadow-xl"
        />
      </div>

      <div className="text-center mt-4">
        {totalResults && (
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            Found {totalResults.toLocaleString()} results
          </p>
        )}
      </div>
    </div>
  );
}
