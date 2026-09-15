import React, { useState } from 'react';
import { ExternalLink, FileText, Code2, Copy, Check, Filter, Search, BookOpen, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { LAB_PUBLICATIONS } from '../data/labData';
import { Publication, PublicationTopic } from '../types';

interface PublicationsSectionProps {
  onOpenCollab: () => void;
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ onOpenCollab }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  const topics: ('All' | PublicationTopic)[] = [
    'All',
    'Physiological Monitoring',
    'Clinical AI',
    'Signal Processing',
  ];

  const filteredPublications = LAB_PUBLICATIONS.filter((pub) => {
    const matchesTopic = selectedTopic === 'All' || pub.topic === selectedTopic;
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.journal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleCopyBibtex = (pub: Publication) => {
    navigator.clipboard.writeText(pub.bibtex);
    setCopiedId(pub.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getTopicColorClasses = (topic: PublicationTopic) => {
    switch (topic) {
      case 'Physiological Monitoring':
        return 'bg-maroon-50 text-maroon-800 dark:bg-maroon-950/70 dark:text-maroon-300 border-maroon-200 dark:border-maroon-800';
      case 'Clinical AI':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Signal Processing':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-rose-50 text-rose-900 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <section id="publications" className="py-12 sm:py-16 bg-white dark:bg-[#120609] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Peer-Reviewed Evidence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Selected Publications
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
              Foundational and translational papers from the MINDH team across contactless sensing, physiological monitoring, and clinical AI.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="publication-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, or journal..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:border-maroon-600 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Area:
          </span>
          {topics.map((topic) => (
            <button
              key={topic}
              id={`filter-topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedTopic === topic
                  ? 'bg-maroon-800 text-white dark:bg-maroon-700 dark:text-white border-transparent shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-maroon-400 hover:text-maroon-800'
              }`}
            >
              {topic} {topic === 'All' ? `(${LAB_PUBLICATIONS.length})` : ''}
            </button>
          ))}
        </div>

        {/* Publication Cards List / Modular Grid */}
        <div className="space-y-4">
          {/* ===================================================================== */}
          {/* HTML COMMENT MARKER FOR LAB RESEARCHERS & DEVELOPERS:                */}
          {/* ADD ADDITIONAL PAPERS HERE: Follow the publication item structure below */}
          {/* ===================================================================== */}

          {filteredPublications.map((pub) => {
            const isAbstractExpanded = expandedAbstractId === pub.id;
            return (
              <div
                key={pub.id}
                id={`publication-${pub.id}`}
                className="bg-white dark:bg-slate-800/90 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-maroon-400/80 dark:hover:border-maroon-500 hover:shadow-md transition-all group"
              >
                {/* Header row: Topic badge, year, cite action */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getTopicColorClasses(
                        pub.topic
                      )}`}
                    >
                      {pub.topic}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {pub.year}
                    </span>
                  </div>

                  {/* Copy BibTeX Citation Button */}
                  <button
                    id={`btn-copy-bibtex-${pub.id}`}
                    onClick={() => handleCopyBibtex(pub)}
                    title="Copy BibTeX Citation"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 hover:text-maroon-800 dark:text-slate-400 dark:hover:text-maroon-300 hover:bg-maroon-50 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    {copiedId === pub.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">BibTeX Copied!</span>
                      </>
                    ) : (
                      <>
                        <Quote className="w-3.5 h-3.5" />
                        <span>BibTeX</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Paper Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-maroon-800 dark:group-hover:text-maroon-300 transition-colors">
                  <a href={pub.doiUrl} target="_blank" rel="noopener noreferrer">
                    {pub.title}
                  </a>
                </h3>

                {/* Authors & Journal Line */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-1">
                  {pub.authors}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-3">
                  {pub.journal} ({pub.year})
                </p>

                {/* Abstract Preview */}
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-300 mb-4 border border-slate-100 dark:border-slate-800">
                  <p className={isAbstractExpanded ? '' : 'line-clamp-2'}>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Abstract: </span>
                    {pub.abstract}
                  </p>
                  {pub.highlight && (
                    <div className="mt-2 text-[11px] font-semibold text-maroon-800 dark:text-maroon-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-maroon-700"></span>
                      <span>Key Finding: {pub.highlight}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setExpandedAbstractId(isAbstractExpanded ? null : pub.id)}
                    className="mt-1 text-[11px] text-maroon-800 dark:text-maroon-300 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    {isAbstractExpanded ? (
                      <>
                        Show less <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Read full abstract <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>

                {/* Action Links Bar: DOI, PDF, Code */}
                <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {/* DOI Link */}
                  <a
                    href={pub.doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200 hover:text-maroon-800 dark:hover:text-maroon-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-maroon-800 dark:text-maroon-400" />
                    <span>DOI / Publisher Link</span>
                  </a>

                  {/* PDF Link */}
                  <a
                    href={pub.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200 hover:text-maroon-800 dark:hover:text-maroon-300 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-maroon-800 dark:text-maroon-400" />
                    <span>PDF / Preprint</span>
                  </a>

                  {/* Code / GitHub Link if available */}
                  {pub.codeUrl && (
                    <a
                      href={pub.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200 hover:text-maroon-800 dark:hover:text-maroon-300 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5 text-maroon-800 dark:text-maroon-400" />
                      <span>Code / GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredPublications.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No publications found matching your filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedTopic('All');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 text-xs font-semibold text-maroon-800 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* ===================================================================== */}
          {/* END OF PUBLICATION LISTING                                            */}
          {/* ===================================================================== */}
        </div>

        {/* Modular Collaboration Bar matching image reference */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Interested in joint clinical trials, algorithmic co-development, or open dataset licensing?
          </p>

          <button
            id="pub-btn-collab"
            onClick={onOpenCollab}
            className="w-full sm:w-auto px-6 py-3.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Collaborate with MINDH Lab</span>
          </button>
        </div>
      </div>
    </section>
  );
};
