"use client";

import { useState } from "react";
import SearchBar from "../components/news/SearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { useGetNewsQuery } from "../lib/features/api/newsApiSlice";
import { Loader2 } from "lucide-react";
import NewsFeed from "../components/news/NewsFeed";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isFetching, isLoading, error } = useGetNewsQuery(
    { q: debouncedSearch || "latest", page },
    { skip: debouncedSearch.length < 3 && debouncedSearch !== "" },
  );

  const fetchNextPage = () => {
    if (!isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-violet-400 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
            InsightStream AI
          </h1>
          <p className="text-zinc-500 font-medium">
            Real-time research engine powered by Gemini AI
          </p>
        </header>
        <SearchBar
          isFetching={isFetching}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalResults={data?.totalResults}
        />
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-500 gap-4">
            <Loader2 className="animate-spin size-10 text-violet-500" />
            <p className="animate-pulse font-mono text-xs uppercase tracking-widest">
              Initializing Neural Stream...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 border border-red-900/50 bg-red-900/10 rounded-2xl text-center">
            <p className="text-red-400 font-medium">
              Quota Exceeded or API Error
            </p>
            <p className="text-red-400/60 text-sm">
              Please check your NewsAPI key.
            </p>
          </div>
        ) : (
          <NewsFeed
            articles={data?.articles || []}
            isFetching={isFetching}
            hasMore={(data?.articles.length ?? 0) < 100}
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>
    </main>
  );
}
