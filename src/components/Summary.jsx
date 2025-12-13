import React from "react";

export default function Summary({ total, liked, dislikedCount, onRestart }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
      <h2 className="text-xl font-semibold">All done 🎉</h2>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Total" value={total} />
        <Stat label="Liked" value={liked.length} />
        <Stat label="Disliked" value={dislikedCount} />
        <Stat
          label="Like rate"
          value={total ? `${Math.round((liked.length / total) * 100)}%` : "0%"}
        />
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium text-white/85">Your liked cats</h3>

        {liked.length === 0 ? (
          <p className="mt-2 text-sm text-white/60">
            You didn’t like any cats this round. Tough crowd 😼
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {liked.map((cat) => (
              <div
                key={cat.id}
                className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
              >
                <img src={cat.url} alt="Liked cat" className="h-40 w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="mt-6 w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-medium ring-1 ring-white/15 active:scale-[0.99]"
      >
        Restart
      </button>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
