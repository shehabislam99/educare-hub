import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Youtube } from "lucide-react";
import logo from "../../assets/istockphoto-1215255370-612x612.jpg";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-10 dark:bg-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center overflow-hidden">
                <img src={logo.src || logo} alt="EduHub Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-white hover:text-indigo-400 transition-colors">
                EduHub
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-sm font-medium">
              Empowering learners worldwide with high-quality, accessible education
              from industry experts.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-400 mb-6">
              Company
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-400 mb-6">
              Social
            </h4>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-colors flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-colors flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-colors flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
           
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800  items-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] text-center">
            © 2026 EduHub Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
