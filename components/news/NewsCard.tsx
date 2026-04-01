import { Brain, ExternalLink, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAI } from "@/src/hooks/useAI";
import { Article } from "@/src/lib/features/api/newsApiSlice";

function NewsCard({ article }: { article: Article }) {
  const { loading, summary, summarize } = useAI();

  return (
    <div className="flex gap-4 p-4 h-full bg-zinc-900 border border-zinc-800 rounded-lg hover:border-violet-500/50 transition-all group">
      {article.urlToImage && (
        <figure className="relative w-36 h-full flex-shrink-0">
          <Image
            src={article.urlToImage}
            alt="url to image"
            fill
            className=" object-cover rounded-md grayscale group-hover:grayscale-0 transition-all"
          />
        </figure>
      )}
      <div className="flex-1 flex flex-col justify-between space-y-8">
        <div>
          <h3 className="text-white font-semibold line-clamp-1">
            {article.title}
          </h3>
          <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
            {article.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-violet-400 font-mono uppercase tracking-tighter">
            {article.source.name}
          </span>

          <button
            onClick={() => summarize(article.description || article.title)}
            disabled={loading}
            className="flex items-center gap-2 text-[10px] bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded-full border active:scale-95 border-violet-500/20 transition-all"
          >
            {loading ? (
              <div className="flex gap-1 items-center">
                <Loader2 className="size-3 animate-spin" />
                <p className="font-mono tracking-tight animate-pulse">
                  Analyzing...
                </p>
              </div>
            ) : (
              <div className="flex gap-1 items-center cursor-pointer ">
                <Sparkles className="size-3 group-hover:text-zinc-300 text-white/60" />
                <p className="group-hover:text-zinc-300 text-white/60">
                  AI Summary
                </p>
              </div>
            )}
          </button>

          <button
            onClick={() => window.open(article.url, "_blank")}
            className="text-zinc-500 hover:text-white"
          >
            <ExternalLink size={16} />
          </button>
        </div>

        {summary && (
          <div className="p-3 bg-violet-500/5 border-l-2 border-violet-500 rounded text-xs text-zinc-300 animate-in fade-in slide-in-from-top-2">
            <p className="font-bold text-violet-400 mb-1 flex items-center gap-1">
              <Brain size={12} /> Executive Summary:
            </p>
            {summary}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsCard;
