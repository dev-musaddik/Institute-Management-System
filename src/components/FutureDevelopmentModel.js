import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FutureDevelopmentModal({ open, setOpen }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full mx-4 p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left: Text */}
              <section className="space-y-6">
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
                >
                  Future Development
                  <span className="text-indigo-600">
                    {" "}
                    — Developer on break 😴
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg text-gray-700"
                >
                  This feature is taking a short nap while the developer
                  recharges. Good ideas need rest too — and coffee. ☕️
                </motion.p>

                <div className="flex flex-wrap gap-3">
                  <button
                    disabled
                    className="px-5 py-2 rounded-full bg-indigo-600/90 text-white font-medium shadow disabled:opacity-60"
                  >
                    Coming Soon
                  </button>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="px-5 py-2 rounded-full border border-gray-200 text-gray-800 font-medium hover:bg-gray-50"
                  >
                    Bookmark
                  </a>
                  <a
                    href="mailto:devs@yourcompany.com"
                    className="ml-auto sm:ml-0 px-5 py-2 rounded-full bg-white border border-indigo-200 text-indigo-600 font-medium shadow-sm hover:underline"
                  >
                    Message Team
                  </a>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Tip: If you hear snoring, it probably means progress is being
                  dreamed up. ✨
                </p>
              </section>

              {/* Right: Illustration */}
              <section className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full max-w-md"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-inner border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-36 h-36 flex items-center justify-center">
                        {/* Sleepy Developer SVG */}
                        <svg
                          viewBox="0 0 200 200"
                          className="w-full h-full"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="5"
                            y="120"
                            width="190"
                            height="60"
                            rx="8"
                            fill="#0f172a"
                            opacity="0.06"
                          />
                          <g transform="translate(40,30)">
                            <circle cx="60" cy="45" r="28" fill="#ffd9b3" />
                            <rect
                              x="28"
                              y="68"
                              width="64"
                              height="30"
                              rx="8"
                              fill="#4b5563"
                            />
                            <rect
                              x="36"
                              y="35"
                              width="48"
                              height="8"
                              rx="4"
                              fill="#7c3aed"
                            />
                            <path
                              d="M46 45 q6 6 12 0"
                              stroke="#2d3748"
                              strokeWidth="2"
                              fill="transparent"
                              strokeLinecap="round"
                            />
                            <path
                              d="M68 45 q6 6 12 0"
                              stroke="#2d3748"
                              strokeWidth="2"
                              fill="transparent"
                              strokeLinecap="round"
                            />
                            <g className="zzz" transform="translate(110,10)">
                              <text
                                x="0"
                                y="0"
                                fontSize="18"
                                fontWeight="700"
                                fill="#6b7280"
                              >
                                Z
                              </text>
                              <text
                                x="12"
                                y="-8"
                                fontSize="14"
                                fontWeight="700"
                                fill="#9ca3af"
                              >
                                z
                              </text>
                              <text
                                x="24"
                                y="-18"
                                fontSize="10"
                                fontWeight="700"
                                fill="#d1d5db"
                              >
                                z
                              </text>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Nap mode: Activated
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Estimated wake-up: when the coffee kicks in ☕️
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="rounded-full px-3 py-1 border border-indigo-100 text-indigo-700 text-xs font-medium">
                            Status: Snoozing
                          </div>
                          <div className="rounded-full px-3 py-1 bg-white border border-gray-100 text-gray-700 text-xs">
                            ETA: unknown
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="w-full bg-white rounded-full h-3 relative overflow-hidden border border-gray-100">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-indigo-400/50"
                          initial={{ width: "4%" }}
                          animate={{
                            width: ["4%", "28%", "12%", "42%", "28%"],
                          }}
                          transition={{
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 6,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Dreaming up features…
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4 text-sm text-gray-500">
                    P.S. Be kind — the code sleeps heavier than it looks.
                  </div>
                </motion.div>
              </section>
            </div>
          </motion.div>

          {/* Floating Z animation */}
          <style>{`
            @keyframes floatUp {
              0% { transform: translateY(0) scale(1); opacity: 0.95 }
              50% { transform: translateY(-12px) scale(1.05); opacity: 1 }
              100% { transform: translateY(0) scale(1); opacity: 0.95 }
            }
            .zzz text:nth-child(1) { animation: floatUp 2.6s ease-in-out infinite; }
            .zzz text:nth-child(2) { animation: floatUp 2.8s ease-in-out 0.15s infinite; }
            .zzz text:nth-child(3) { animation: floatUp 3s ease-in-out 0.3s infinite; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
