'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MapPin,
  Building,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  GraduationCap,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { CollaboratorsSection } from '../components/CollaboratorsSection';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface ContactPageProps {
  onOpenCollab?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenCollab = () => {} }) => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    affiliation: '',
    role: 'Academic Researcher',
    interestType: 'Research Collaboration',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please complete your name, email, and inquiry message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(data.message || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setErrorMsg(`Network error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      affiliation: '',
      role: 'Academic Researcher',
      interestType: 'Research Collaboration',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#120609] pt-24 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-maroon-800 dark:hover:text-maroon-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Contact Us</span>
        </nav>

        {/* Page Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-10 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>Connect & Collaborate</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Contact MINDH Laboratory
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              We actively welcome clinical trial partnerships, multi-center grant proposals, industry sensor evaluations, and prospective PhD or postdoctoral applications.
            </p>
          </div>
        </div>

        {/* Main Grid: Form + Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#16070c] border border-slate-200 dark:border-slate-800 shadow-sm">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Inquiry Received
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to the MINDH Lab. Your inquiry has been routed to the relevant faculty liaison and we will respond within 1-2 business days.
                  </p>
                  <button
                    onClick={resetForm}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-semibold text-xs shadow-md transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Send a Message to the Lab
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Direct inquiry channel for research collaborations, student positions, and clinical partnerships.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Jane Doe / John Smith"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="j.doe@institution.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Affiliation / University / Hospital
                      </label>
                      <input
                        type="text"
                        value={formData.affiliation}
                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                        placeholder="e.g. Stanford Medicine / NHS Trust"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
                      >
                        <option value="Academic Researcher">Academic Researcher</option>
                        <option value="Clinical Investigator / MD">Clinical Investigator / MD</option>
                        <option value="Prospective PhD / Postdoc">Prospective PhD / Postdoc</option>
                        <option value="Undergraduate / Graduate Student">Undergraduate / Graduate Student</option>
                        <option value="Industry & MedTech Partner">Industry & MedTech Partner</option>
                        <option value="Government / Grant Sponsor">Government / Grant Sponsor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.interestType}
                      onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    >
                      <option value="Research Collaboration">Multi-Center Research Collaboration</option>
                      <option value="Clinical Trial Deployment">Clinical Trial Site Deployment / Validation</option>
                      <option value="PhD / Postdoc Position Inquiry">Prospective PhD / Postdoc Position Inquiry</option>
                      <option value="Facility & Testing Rig Access">Facility & Testbed Rig Access Request</option>
                      <option value="Industry Sponsorship">Industry Sponsorship / Technology Licensing</option>
                      <option value="General Inquiry">General Academic Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message / Project Scope *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please outline the nature of your inquiry, prospective protocol dates, research synergies, or candidate qualifications..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
                  >
                    {isSubmitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Office Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#16070c] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Laboratory Location
                  </h3>
                  <p className="text-xs text-slate-500">Center for Medical Informatics</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-maroon-700 dark:text-maroon-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">
                      {settings.roomLocation || 'Medical Sciences Complex, Clinical Simulation Wing'}
                    </strong>
                    <span>{settings.address || 'Division of Medical Informatics, Health Sciences Center'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-maroon-700 dark:text-maroon-400 shrink-0" />
                  <a
                    href={`mailto:${settings.contactEmail || 'contact@mindh-lab.org'}`}
                    className="hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors font-mono"
                  >
                    {settings.contactEmail || 'contact@mindh-lab.org'}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-maroon-700 dark:text-maroon-400 shrink-0" />
                  <span>{settings.visitingHours || 'Monday - Friday: 09:00 - 17:00 (By Appointment)'}</span>
                </div>

                {/* Institutional Affiliation Logo (Bottom-Right Logo) */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2">
                    Institutional Affiliation & Partner
                  </div>
                  {settings.bottomRightLogoUrl ? (
                    <a
                      href={settings.bottomRightLogoLink || '#'}
                      target={settings.bottomRightLogoLink ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-maroon-300 dark:hover:border-maroon-700 transition-colors group"
                    >
                      <img
                        src={settings.bottomRightLogoUrl}
                        alt={settings.bottomRightLogoText || 'Affiliation Logo'}
                        className="h-8 w-auto max-h-8 max-w-[140px] object-contain rounded shrink-0"
                      />
                      {settings.bottomRightLogoText && (
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
                          {settings.bottomRightLogoText}
                        </span>
                      )}
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 text-xs">
                      <Building className="w-4 h-4 text-maroon-800 dark:text-maroon-400 shrink-0" />
                      <span className="font-medium">
                        {settings.bottomRightLogoText || 'Division of Medical Informatics & Health Sciences'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Prospective Students Box */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <GraduationCap className="w-4 h-4 text-maroon-800 dark:text-maroon-400" />
                <span>Prospective Scholars & Postdocs</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We are actively recruiting PhD candidates with strong backgrounds in computer vision, digital signal processing, or biomedical engineering. Please submit your CV, code portfolio, and a 1-page research statement via the inquiry form.
              </p>
            </div>

            {/* Clinical Partnerships Box */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>IRB Protocols & Data Use Agreements</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Multi-center telemetry validation protocols conform to strict HIPAA and GDPR standards. Standard collaborative agreements and de-identified waveform benchmarking pipelines are available upon request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical & Academic Consortium Collaborators */}
      <CollaboratorsSection onOpenCollaborateModal={onOpenCollab} />
    </div>
  );
};
