import React, { useContext, useState, useMemo } from 'react';
import { WebsiteContext } from '../context/WebsiteContext';
import { AuthContext } from '../context/AuthContext';
import Hero from '../components/Hero';
import WebsiteGrid from '../components/WebsiteGrid';
import AddModal from '../components/AddModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiChevronDown, FiPlus } from 'react-icons/fi';

const Home = () => {
  const { websites, addWebsite } = useContext(WebsiteContext);
  const { isAdmin } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('demo');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Demo tab state
  const [demoSearch, setDemoSearch] = useState('');
  const [demoCategory, setDemoCategory] = useState('');

  // Active tab state
  const [activeSearch, setActiveSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const demoWebsites = useMemo(() => websites.filter(w => w.projectType === 'demo'), [websites]);
  const activeWebsites = useMemo(() => websites.filter(w => w.projectType === 'active'), [websites]);

  const demoCategories = useMemo(() => {
    const cats = new Set(demoWebsites.map(w => w.category));
    return Array.from(cats).sort();
  }, [demoWebsites]);

  const activeCategories = useMemo(() => {
    const cats = new Set(activeWebsites.map(w => w.category));
    return Array.from(cats).sort();
  }, [activeWebsites]);

  const [sortBy, setSortBy] = useState('None');

  const filteredDemoWebsites = useMemo(() => {
    let result = [...demoWebsites];
    if (demoSearch) {
      const s = demoSearch.toLowerCase();
      result = result.filter(w =>
        w.websiteName.toLowerCase().includes(s) ||
        w.category.toLowerCase().includes(s)
      );
    }
    if (demoCategory) {
      result = result.filter(w => w.category === demoCategory);
    }
    if (sortBy === 'A to Z') {
      result.sort((a, b) => a.websiteName.localeCompare(b.websiteName));
    }
    return result;
  }, [demoWebsites, demoSearch, demoCategory, sortBy]);

  const filteredActiveWebsites = useMemo(() => {
    let result = [...activeWebsites];
    if (activeSearch) {
      const s = activeSearch.toLowerCase();
      result = result.filter(w =>
        (w.companyName || w.websiteName).toLowerCase().includes(s)
      );
    }
    if (activeCategory) {
      result = result.filter(w => w.category === activeCategory);
    }
    if (sortBy === 'A to Z') {
      result.sort((a, b) => (a.companyName || a.websiteName).localeCompare(b.companyName || b.websiteName));
    }
    return result;
  }, [activeWebsites, activeSearch, activeCategory, sortBy]);

  const SortDropdown = () => (
    <div className="relative shrink-0 w-full sm:w-auto">
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        className="relative z-0 appearance-none w-full pl-4 pr-9 py-3 border border-white/20 rounded-full bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base transition-all duration-300 cursor-pointer"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <option value="None">Sort By: None</option>
        <option value="Category Wise">Category Wise</option>
        <option value="A to Z">A to Z</option>
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
        <FiChevronDown className="text-textSecondary" size={15} />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <Hero />

      <main id="marketplace-grid" className="flex-1 w-[95%] md:w-[85%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header Row */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 xl:gap-5">

            {/* Title + Tabs */}
            <div className="flex items-center gap-3 flex-wrap order-1">
              
              <div className="flex gap-2">
                {[
                  { key: 'demo', label: 'Demo Project' },
                  { key: 'active', label: 'Active Project' }
                ].map(tab => (
                  <motion.button
                    key={tab.key}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold tracking-widest uppercase transition-all duration-300 ${
                      activeTab === tab.key
                        ? 'bg-primary text-background shadow-md shadow-primary/20'
                        : 'border border-white/20 bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] text-textSecondary hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search / Filter */}
            <div className="flex flex-wrap gap-3 items-center justify-start xl:justify-end w-full xl:w-auto xl:flex-1 order-3 xl:order-2 mt-2 xl:mt-0">
              <AnimatePresence mode="wait">
                {activeTab === 'demo' ? (
                  <motion.div
                    key="demo-filter"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex  gap-3 items-center justify-start xl:justify-end flex-1 min-w-[200px]"
                  >
                    {/* Category Dropdown */}
                    <div className="relative w-full sm:w-auto shrink-0">
                      <select
                        id="demo-category-filter"
                        value={demoCategory}
                        onChange={e => setDemoCategory(e.target.value)}
                        className="relative z-0 appearance-none w-full sm:w-auto min-w-[140px] pl-4 pr-8 py-2.5 border border-white/20 rounded-full bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300 cursor-pointer"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        <option value="">All Categories</option>
                        {demoCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
                        <FiChevronDown className="text-textSecondary" size={14} />
                      </div>
                    </div>
                    
                    {/* Demo Search */}
                    <div className="relative w-full sm:w-auto sm:flex-1 min-w-[150px] max-w-sm">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FiSearch className="text-primary/70" size={17} />
                      </div>
                      <input
                        id="demo-search-input"
                        type="text"
                        className="relative z-0 block w-full pl-10 pr-9 py-2.5 border border-white/20 rounded-full bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] placeholder-textSecondary text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300"
                        placeholder="Search name..."
                        value={demoSearch}
                        onChange={e => setDemoSearch(e.target.value)}
                      />
                      {demoSearch && (
                        <button
                          id="demo-search-clear"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-primary transition-colors z-10"
                          onClick={() => setDemoSearch('')}
                          title="Clear search"
                        >
                          <FiX size={15} />
                        </button>
                      )}
                    </div>
                    
                    <div className="relative w-full sm:w-auto shrink-0">
                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="relative z-0 appearance-none w-full sm:w-auto min-w-[130px] pl-4 pr-8 py-2.5 border border-white/20 rounded-full bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300 cursor-pointer"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        <option value="None">Sort By: None</option>
                        <option value="Category Wise">Category Wise</option>
                        <option value="A to Z">A to Z</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
                        <FiChevronDown className="text-textSecondary" size={14} />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active-filter"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 items-center justify-start xl:justify-end flex-1 min-w-[200px]"
                  >
                    {/* Active Category Dropdown */}
                    <div className="relative w-full sm:w-auto shrink-0">
                      <select
                        id="active-category-filter"
                        value={activeCategory}
                        onChange={e => setActiveCategory(e.target.value)}
                        className="relative z-0 appearance-none w-full sm:w-auto min-w-[140px] pl-4 pr-8 py-2.5 border border-white/20 rounded-full bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300 cursor-pointer"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        <option value="">All Categories</option>
                        {activeCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
                        <FiChevronDown className="text-textSecondary" size={14} />
                      </div>
                    </div>

                    {/* Active Search */}
                    <div className="relative w-full sm:w-auto sm:flex-1 min-w-[150px] max-w-sm">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FiSearch className="text-primary/70" size={17} />
                      </div>
                      <input
                        id="active-search-input"
                        type="text"
                        className="relative z-0 block w-full pl-10 pr-9 py-2.5 border border-white/20 rounded-full bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] placeholder-textSecondary text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300"
                        placeholder="Search..."
                        value={activeSearch}
                        onChange={e => setActiveSearch(e.target.value)}
                      />
                      {activeSearch && (
                        <button
                          id="active-search-clear"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-primary transition-colors z-10"
                          onClick={() => setActiveSearch('')}
                          title="Clear search"
                        >
                          <FiX size={15} />
                        </button>
                      )}
                    </div>

                    <div className="relative w-full sm:w-auto shrink-0">
                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="relative z-0 appearance-none w-full sm:w-auto min-w-[130px] pl-4 pr-8 py-2.5 border border-white/20 rounded-full bg-white/20 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.05)] text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300 cursor-pointer"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        <option value="None">Sort By: None</option>
                        <option value="Category Wise">Category Wise</option>
                        <option value="A to Z">A to Z</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
                        <FiChevronDown className="text-textSecondary" size={14} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* + Add Button — admin only */}
            {isAdmin && (
              <div className="order-2 xl:order-3 ml-auto xl:ml-0 shrink-0">
                <motion.button
                  id="add-website-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-dark text-background text-xs font-bold tracking-widest uppercase rounded-full transition-colors shadow-[0_0_15px_rgba(197,160,89,0.25)] w-auto"
                >
                  <FiPlus size={14} />
                  Add
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <WebsiteGrid
            key={activeTab}
            websites={activeTab === 'demo' ? filteredDemoWebsites : filteredActiveWebsites}
            sortBy={sortBy}
          />
        </AnimatePresence>
      </main>

      {/* Add Modal */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </motion.div>
  );
};

export default Home;
