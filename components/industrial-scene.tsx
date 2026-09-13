'use client';
import { useEffect, useRef, useState } from 'react';
import type { SceneControl, SceneKind } from '@/lib/industrial-scenes';

export default function IndustrialScene({ kind, paused, replay = 0, progress = null, onStage, fallback, label }: { kind: SceneKind; paused: boolean; replay?: number; progress?: number | null; onStage?: (n: number) => void; fallback: string; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef<SceneControl>({ paused, replay, progress });
  const callback = useRef(onStage);
  const [ready, setReady] = useState(false);
  useEffect(() => { state.current = { paused, replay, progress }; callback.current = onStage; }, [paused, replay, progress, onStage]);
  useEffect(() => {
    const el = host.current; if (!el) return;
    let disposed = false, cleanup: (() => void) | undefined, started = false;
    const unavailable = () => { setReady(false); cleanup?.(); cleanup = undefined; };
    el.addEventListener('scene-unavailable', unavailable);
    const observer = new IntersectionObserver(async entries => {
      if (!entries[0].isIntersecting || started) return; started = true; observer.disconnect();
      try {
        const { createIndustrialScene } = await import('@/lib/industrial-scenes');
        if (disposed) return;
        cleanup = createIndustrialScene(el, kind, () => state.current, n => callback.current?.(n));
        setReady(true);
      } catch { if (!disposed) setReady(false); }
    }, { rootMargin: '240px' });
    observer.observe(el);
    return () => { disposed = true; observer.disconnect(); cleanup?.(); el.removeEventListener('scene-unavailable', unavailable); };
  }, [kind]);
  return <div className={'industrial-scene ' + (ready ? 'scene-ready' : '')} role="img" aria-label={label}>
    <img className="scene-fallback" src={fallback} alt="" loading={kind === 'demolition' ? 'eager' : 'lazy'} />
    <div className="scene-canvas" ref={host} aria-hidden="true" />
  </div>;
}
