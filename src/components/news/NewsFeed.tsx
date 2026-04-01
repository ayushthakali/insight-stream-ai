import { Article } from "@/src/lib/features/api/newsApiSlice";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface NewsFeedProps {
  articles: Article[];
}
const NewsFeed = ({ articles }: NewsFeedProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: articles.length, // Total number of items in your full list.Virtualizer needs to know this to calculate total scroll height
    getScrollElement: () => parentRef.current, // Which DOM element is scrollable — the container div
    estimateSize: () => 180, // Virtualizer can't know the real height until it render, So you give it a rough estimate upfront — 180px per card, It uses this to calculate the total scrollable height, e.g. 1000 articles × 180px = 180,000px total scroll area
    overscan: 5, // Renders 5 extra items ABOVE and BELOW the visible area. So if items 10-20 are visible, it actually renders 5-25
  });
  return (
    <div
      ref={parentRef}
      className="h-[600px] w-full max-w-4xl mx-auto overflow-auto border border-zinc-800 rounded-xl bg-zinc-950/50 p-4 scrollbar-hide"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const article = articles[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full p-2"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="flex gap-4 p-4 h-full bg-zinc-900 border border-zinc-800 rounded-lg hover:border-violet-500/50 transition-all group">
                {article.urlToImage && (
                  <Image
                    src={article.urlToImage}
                    alt="url to image"
                    className="w-32 h-full object-cover rounded-md grayscale group-hover:grayscale-0 transition-all"
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-betweeen">
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
                    onClick={() => window.open(article.url, "_blank")}
                    className="text-zinc-500 hover:text-white"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;
