import React from "react";
import Link from "next/link";

export const metadata = {
  title: "TIMER - Your Personal Time Management Tool",
  description:
    "TIMER helps you boost productivity with customizable timers, task tracking, and focus management tools.",
  keywords:
    "timer, productivity, time management, focus timer, pomodoro, analytics",
};

export default function RootPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            Focus on what matters with{" "}
            <span className="text-blue-500">TIMER</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            The smart time management tool that helps you stay focused and boost
            productivity
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/timer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Try Now
            </Link>
            <Link
              href="/api/auth/login"
              className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-semibold transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg bg-gray-800">
            <h2 className="text-xl font-bold mb-4">Custom Timers</h2>
            <p className="text-gray-300">
              Create personalized timers for any task or activity
            </p>
          </div>
          <div className="p-6 rounded-lg bg-gray-800">
            <h2 className="text-xl font-bold mb-4">Focus Tracking</h2>
            <p className="text-gray-300">
              Monitor your productivity and focus sessions
            </p>
          </div>
          <div className="p-6 rounded-lg bg-gray-800">
            <h2 className="text-xl font-bold mb-4">Progress Analytics</h2>
            <p className="text-gray-300">
              Visualize your time management improvements
            </p>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-bold mb-12">How TIMER Works</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur">
              <h3 className="text-2xl font-bold mb-4">Smart Time Tracking</h3>
              <p className="text-gray-300">
                Automatically tracks your focus sessions and provides detailed
                analytics
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur">
              <h3 className="text-2xl font-bold mb-4">
                Customizable Intervals
              </h3>
              <p className="text-gray-300">
                Set your preferred work and break intervals to match your
                productivity rhythm
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
      </main>
    </div>
  );
}
