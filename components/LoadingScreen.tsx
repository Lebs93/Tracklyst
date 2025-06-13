import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <img src="/logo-icon.svg" alt="Tracklyst" className="w-24 h-24 mb-6" />
      <div className="w-2/3 max-w-xs h-2 rounded-full bg-neutral-light overflow-hidden">
        <div className="loading-bar h-full bg-primary" />
      </div>
      <p className="mt-4 text-sm text-neutral-dark">Loading Tracklyst…</p>
    </div>
  );
}
