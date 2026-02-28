"use client";

export default function SkeletonCard() {
  return (
    <div className="glass flex flex-col gap-4 rounded-2xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-4 w-16" />
      </div>

      {/* Content lines */}
      <div className="flex flex-col gap-2.5">
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-[90%]" />
        <div className="skeleton h-3.5 w-[75%]" />
        <div className="skeleton h-3.5 w-[85%]" />
        <div className="skeleton h-3.5 w-[60%]" />
      </div>
    </div>
  );
}
