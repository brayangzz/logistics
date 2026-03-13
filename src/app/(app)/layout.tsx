import { Sidebar } from "@/components/layout";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A] selection:bg-[#155DFC]/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-0 scroll-smooth">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(21,93,252,0.15),rgba(255,255,255,0))] pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
