export default function SectionHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-6 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyanGlow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black text-white sm:text-5xl">{title}</h1>
      {children && <p className="mt-3 text-base leading-7 text-slate-300">{children}</p>}
    </div>
  );
}
