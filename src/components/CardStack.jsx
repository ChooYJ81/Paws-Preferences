import React, { useMemo } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

// Tune these to taste
const SWIPE_THRESHOLD_PX = 80;
const MAX_VISIBLE = 3;

export default function CardStack({ cats, currentIndex, onLike, onDislike }) {
  const visible = useMemo(() => {
    // top card is cats[currentIndex]
    return cats.slice(currentIndex, currentIndex + MAX_VISIBLE);
  }, [cats, currentIndex]);

  if (visible.length === 0) return null;

  return (
    <div className="relative h-[520px] w-full">
      {/* Render from bottom to top so the first is behind */}
        {visible
        .map((cat, i) => ({cat, i}))
        .reverse()
        .map(({ cat, i }) => {
          const isTop = i === 0; // after reverse, last drawn is top
          return (
            <Card
              key={cat.id}
              cat={cat}
              isTop={isTop}
              onLike={onLike}
              onDislike={onDislike}
            />
          );
        })}
    </div>
  );
}

function Card({ cat, isTop, onLike, onDislike }) {
  // only the top card is draggable
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-12, 12]);
  const likeOpacity = useTransform(x, [0, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, 0], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, touchAction: "none" }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      whileTap={isTop ? { cursor: "grabbing" } : undefined}
      onDragEnd={() => {
        const v = x.get();
        if (v > SWIPE_THRESHOLD_PX) {
          onLike();
        } else if (v < -SWIPE_THRESHOLD_PX) {
          onDislike();
        }
        x.set(0);
      }}
    >
      <div className="h-full w-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-lg">
        <div className="relative h-full w-full">
          {/* image */}
          <img
            src={cat.url}
            alt="A cat"
            className="h-full w-full object-cover"
            loading="eager"
            draggable={false}
          />

          {/* overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />

          <motion.div
            className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-500/30"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>

          <motion.div
            className="pointer-events-none absolute right-4 top-4 rounded-2xl bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-100 ring-1 ring-rose-500/30"
            style={{ opacity: nopeOpacity }}
          >
            NOPE
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/10">
                Swipe me
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1 ring-1 ring-white/10">
                Cataas
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
