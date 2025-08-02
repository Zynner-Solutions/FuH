import { ReactNode } from "react";

interface BackgroundProps {
  children?: ReactNode;
  className?: string;
}

export default function Background({
  children,
  className = "",
}: BackgroundProps) {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      <div className="fixed inset-0 bg-gradient-to-br from-[#f7f3ff] via-[#f1e9fe] to-[#e5d6fe] opacity-95" />

      <div className="fixed -top-20 -left-20 h-96 w-96 rounded-full bg-[#b48bfa] opacity-30 blur-[80px]" />
      <div className="fixed top-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-[#955cf6] opacity-30 blur-[100px]" />
      <div className="fixed -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-[#7c3aed] opacity-20 blur-[100px]" />

      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSgxMjQsIDU4LCAyMzcsIDAuMikiLz48L3N2Zz4=')] opacity-50" />

      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMCBMNjAgNjAgTTYwIDAgTDAgNjAgTTMwIDAgTDMwIDYwIE0wIDMwIEw2MCAzMCIgc3Ryb2tlPSJyZ2JhKDEyNCwgNTgsIDIzNywgMC4xKSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-40" />

      <div className="fixed inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
