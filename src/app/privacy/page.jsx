import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | EduHub",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900  transition-colors duration-300">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-[1.1]">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium mt-3">
          This policy explains what data we collect, how we use it, and what controls you
          have while using EduHub.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {[
            {
              title: "Information We Collect",
              text: "We collect account information, course activity, and profile details needed to provide EduHub services.",
            },
            {
              title: "How We Use Data",
              text: "We use your data to authenticate your account, personalize learning, and improve platform performance and safety.",
            },
            {
              title: "Data Sharing",
              text: "We do not sell personal data. We share data only with trusted service providers required to operate EduHub.",
            },
            {
              title: "Your Rights",
              text: "You can request correction or deletion of account information by contacting support.",
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
            href="/terms"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors"
          >
            Read Terms
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
