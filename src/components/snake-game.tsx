import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { searchArtworks, getImageUrl, type Artwork } from "@/lib/api";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
  Trophy,
} from "lucide-react";

const COLS = 20;
const ROWS = 20;
const START_SPEED_MS = 170;
const MIN_SPEED_MS = 70;
const SPEED_STEP_MS = 4;
const PAGE_SIZE = 24;
const QUEUE_LOW_WATERMARK = 8;
const BEST_KEY = "art-explorer:snake-best";
const THEMES = ["cats", "dogs", "flowers", "landscapes", "birds", "portraits"];

type Vec = { x: number; y: number };
type Status = "loading" | "ready" | "playing" | "paused" | "over" | "error";

const sameCell = (a: Vec, b: Vec) => a.x === b.x && a.y === b.y;

function randomFreeCell(snake: Vec[]): Vec | null {
  const occupied = new Set(snake.map((s) => s.y * COLS + s.x));
  const free: number[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    if (!occupied.has(i)) free.push(i);
  }
  if (free.length === 0) return null;
  const pick = free[Math.floor(Math.random() * free.length)];
  return { x: pick % COLS, y: Math.floor(pick / COLS) };
}

function preloadImages(artworks: Artwork[]) {
  for (const artwork of artworks) {
    if (artwork.image_id) {
      const img = new Image();
      img.src = getImageUrl(artwork.image_id, 200);
    }
  }
}

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Vec[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Vec | null>(null);
  const [queue, setQueue] = useState<Artwork[]>([]);
  const [theme, setTheme] = useState<string>("");
  const [status, setStatus] = useState<Status>("loading");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(readBest);
  const [attempt, setAttempt] = useState(0);

  const dirRef = useRef<Vec>({ x: 1, y: 0 });
  const pendingRef = useRef<Vec[]>([]);
  const queueRef = useRef<Artwork[]>([]);
  const themeRef = useRef<string>("");
  const pageRef = useRef(2);
  const totalPagesRef = useRef(Number.MAX_SAFE_INTEGER);
  const fetchingRef = useRef(false);
  const stepRef = useRef(() => {});

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const fetchMore = useCallback(async () => {
    if (fetchingRef.current) return;
    if (pageRef.current > totalPagesRef.current) return;
    fetchingRef.current = true;
    try {
      const res = await searchArtworks(
        themeRef.current,
        pageRef.current,
        PAGE_SIZE
      );
      totalPagesRef.current = res.pagination.total_pages;
      pageRef.current += 1;
      const knownIds = new Set(queueRef.current.map((a) => a.id));
      const fresh = res.data.filter(
        (a) => a.image_id !== null && !knownIds.has(a.id)
      );
      if (fresh.length > 0) {
        const grown = [...queueRef.current, ...fresh];
        queueRef.current = grown;
        setQueue(grown);
        preloadImages(fresh.slice(0, 12));
      }
    } catch {
      // Keep playing with the artworks already loaded
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // Initial load: pick a theme, fetch two pages of artworks with images
  useEffect(() => {
    let cancelled = false;
    pageRef.current = 2;
    totalPagesRef.current = Number.MAX_SAFE_INTEGER;
    fetchingRef.current = false;
    (async () => {
      const picked = THEMES[Math.floor(Math.random() * THEMES.length)];
      setTheme(picked);
      themeRef.current = picked;
      const [first, second] = await Promise.all([
        searchArtworks(picked, 1, PAGE_SIZE),
        searchArtworks(picked, 2, PAGE_SIZE),
      ]);
      if (cancelled) return;
      totalPagesRef.current = first.pagination.total_pages;
      pageRef.current = 3;
      const seen = new Set<number>();
      const artworks: Artwork[] = [];
      for (const artwork of [...first.data, ...second.data]) {
        if (artwork.image_id !== null && !seen.has(artwork.id)) {
          seen.add(artwork.id);
          artworks.push(artwork);
        }
      }
      if (artworks.length < 2) {
        setStatus("error");
        return;
      }
      queueRef.current = artworks;
      setQueue(artworks);
      preloadImages(artworks.slice(0, 12));
      const start = [{ x: 10, y: 10 }];
      setSnake(start);
      setFood(randomFreeCell(start));
      dirRef.current = { x: 1, y: 0 };
      pendingRef.current = [];
      setScore(0);
      setStatus("ready");
    })().catch(() => {
      if (!cancelled) setStatus("error");
    });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const gameOver = useCallback(() => {
    setStatus("over");
    setScore((current) => {
      setBest((prevBest) => {
        const nextBest = Math.max(prevBest, current);
        try {
          localStorage.setItem(BEST_KEY, String(nextBest));
        } catch {
          // ignore persistence failures
        }
        return nextBest;
      });
      return current;
    });
  }, []);

  const startGame = useCallback(() => {
    if (queueRef.current.length < 2) return;
    const start = [{ x: 10, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    pendingRef.current = [];
    setSnake(start);
    setFood(randomFreeCell(start));
    setScore(0);
    setStatus("playing");
  }, []);

  const togglePause = useCallback(() => {
    setStatus((s) => (s === "playing" ? "paused" : s === "paused" ? "playing" : s));
  }, []);

  const queueDirection = useCallback((dir: Vec) => {
    const last = pendingRef.current[pendingRef.current.length - 1] ?? dirRef.current;
    if (dir.x === -last.x && dir.y === -last.y) return;
    if (dir.x === last.x && dir.y === last.y) return;
    if (pendingRef.current.length < 3) pendingRef.current.push(dir);
  }, []);

  const step = () => {
    const pending = pendingRef.current;
    if (pending.length > 0) {
      const next = pending.shift()!;
      const current = dirRef.current;
      if (!(next.x === -current.x && next.y === -current.y)) {
        dirRef.current = next;
      }
    }
    const dir = dirRef.current;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
      gameOver();
      return;
    }
    const eating = food !== null && sameCell(head, food);
    const body = eating ? snake : snake.slice(0, -1);
    if (body.some((segment) => sameCell(segment, head))) {
      gameOver();
      return;
    }
    if (eating) {
      const grown = [head, ...snake];
      const nextFood = randomFreeCell(grown);
      setSnake(grown);
      if (nextFood === null) {
        // Board completely filled — legendary run
        gameOver();
        return;
      }
      setFood(nextFood);
      setScore((s) => s + 1);
      if (queueRef.current.length - grown.length < QUEUE_LOW_WATERMARK) {
        void fetchMore();
      }
    } else {
      setSnake([head, ...snake.slice(0, -1)]);
    }
  };
  stepRef.current = step;

  const speed = Math.max(MIN_SPEED_MS, START_SPEED_MS - score * SPEED_STEP_MS);

  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => stepRef.current(), speed);
    return () => window.clearInterval(id);
  }, [status, speed]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const directions: Record<string, Vec> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
        W: { x: 0, y: -1 },
        S: { x: 0, y: 1 },
        A: { x: -1, y: 0 },
        D: { x: 1, y: 0 },
      };
      const dir = directions[e.key];
      if (dir) {
        e.preventDefault();
        queueDirection(dir);
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        if (status === "playing" || status === "paused") togglePause();
        else if (status === "ready" || status === "over") startGame();
      } else if (e.key === "Enter") {
        if (status === "ready" || status === "over") startGame();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, queueDirection, togglePause, startGame]);

  // The food shows the next artwork — eating it appends that image to the tail
  const foodArtwork =
    queue.length > 0 ? queue[snake.length % queue.length] : undefined;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center">
      <div className="mb-4 flex w-full items-center justify-between gap-2">
        <div className="flex gap-4 text-sm">
          <p>
            Score: <span className="font-semibold">{score}</span>
          </p>
          <p className="flex items-center gap-1 text-muted-foreground">
            <Trophy className="h-4 w-4" />
            Best: <span className="font-semibold">{best}</span>
          </p>
        </div>
        {theme && (
          <p className="text-sm text-muted-foreground">
            Today&apos;s snake is made of {theme}
          </p>
        )}
      </div>

      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(0 0 0 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.06) 1px, transparent 1px)",
          backgroundSize: `${100 / COLS}% ${100 / ROWS}%`,
        }}
      >
        {food && foodArtwork?.image_id && (
          <div
            className="absolute p-[1px]"
            style={{
              left: `${(food.x * 100) / COLS}%`,
              top: `${(food.y * 100) / ROWS}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
            }}
          >
            <img
              src={getImageUrl(foodArtwork.image_id, 200)}
              alt={`Next: ${foodArtwork.title}`}
              title={foodArtwork.title}
              className="h-full w-full animate-pulse rounded object-cover ring-2 ring-yellow-300"
            />
          </div>
        )}

        {snake.map((segment, i) => {
          const artwork = queue.length > 0 ? queue[i % queue.length] : undefined;
          return (
            <div
              key={`${segment.x}-${segment.y}-${i}`}
              className="absolute p-[1px]"
              style={{
                left: `${(segment.x * 100) / COLS}%`,
                top: `${(segment.y * 100) / ROWS}%`,
                width: `${100 / COLS}%`,
                height: `${100 / ROWS}%`,
              }}
            >
              {artwork?.image_id ? (
                <img
                  src={getImageUrl(artwork.image_id, 200)}
                  alt={i === 0 ? `Head: ${artwork.title}` : artwork.title}
                  className={`h-full w-full object-cover ${
                    i === 0
                      ? "rounded ring-2 ring-white/80"
                      : "rounded-[4px]"
                  }`}
                />
              ) : (
                <div className="h-full w-full rounded-[4px] bg-emerald-500" />
              )}
            </div>
          );
        })}

        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 p-6 text-center backdrop-blur-sm">
            {status === "loading" && (
              <p className="text-lg text-white">Loading artworks…</p>
            )}
            {status === "error" && (
              <>
                <p className="text-lg font-semibold text-white">
                  Could not load artworks
                </p>
                <p className="text-sm text-white/70">
                  Check your connection and try again.
                </p>
                <Button onClick={() => setAttempt((n) => n + 1)}>
                  <RotateCcw /> Retry
                </Button>
              </>
            )}
            {status === "ready" && (
              <>
                <p className="text-2xl font-bold text-white">🎨🐍 Art Snake</p>
                <p className="max-w-xs text-sm text-white/80">
                  Eat the glowing artwork to grow your snake by one image.
                  Don&apos;t hit the walls or yourself!
                </p>
                <Button onClick={startGame}>
                  <Play /> Start
                </Button>
                <p className="hidden text-xs text-white/60 md:block">
                  Arrows / WASD to steer · Space to pause
                </p>
              </>
            )}
            {status === "paused" && (
              <>
                <p className="text-xl font-semibold text-white">Paused</p>
                <Button onClick={togglePause}>
                  <Play /> Resume
                </Button>
              </>
            )}
            {status === "over" && (
              <>
                <p className="text-2xl font-bold text-white">Game over</p>
                <p className="text-sm text-white/80">
                  Score {score} · Length {score + 1}
                  {score > 0 && score >= best ? " — new best! 🏆" : ""}
                </p>
                <Button onClick={startGame}>
                  <RotateCcw /> Play again
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {status === "playing" ? (
          <Button variant="outline" size="sm" onClick={togglePause}>
            <Pause /> Pause
          </Button>
        ) : (
          (status === "paused" || status === "over") && (
            <Button variant="outline" size="sm" onClick={togglePause}>
              <Play /> Resume
            </Button>
          )
        )}
        {(status === "playing" || status === "paused" || status === "over") && (
          <Button variant="outline" size="sm" onClick={startGame}>
            <RotateCcw /> Restart
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1 md:hidden">
        <div />
        <Button
          variant="outline"
          size="icon"
          aria-label="Move up"
          onClick={() => queueDirection({ x: 0, y: -1 })}
        >
          <ArrowUp />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          aria-label="Move left"
          onClick={() => queueDirection({ x: -1, y: 0 })}
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Move down"
          onClick={() => queueDirection({ x: 0, y: 1 })}
        >
          <ArrowDown />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Move right"
          onClick={() => queueDirection({ x: 1, y: 0 })}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
