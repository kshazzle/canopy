export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-dvh max-h-dvh overflow-hidden">{children}</div>;
}
