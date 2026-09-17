import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Building, ArrowUpRight, Github, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenCollab: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCollab }) => {
  return (
    <footer id="footer" className="bg-white dark:bg-[#0c0305] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-maroon-800 text-white flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                MINDH <span className="text-maroon-800 dark:text-maroon-400 font-medium">Lab</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              Medical Informatics and Digital Health Laboratory. Advancing translational physiological monitoring, contactless sensing, and clinical AI.
            </p>
            <div className="pt-1">
              <a
                href="https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-maroon-50 dark:bg-slate-850 hover:bg-maroon-100 dark:hover:bg-slate-800 text-maroon-900 dark:text-slate-300 font-medium text-xs transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current text-maroon-800" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>Follow on LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-maroon-800" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Pages & Catalog
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors">
                  Overview & Thrusts
                </Link>
              </li>
              <li>
                <Link to="/publications" className="hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors">
                  Publications Catalog
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors">
                  News & Announcements
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors">
                  Laboratory Facilities & Rigs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors">
                  Contact Us & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Focus Areas */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Specialized Areas
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-700"></span>
                <span>Contactless rPPG Sensing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-700"></span>
                <span>Continuous Cuffless Blood Pressure</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-700"></span>
                <span>Self-Supervised ECG Transformers</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-700"></span>
                <span>EHR FHIR Clinical AI Integration</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Inquiries */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Lab Location & Contact
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-maroon-800 dark:text-maroon-400 flex-shrink-0 mt-0.5" />
                <span>Division of Medical Informatics, Health Sciences Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-maroon-800 dark:text-maroon-400 flex-shrink-0" />
                <a
                  href="mailto:contact@mindh-lab.org"
                  className="hover:text-maroon-800 dark:hover:text-maroon-400 font-mono"
                >
                  contact@mindh-lab.org
                </a>
              </div>
              <Link
                to="/contact"
                className="mt-2 w-full py-2 bg-maroon-800 hover:bg-maroon-900 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Inquiry & Contact Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Links */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <div>
            © {new Date().getFullYear()} MINDH Lab. All rights reserved. Medical Informatics and Digital Health Laboratory.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-maroon-800 dark:hover:text-maroon-400"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-400 uppercase tracking-wider">Open Science / FAIR</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-400 uppercase tracking-wider">IRB Protocol Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
