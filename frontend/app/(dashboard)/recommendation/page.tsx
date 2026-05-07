"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Brain,
  RefreshCw,
  CalendarX,
  Send,
  Bot,
  User,
} from "lucide-react";
import Button from "@/components/ui/Button";
import RecommendationCard from "@/components/RecommendationCard";
import { SkeletonCard } from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import {
  getRecommendations,
  sendChatMessage,
} from "@/lib/recommendationService";
import type {
  RecommendationItem,
  RecommendationResponse,
  ChatMessage,
} from "@/lib/types";
import { getErrorMessage } from "@/lib/api";

export default function RecommendationPage() {
  const router = useRouter();
  const { user } = useAuth();

  // ─── Recommendation State ──────────────────────────────────
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Chat State ───────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatError, setChatError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ─── Fetch Recommendations ────────────────────────────────
  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await getRecommendations(user?.id || 1);
      setData(res);
    } catch (err: unknown) {
      setError(
        getErrorMessage(err, "Gagal memuat rekomendasi. Silakan coba lagi."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll chat ke bawah saat ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ─── Book Handler ─────────────────────────────────────────
  const handleBook = (rec: RecommendationItem) => {
    const params = new URLSearchParams({
      scheduleDay: rec.day,
      scheduleTime: rec.startTime,
    });
    router.push(`/booking?${params.toString()}`);
  };

  // ─── Chat Handler (POST /api/recommendations/chat) ────────
  const handleSendChat = async () => {
    const message = chatInput.trim();
    if (!message || isSendingChat) return;

    // Tambah pesan user ke list
    const userMsg: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsSendingChat(true);
    setChatError("");

    try {
      const res = await sendChatMessage({
        userId: user?.id || 1,
        message,
        currentSchedule: data?.recommendations || [],
      });

      // Tambah balasan AI ke list
      const aiMsg: ChatMessage = {
        role: "ai",
        content: res.aiMessage,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);

      // Update jadwal rekomendasi dengan jadwal yang diperbarui AI
      if (res.updatedSchedule && res.updatedSchedule.length > 0) {
        setData({ recommendations: res.updatedSchedule });
      }
    } catch (err: unknown) {
      setChatError(
        getErrorMessage(err, "Gagal mengirim pesan. Silakan coba lagi."),
      );
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Rekomendasi AI
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Jadwal latihan yang dipersonalisasi berdasarkan kebiasaanmu
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchRecommendations}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* ─── AI Info Banner ─── */}
      <Card className="mb-8 flex items-start gap-4 border-indigo-500/15 bg-indigo-500/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Traino AI</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            AI menganalisis riwayat latihanmu untuk memberikan rekomendasi jadwal optimal
            dan menjawab berbagai pertanyaan tentang training, nutrisi, recovery, dan motivasi.
            Semakin banyak sesi yang kamu selesaikan, semakin personal saran yang diberikan.
          </p>
        </div>
      </Card>

      {/* ─── Loading State ─── */}
      {isLoading && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={18} className="text-indigo-400 animate-pulse" />
            <span className="text-sm text-indigo-300 animate-pulse">
              AI sedang menganalisis kebiasaan latihanmu...
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

      {/* ─── Error State ─── */}
      {!isLoading && error && (
        <Card className="text-center py-10">
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchRecommendations}>
            Coba Lagi
          </Button>
        </Card>
      )}

      {/* ─── Empty State ─── */}
      {!isLoading && !error && data && data.recommendations.length === 0 && (
        <Card className="text-center py-16">
          <CalendarX size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Belum Ada Data
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            Lakukan beberapa booking dan selesaikan sesi latihanmu terlebih
            dahulu agar AI bisa mempelajari kebiasaanmu dan memberikan
            rekomendasi yang akurat.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push("/booking")}
          >
            Buat Booking Pertama
          </Button>
        </Card>
      )}

      {/* ─── Recommendations Grid ─── */}
      {!isLoading && !error && data && data.recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {data.recommendations.map((rec, i) => (
            <div
              key={i}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <RecommendationCard
                recommendation={rec}
                onBook={handleBook}
                index={i}
              />
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          ─── AI Chat — Sesuaikan Jadwal via Chat ───
          POST /api/recommendations/chat
      ═══════════════════════════════════════════════════════ */}
      {!isLoading && !error && data && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Chat AI
              </h2>
              <p className="text-xs text-gray-500">
                Ketik pertayaanmu dan AI akan menjawab
              </p>
            </div>
          </div>

          <Card className="border-indigo-500/10">
            {/* Contoh pertanyaan */}
            {chatMessages.length === 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-3">
                  Contoh yang bisa kamu tanyakan:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Pindahkan jadwal Senin ke Selasa sore",
                    "Ganti Kardio dengan Yoga",
                    "Tambahkan sesi di hari Kamis",
                    "Bagaimana cara meningkatkan kekuatan upper body?",
                    "Apa yang harus dimakan sebelum latihan?",
                    "Cara mengatasi plateau dalam latihan?",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setChatInput(example)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-indigo-300 hover:border-indigo-500/30 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Daftar pesan chat */}
            {chatMessages.length > 0 && (
              <div className="space-y-4 mb-4 max-h-72 overflow-y-auto pr-1">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === "ai"
                          ? "bg-gradient-to-br from-indigo-500 to-cyan-500"
                          : "bg-white/10"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <Bot size={14} className="text-white" />
                      ) : (
                        <User size={14} className="text-gray-300" />
                      )}
                    </div>
                    {/* Bubble */}
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-500/20 text-white border border-indigo-500/20 rounded-tr-sm"
                          : "bg-white/5 text-gray-200 border border-white/8 rounded-tl-sm"
                      }`}
                    >
                      {msg.role === "ai" ? (
                        <div 
                          className="prose prose-invert prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: msg.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold text-white mb-2">$1</h1>')
                              .replace(/^## (.*$)/gm, '<h2 class="text-base font-semibold text-white mb-2">$1</h2>')
                              .replace(/^### (.*$)/gm, '<h3 class="text-sm font-medium text-indigo-400 mb-1">$1</h3>')
                              .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
                              .replace(/^• (.*$)/gm, '<li class="ml-4">• $1</li>')
                              .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
                              .replace(/\n\n/g, '<br/><br/>')
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator saat AI memproses */}
                {isSendingChat && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/8">
                      <div className="flex gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* Error chat */}
            {chatError && (
              <p className="text-xs text-red-400 mb-3">⚠️ {chatError}</p>
            )}

            {/* Input area */}
            <div className="flex gap-3 items-end">
              <textarea
                id="chat-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="Tanya tentang jadwal, latihan, nutrisi, atau recovery..."
                rows={2}
                disabled={isSendingChat}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-sm resize-none disabled:opacity-50"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleSendChat}
                isLoading={isSendingChat}
                disabled={!chatInput.trim() || isSendingChat}
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Enter untuk kirim • Shift+Enter untuk baris baru
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
