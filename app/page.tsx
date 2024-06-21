"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(false);

  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    let id: number;
    const handler = () => {
      setCurrentDateTime(new Date());

      id = requestAnimationFrame(handler);
    };

    id = requestAnimationFrame(handler);

    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoggedOut(true);
    }, 1000 * 60 * 60);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center gap-4">
      {loggedOut && (
        <div className="p-4 bg-red-100 text-red-500 rounded-lg">
          1時間経過したため、ログアウトしました！！
        </div>
      )}

      <h1 className="text-4xl font-bold">
        1秒ごとにカウント: <span data-testid="count">{count}</span>
      </h1>
      <button
        onClick={() => setEnabled((prev) => !prev)}
        className="px-4 py-2 bg-blue-500 text-white rounded-full"
      >
        {enabled ? "カウント終了" : "カウント開始"}
      </button>

      <div>
        <small className="text-sm text-gray-500" data-testid="currentDateTime">
          {currentDateTime.toLocaleString("ja-JP")}
        </small>
      </div>
    </main>
  );
}
