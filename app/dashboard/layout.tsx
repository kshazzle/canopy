import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0705] text-[#f5ede0]/70">
          Gathering what we noticed…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
