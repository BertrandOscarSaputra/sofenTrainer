"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Star, X } from "lucide-react";
import Button from "./ui/Button";

interface RatingModalProps {
  trainerName: string;
  mode?: "create" | "edit";
  initialRating?: number;
  initialComment?: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const ratingLabels = [
  "Sangat kurang",
  "Kurang",
  "Cukup",
  "Bagus",
  "Sangat bagus",
];

export default function RatingModal({
  trainerName,
  mode = "create",
  initialRating = 0,
  initialComment = "",
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(rating, comment);
      onClose();
    } catch (error) {
      console.error("Failed to submit rating:", error);
      setSubmitError("Ulasan gagal dikirim. Coba lagi sebentar lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hover || rating;
  const ratingLabel =
    activeRating > 0 ? ratingLabels[activeRating - 1] : "Pilih rating Anda";
  const title = mode === "edit" ? "Ubah ulasan" : "Berikan rating";
  const submitLabel = mode === "edit" ? "Simpan perubahan" : "Kirim ulasan";

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-xl my-auto overflow-hidden rounded-[28px] border border-white/10 bg-[#09101F] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-indigo-500/25 via-cyan-500/10 to-fuchsia-500/20" />
        <div className="relative px-6 pt-6 pb-6 sm:px-8 sm:pt-8">
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300/80">
                {mode === "edit" ? "Ubah rating" : "Berikan rating"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Nilai pengalaman Anda bersama{" "}
                <span className="font-semibold text-cyan-300">
                  {trainerName}
                </span>{" "}
                supaya kami bisa menjaga kualitas sesi berikutnya.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal rating"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0D1426] px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-200">
                  Pilih rating
                </p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-300">
                  {ratingLabel}
                </span>
              </div>

              <div className="mt-4 flex justify-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Beri rating ${star} bintang`}
                    aria-pressed={rating === star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="rounded-full p-1.5 transition-transform duration-200 hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={36}
                      className={`transition-all duration-200 ${
                        star <= activeRating
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.35)]"
                          : "text-white/25"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                {rating > 0
                  ? "Terima kasih, pilihan Anda sudah tersimpan di formulir ini."
                  : "Klik salah satu bintang untuk memulai."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between gap-3">
                <label className="text-sm font-semibold text-gray-200">
                  Catatan tambahan
                </label>
                <span className="text-xs text-gray-500">Opsional</span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Apa yang paling berkesan dari sesi ini?"
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition-colors focus:border-cyan-500/50 focus:bg-white/[0.07]"
              />
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={onClose}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={rating === 0 || isSubmitting}
                isLoading={isSubmitting}
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
