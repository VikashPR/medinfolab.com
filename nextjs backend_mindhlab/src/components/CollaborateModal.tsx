'use client';

import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle2, Building, User, MessageSquare, ArrowUpRight } from 'lucide-react';

interface CollaborateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollaborateModal: React.FC<CollaborateModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    type: 'Clinical Trial Partnership',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      institution: '',
      type: 'Clinical Trial Partnership',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        id="collab-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div>
            <span className="text-maroon-800 dark:text-maroon-400 text-xs font-mono uppercase font-bold tracking-wider">
              Project Collaboration
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Collaborate with MINDH Lab
            </h3>
          </div>
          <button
            onClick={onClose}
            id="btn-close-collab-modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Inquiry Received
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to the Medical Informatics and Digital Health Lab. Our principal investigators will review your proposal and respond promptly.
              </p>
              <div className="pt-4 flex flex-col gap-2">
                <a
                  href={`mailto:inquiries@mindhlab.edu?subject=MINDH%20Collaboration:%20${encodeURIComponent(
                    formData.type
                  )}&body=Name:%20${encodeURIComponent(formData.name)}%0AInstitution:%20${encodeURIComponent(
                    formData.institution
                  )}%0A%0A${encodeURIComponent(formData.message)}`}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Send Backup Copy to inquiries@mindhlab.edu
                </a>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl bg-maroon-800 text-white font-semibold text-xs hover:bg-maroon-900 transition-colors shadow-sm"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                We welcome inquiries for hospital clinical trials, NIH/NSF co-investigations, algorithmic co-development, and postdoctoral positions.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution or Organization *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Hospital, University, or Research Institute"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Collaboration Area
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                >
                  <option value="Clinical Trial Partnership">Clinical Trial Partnership</option>
                  <option value="Algorithm & Code Co-Development">Algorithm & Code Co-Development</option>
                  <option value="Grant Application (NIH / NSF / Horizon)">Grant Application (NIH / NSF / Horizon)</option>
                  <option value="Postdoctoral & PhD Fellowship">Postdoctoral & PhD Fellowship</option>
                  <option value="Technology Licensing & Transfer">Technology Licensing & Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Description or Objectives *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline the scope, patient population, or technical questions you wish to investigate together..."
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href="mailto:inquiries@mindhlab.edu?subject=MINDH%20Lab%20Collaboration%20Inquiry"
                  className="text-xs text-slate-500 hover:text-maroon-800 dark:text-slate-400 dark:hover:text-maroon-400 flex items-center gap-1 font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Email Client</span>
                </a>

                <button
                  type="submit"
                  id="btn-submit-collab-form"
                  className="px-5 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Proposal</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer with LinkedIn quick link */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Official Lab Correspondence</span>
          <a
            href="https://www.linkedin.com/company/medical-informatics-and-digital-health-lab/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-maroon-800 dark:text-maroon-400 font-semibold hover:underline"
          >
            <span>MINDH LinkedIn</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
