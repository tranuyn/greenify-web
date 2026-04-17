import { STATS } from "@/services/mock/home.mock";

export function Stats() {
  return (
    <section id="stats" className="bg-primary-950/90 dark:bg-primary-100/90 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-bold text-5xl text-primary-400 dark:text-primary-700 md:text-6xl">
              {s.value}
            </div>
            <div className="mt-2 font-body text-sm text-primary-200/60 dark:text-primary-700/60">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
