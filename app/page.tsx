'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from 'app/projects/data';

/** Subtle reveal on scroll */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setShown(true), obs.disconnect())),
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        'transform-gpu transition-all duration-500 ease-out will-change-[opacity,transform]',
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export default function Page() {
  const [displayText, setDisplayText] = useState('');
  const message = "Hey, I'm Nikki, what's up?";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplayText(message.slice(0, i + 1));
      i++;
      if (i === message.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-violet-100">
      {/* Full-screen animated aurora, behind everything */}
      <div className="aurora">
        <div className="aurora-wrap">
          <div className="aurora-band aurora-1" />
          <div className="aurora-band aurora-2" />
          <div className="aurora-band aurora-3" />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-4 py-12">
        {/* Soft container that blends into bg */}
        <section className="glass glass-ring p-6">
          {/* Typing headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]">
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>

          {/* Intro */}
          <header className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">My Portfolio</h2>
            <p className="mt-3 max-w-2xl text-violet-200/85">
              I'm Nikki Rana, born and raised in Cambridge, now studying Systems
              Design Engineering at the University of Waterloo. I focus on human
              factors—the intersection of product, design, and how people actually
              experience tech. I like the tiny details that make things easier and
              the bigger picture of how design shapes lives.
            </p>
            <p className="mt-3 max-w-2xl text-violet-200/85">
              Outside of school I've organized coding competitions, mentored across
              programs, joined panels, and when I'm not doing something vaguely
              productive, I'm probably annoying my older siblings or cooking.
            </p>
          </header>

          {/* Projects */}
          <section className="mt-4">
            <h3 className="mb-4 text-lg font-medium text-violet-200/90">Projects</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((p, idx) => (
                <Reveal key={p.slug} delay={idx * 80}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group block rounded-2xl p-5 card ring-1 ring-white/10 backdrop-blur-[2px] transition-all hover:ring-white/20 hover:brightness-110"
                  >
                    {/* Cover image or placeholder */}
                    <div className="relative mb-4 overflow-hidden rounded-xl bg-neutral-900/60 ring-1 ring-white/10">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          width={600}
                          height={192}
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center text-sm text-neutral-500">
                          (Project image here)
                        </div>
                      )}
                    </div>

                    <h4 className="text-xl font-semibold tracking-tight text-violet-100">
                      {p.title}
                    </h4>

                    {p.subtitle && (
                      <p className="mt-1 text-sm text-violet-300/85">{p.subtitle}</p>
                    )}

                    {p.shortDescription && (
                      <p className="mt-3 text-sm leading-relaxed text-violet-100/80">
                        {p.shortDescription}
                      </p>
                    )}

                    <span className="mt-4 inline-block text-xs text-violet-400/60 transition-colors group-hover:text-violet-300/80">
                      View project →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
