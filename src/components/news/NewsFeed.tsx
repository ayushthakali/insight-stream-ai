import { Article } from "@/src/lib/features/api/newsApiSlice";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import NewsCard from "./NewsCard";

interface NewsFeedProps {
  articles: Article[];
}

const NewsFeed = ({ articles }: NewsFeedProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: articles.length, // Total number of items in your full list.Virtualizer needs to know this to calculate total scroll height
    getScrollElement: () => parentRef.current, // Which DOM element is scrollable — the container div
    estimateSize: () => 200, // Virtualizer can't know the real height until it render, So you give it a rough estimate upfront — 200px per card, It uses this to calculate the total scrollable height, e.g. 1000 articles × 200px = 200,000px total scroll area
    overscan: 5, // Renders 5 extra items ABOVE and BELOW the visible area. So if items 10-20 are visible, it actually renders 5-25
  });
  return (
    <div
      ref={parentRef}
      className="h-[800px] w-full max-w-4xl mx-auto overflow-auto border border-zinc-800 rounded-xl bg-zinc-950/50 p-4"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.2) transparent",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`, // Say you have 1000 articles: getTotalSize() = 1000 × 200px = 200,000px tall
          width: "100%",
          position: "relative", //position: relative is required because every card inside uses position: absolute
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          //getVirtualItems() only returns the items currently visible + overscan
          const article = articles[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 left-0 w-full p-2"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`, //Every card is `absolute top-0` — they all start at the top of the relative container. The `translateY` then pushes each one to its correct position:
              }}
            >
              <NewsCard article={article} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;

// Each virtualRow object looks like:
// ts{
//   index: 7,      // which article → articles[7]
//   key: 7,        // React key
//   size: 200,     // height in px
//   start: 1260,   // distance from top in px (7 × 180)
// }
