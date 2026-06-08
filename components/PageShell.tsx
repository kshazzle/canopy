import { Navbar } from "./Navbar";

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageShell({ children, title, subtitle }: PageShellProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        {title && (
          <header className="mb-10">
            <h1 className="font-display text-4xl tracking-tight md:text-6xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-lg text-white/70">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}
