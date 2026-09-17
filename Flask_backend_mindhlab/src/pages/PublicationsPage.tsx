import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  ExternalLink,
  FileText,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Publication, PublicationTopic } from '../types';
import { LAB_PUBLICATIONS } from '../data/labData';

const PAGE_SIZE = 5;

export const PublicationsPage: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const topics: ('All' | PublicationTopic)[] = [
    'All',
    'Physiological Monitoring',
    'Clinical AI',
    'Signal Processing',
    'Digital Health',
  ];

  const fetchPublications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/publications');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.publications)) {
          setPublications(data.publications);
        } else {
          setPublications(LAB_PUBLICATIONS);
        }
      } else {
        setPublications(LAB_PUBLICATIONS);
      }
    } catch (err: any) {
      console.warn('Backend unavailable, using static fallback:', err);
      setPublications(LAB_PUBLICATIONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleCopyBibtex = (pub: Publication) => {
    if (pub.bibtex) {
      navigator.clipboard.writeText(pub.bibtex);
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Derive unique years
  const availableYears = ['All', ...Array.from(new Set(publications.map((p) => p.year.toString()))).sort((a, b) => Number(b) - Number(a))];

  // Filtering
  const filteredPubs = publications.filter((pub) => {
    const matchesTopic = selectedTopic === 'All' || pub.topic === selectedTopic;
    const matchesYear = selectedYear === 'All' || pub.year.toString() === selectedYear;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      pub.title.toLowerCase().includes(query) ||
      pub.authors.toLowerCase().includes(query) ||
      pub.journal.toLowerCase().includes(query) ||
      pub.abstract.toLowerCase().includes(query) ||
      (pub.highlight && pub.highlight.toLowerCase().includes(query));

    return matchesTopic && matchesYear && matchesSearch;
  });

  const displayedPubs = filteredPubs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPubs.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPubs.length));
  };

  const getTopicBadgeClass = (topic: PublicationTopic) => {
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
    <div className="min-h-screen bg-white dark:bg-[#120609] pt-24 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-maroon-800 dark:hover:text-maroon-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">Publications</span>
        </nav>

        {/* Page Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Peer-Reviewed Literature</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Laboratory Publications
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Archiving translational breakthroughs in contactless rPPG telemetry, deep learning vital sign estimation, and explainable bedside clinical AI.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 dark:bg-[#18080e] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search publications by title, author, journal, or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
              />
            </div>

            {/* Year Selector */}
            <div className="w-full md:w-44">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
              >
                <option value="All">All Years</option>
                {availableYears.filter((y) => y !== 'All').map((yr) => (
                  <option key={yr} value={yr}>
                    Year: {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Topic:
            </span>
            {topics.map((t) => {
              const active = selectedTopic === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(t);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-maroon-800 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{displayedPubs.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{filteredPubs.length}</strong> publications
          </span>
          {(searchQuery || selectedTopic !== 'All' || selectedYear !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All');
                setSelectedYear('All');
                setVisibleCount(PAGE_SIZE);
              }}
              className="text-maroon-700 dark:text-maroon-400 hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Publications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : displayedPubs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching publications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any papers matching your selected filters or search terms.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedPubs.map((pub) => {
              const isExpanded = expandedAbstractId === pub.id;
              const isCopied = copiedId === pub.id;

              return (
                <article
                  key={pub.id}
                  className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#15070b] border border-slate-200/80 dark:border-slate-800 hover:border-maroon-200 dark:hover:border-maroon-900/60 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {/* Topic & Year Pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getTopicBadgeClass(
                            pub.topic
                          )}`}
                        >
                          {pub.topic}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {pub.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {pub.title}
                      </h2>

                      {/* Authors */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {pub.authors}
                      </p>

                      {/* Journal / Venue */}
                      <p className="text-xs text-maroon-800 dark:text-maroon-400 font-semibold italic">
                        {pub.journal}
                      </p>
                    </div>

                    {/* Action Links & Citations */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {pub.pdfUrl && pub.pdfUrl !== '#' && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-maroon-700 dark:text-maroon-400" />
                            <span>PDF</span>
                          </a>
                        )}

                        {pub.doiUrl && pub.doiUrl !== '#' && (
                          <a
                            href={pub.doiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>DOI</span>
                          </a>
                        )}

                        {pub.codeUrl && (
                          <a
                            href={pub.codeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                          >
                            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Code</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleCopyBibtex(pub)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>BibTeX</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Highlight Badge */}
                  {pub.highlight && (
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold">Key Finding:</strong> {pub.highlight}
                      </span>
                    </div>
                  )}

                  {/* Abstract Section with Expansion */}
                  <div className="border-t border-slate-100 dark:border-slate-850/80 pt-3">
                    <button
                      onClick={() => setExpandedAbstractId(isExpanded ? null : pub.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-maroon-800 dark:hover:text-maroon-400 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Abstract' : 'View Abstract'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-[#1c0b11] border border-slate-200/80 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        {pub.abstract}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More Pagination */}
        {hasMore && (
          <div className="text-center pt-10">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-maroon-700 dark:hover:border-maroon-600 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-sm hover:shadow transition-all"
            >
              Load More Publications ({filteredPubs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
