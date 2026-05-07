import React from "react";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060A14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Dumbbell size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Trai<span className="text-indigo-400">no</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Platform booking latihan pribadi dengan rekomendasi jadwal
              berbasis AI. Temukan trainer terbaik untuk perjalanan fitnessmu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Menu
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <a
                  href="#trainers"
                  className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
                >
                  Trainer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Traino
          </p>
        </div>
      </div>
    </footer>
  );
}
