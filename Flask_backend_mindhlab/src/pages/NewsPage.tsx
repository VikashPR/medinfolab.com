import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  ExternalLink,
  Search,
  ChevronRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { LabNewsItem } from '../types';
import { LAB_NEWS } from '../data/labData';

const PAGE_SIZE = 6;

export const NewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<LabNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const categories = ['All', 'Paper Accepted', 'Grant Award', 'Clinical Pilot', 'Keynote', 'Lab Update'];

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.news)) {
          setNewsList(data.news);
        } else {
          setNewsList(LAB_NEWS);
        }
      } else {
        setNewsList(LAB_NEWS);
      }
    } catch (err: any) {
      console.warn('Backend unavailable, using static fallback:', err);
      setNewsList(LAB_NEWS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filtered list
  const filteredNews = newsList.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.summary && item.summary.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query);

    return matchesCat && matchesSearch;
  });

  const displayedNews = filteredNews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNews.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredNews.length));
  };

  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'Paper Accepted':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Grant Award':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Clinical Pilot':
        return 'bg-sky-50 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'Keynote':
        return 'bg-purple-50 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#120609] pt-24 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-maroon-800 dark:hover:text-maroon-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">News & Announcements</span>
        </nav>

        {/* Page Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 dark:bg-maroon-950/70 text-maroon-800 dark:text-maroon-300 border border-maroon-200/80 dark:border-maroon-800/80 text-xs font-bold uppercase tracking-wider mb-3">
              <Bell className="w-3.5 h-3.5" />
              <span>Laboratory News Wire</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              News & Announcements
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Stay current on our clinical hospital deployments, research grants, high-impact journal acceptances, and lab milestones.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-slate-50 dark:bg-[#18080e] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search announcements, papers, clinical trials, or grants..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Category:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-maroon-800 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{displayedNews.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{filteredNews.length}</strong> news items
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setVisibleCount(PAGE_SIZE);
              }}
              className="text-maroon-700 dark:text-maroon-400 hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : displayedNews.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No news announcements found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter or keyword query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedNews.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-[#15070b] border border-slate-200/80 dark:border-slate-800 hover:border-maroon-200 dark:hover:border-maroon-900/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Visual Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${getCategoryClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Date badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-white/95">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-maroon-800 dark:group-hover:text-maroon-400 transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {item.summary && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-maroon-700 dark:text-maroon-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.summary}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-850/80 mt-2 flex items-center justify-between">
                  {item.linkUrl && item.linkUrl !== '#' ? (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-maroon-800 dark:text-maroon-400 hover:text-maroon-900 dark:hover:text-maroon-300 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{item.linkText || 'Read Announcement'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Laboratory Press Wire</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Option */}
        {hasMore && (
          <div className="text-center pt-10">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-maroon-700 dark:hover:border-maroon-600 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-sm hover:shadow transition-all"
            >
              Load More News ({filteredNews.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
