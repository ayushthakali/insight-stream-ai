"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import NewsCard from "./NewsCard";
import { Article } from "@/lib/features/api/newsApiSlice";
import { useThrottle } from "@/hooks/useThrottle";

interface NewsFeedProps {
  articles: Article[];
  isFetching: boolean;
  hasMore: boolean;
  fetchNextPage: () => void;
}

const NewsFeed = ({
  articles,
  isFetching,
  hasMore,
  fetchNextPage,
}: NewsFeedProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualization
  const rowVirtualizer = useVirtualizer({
    count: articles.length, // Total number of items in your full list.Virtualizer needs to know this to calculate total scroll height
    getScrollElement: () => parentRef.current, // Which DOM element should I watch for scrolling?
    estimateSize: () => 200, // Virtualizer can't know the real height until it render, So you give it a rough estimate upfront — 200px per card, It uses this to calculate the total scrollable height, e.g. 1000 articles × 200px = 200,000px total scroll area
    overscan: 5, // Renders 5 extra items ABOVE and BELOW the visible area. So if items 10-20 are visible, it actually renders 5-25
    measureElement: (el) => el.getBoundingClientRect().height, // after each card renders in the DOM, this function measures its REAL height and updates the virtualizer. el is the actual DOM element (the div wrapping each NewsCard). getBoundingClientRect().height returns the real pixel height
  });

  const virtualItems = rowVirtualizer.getVirtualItems(); //getVirtualItems is the brian of whole thing. It looks at current scroll position, container height and item sizes. And returns only the items that should be visible right now.

  // Throttling
  const handleScroll = useThrottle((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const totalScroll = scrollHeight - clientHeight;
    const percentage = (scrollTop / totalScroll) * 100;
    setScrollProgress(percentage);
  }, 50); // Only updates 20 times per second, saving CPU!

  //Infinite Scroll
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (lastItem.index >= articles.length - 1 && hasMore && !isFetching) {
      fetchNextPage();
    }
  }, [articles, hasMore, isFetching, fetchNextPage, virtualItems]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      {/* The Throttled Progress Bar */}
      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="h-[800px] overflow-auto border border-zinc-800 rounded-xl bg-zinc-950/50 p-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.2) transparent",
        }}
      >
        {/* Giant invisible div */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, // Say you have 1000 articles: getTotalSize() = 1000 × 200px = 200,000px tall - making the scrollbar look like all 1000 cards exist. But the actual cards inside? Only ~15 are real.
            width: "100%",
            position: "relative", //position: relative is required because every card inside uses position: absolute
          }}
        >
          {virtualItems.map((virtualRow) => {
            //getVirtualItems() only returns the items currently visible + overscan
            const article = articles[virtualRow.index];

            if (!article) return null;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index} // TanStack needs this to know which item it just measured. Without it, measurement is ignored.
                ref={rowVirtualizer.measureElement} //  This is a callback ref. Every time a card mounts in the DOM, TanStack calls `measureElement(el)` with that real DOM node, measures its actual height, and corrects the scroll calculations. Without estimateSize — virtualizer has no idea how tall the scroll area should be initial. Without measureElement — cards with different heights (some with images, some without) will overlap or have gaps.
                className="absolute top-0 left-0 w-full p-2"
                style={{
                  transform: `translateY(${virtualRow.start}px)`, //Every card is `absolute top-0` — they all start at the top of the relative container. The `translateY` then pushes each one to its correct position:
                }}
              >
                <NewsCard article={article} />
              </div>
            );
          })}
        </div>
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
