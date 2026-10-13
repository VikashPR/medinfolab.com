import React, { useEffect, useRef } from "react";
import { X, Mail, BookOpen, ExternalLink, GraduationCap, Target } from "lucide-react";
import { TeamMember } from "@/types";

interface Props {
  member: TeamMember;
  onClose: () => void;
}

export function TeamMemberDetailModal({ member, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        {/* Header Section */}
        <div className="relative shrink-0 border-b border-slate-100 bg-slate-50 px-6 py-6 sm:px-10 sm:py-8">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-white p-2 text-slate-400 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md sm:h-32 sm:w-32">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-maroon-700">
                {member.role}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {member.name} {member.credentials && <span className="text-lg font-medium text-slate-500">, {member.credentials}</span>}
              </h2>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {member.social?.email && (
                  <a href={`mailto:${member.social.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:text-maroon-700">
                    <Mail size={14} /> Email
                  </a>
                )}
                {member.social?.scholar && (
                  <a href={member.social.scholar} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:text-maroon-700">
                    <BookOpen size={14} /> Google Scholar
                  </a>
                )}
                {member.social?.linkedin && (
                  <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:text-maroon-700">
                    <ExternalLink size={14} /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            {/* Main Bio */}
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-slate-900">Biography</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  {member.detailedBio || member.bio || "No biography provided."}
                </p>
              </section>
              
              {member.labRoleDetail && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900">Role in Laboratory</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {member.labRoleDetail}
                  </p>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:border-l lg:border-slate-100 lg:pl-8">
              {member.focus && member.focus.length > 0 && (
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
                    <Target size={16} className="text-maroon-700" /> Research Focus
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {member.focus.map((f, i) => (
                      <li key={i} className="text-sm text-slate-600 border-l-2 border-maroon-200 pl-3">
                        {f}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {member.skills && member.skills.length > 0 && (
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
                    <GraduationCap size={16} className="text-maroon-700" /> Expertise
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.skills.map((s, i) => (
                      <span key={i} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
