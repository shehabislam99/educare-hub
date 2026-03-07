import Link from "next/link";

export const metadata = {
  title: "Terms of Service | EduHub",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900  transition-colors duration-300">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-[1.1]">
          Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium mt-3">
          These terms define account responsibilities and acceptable use of the EduHub
          platform for students and instructors.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {[
            {
              title: "Account Responsibility",
              text: "You are responsible for keeping your account credentials secure and for all activities under your account.",
            },
            {
              title: "Acceptable Use",
              text: "You agree not to misuse platform features, upload harmful content, or violate laws while using EduHub.",
            },
            {
              title: "Course Content",
              text: "Instructors are responsible for course accuracy and rights to uploaded content. EduHub may remove violating content.",
            },
            {
              title: "Changes to Terms",
              text: "We may update these terms over time. Continued use of EduHub means you accept the latest version.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="bg-white  border border-slate-100 dark:border-slate-300 rounded-3xl p-6"
            >
              <h2 className="text-lg font-bold mb-2 uppercase">
                {item.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.text}
              </p>
            </article>
          ))}
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-10">
          Effective date: March 7, 2026
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/privacy"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
          >
            Read Privacy
          </Link>
          <Link
            href="/about"
            className="px-5 py-3 rounded-xl border border-slate-300  text-sm font-bold text-slate-700  hover:bg-indigo-400 transition-colors"
          >
            About EduHub
          </Link>
        </div>
      </section>
    </main>
  );
}
