import React, { useState, useEffect } from "react";
import CardStack from "./components/CardStack.jsx";
import Summary from "./components/Summary.jsx";
import Loader from "./components/Loader.jsx";
import './App.css'

const CAT_COUNT = 15;

async function fetchCats(count, signal) {
  const seen = new Set();
  const cats = [];

  while (cats.length < count) {
    const res = await fetch("https://cataas.com/cat?json=true", {
      signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch cat");

    const data = await res.json();
    if (seen.has(data.id)) continue;

    seen.add(data.id);
    cats.push({
      id: data.id,
      url: data.url,
    });
  }

  return cats;
}


export default function App() {

  const [cats, setCats] = useState([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [dislikedCount, setDislikedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const list = await fetchCats(CAT_COUNT, ac.signal);
        setCats(list);
        setIndex(0);
        setLiked([]);
        setDislikedCount(0);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const done = cats.length > 0 && index >= cats.length;

  if (cats.length === 0 || loading) {
    return (
      <div className="min-h-screen grid place-items-center text-white">
        <div>
          <p className="mb-6 text-2xl text-center">Loading cats</p>
          <Loader />
        </div>
      </div>
    )
  }

  function handleVote(direction) {
    const current = cats[index];
    if (!current) return;

    if (direction === "like") setLiked((prev) => [...prev, current]);
    else setDislikedCount((c) => c + 1);

    setIndex((i) => i + 1);
  }

  async function reset() {
    const ac = new AbortController();
    setLoading(true);
    try {
      const newCats = await fetchCats(CAT_COUNT, ac.signal);
      setCats(newCats);
      setIndex(0);
      setLiked([]);
      setDislikedCount(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-md px-4 pt-6 pb-10">
        <header className="mb-5">
          <p className="text-4xl font-semibold tracking-tight text-center">Paws & Preferences</p>
          <p className="mt-1 text-sm text-white/70 text-center">
            Swipe right to <span className="text-emerald-300">like</span>, left to{" "}
            <span className="text-rose-300">dislike</span>.
          </p>

          {!done && (
            <div className="mt-3 flex items-center justify-between text-xs text-white/70">
              <span>
                Card <span className="text-white">{index + 1}</span> / {cats.length}
              </span>
              <span>
                Liked: <span className="text-white">{liked.length}</span>
              </span>
            </div>
          )}
        </header>

        <main>
          {!done ? (
            <>
              <CardStack
                cats={cats}
                currentIndex={index}
                onLike={() => handleVote("like")}
                onDislike={() => handleVote("dislike")}
              />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  className="rounded-xl bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-200 ring-1 ring-rose-500/30 active:scale-[0.99]"
                  onClick={() => handleVote("dislike")}
                >
                  Dislike
                </button>
                <button
                  className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200 ring-1 ring-emerald-500/30 active:scale-[0.99]"
                  onClick={() => handleVote("like")}
                >
                  Like
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-white/50">
                Tip: Try dragging a card—release past the threshold to vote.
              </p>
            </>
          ) : (
            <Summary
              total={cats.length}
              liked={liked}
              dislikedCount={dislikedCount}
              onRestart={reset}
            />
          )}
        </main>
      </div>
    </div>
  );
}
