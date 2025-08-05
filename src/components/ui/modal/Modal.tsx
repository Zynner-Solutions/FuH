"use client";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === "modal-bg") onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      id="modal-bg"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl shadow-2xl border border-violet-200/50 p-8 max-w-lg w-full mx-4 relative animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/20 to-purple-100/20 rounded-3xl" />
        <div className="relative z-10">{children}</div>
      </div>
    </div>,
    document.body
  );
}
