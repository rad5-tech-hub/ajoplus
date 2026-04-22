// src/features/browse/BrowsePage.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import BrowseTabs from './components/BrowseTabs';
import ProductCard from './components/ProductCard';

import { useNavigate } from 'react-router-dom';

const BrowsePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'products'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const [step, setStep] = useState<1 | 2>(1);

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const allItems = [
    {
      id: 'p1',
      title: 'Special Food Package',
      price: 350000,
      category: 'Food & Groceries',
      type: 'package' as const,
      duration: '12 months',
      frequency: 'Daily',
      progress: 45,
      description: 'Complete food package with essential items - ₦1,000 daily from Jan. - Dec.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a9c?q=80&w=800',
      packageItems: [
        '1 Bag of Rice',
        '1 Carton of Spaghetti',
        '½ Carton of Tomatoes',
        '1 Packet of Salt',
        '1 Packet of Maggi',
        '2 Liters of Groundnut Oil',
        '1 Carton of Eggs',
        '1 Kg of Garri',
      ],
    },
    {
      id: 'p2',
      title: 'Rice Package',
      price: 97500,
      category: 'Food & Groceries',
      type: 'package' as const,
      duration: '12 months',
      frequency: 'Daily',
      description: 'Essential rice and groceries package - ₦250 daily',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
      packageItems: [
        '2 Bags of Rice',
        '1 Packet of Salt',
        '1 Kg of Garri',
        '1 Liter of Groundnut Oil',
      ],
    },
    {
      id: 'p3',
      title: 'Garri Package',
      price: 91200,
      category: 'Food & Groceries',
      type: 'package' as const,
      duration: '12 months',
      frequency: 'Daily',
      description: 'Garri and staples package - ₦250 daily',
      image: 'https://images.unsplash.com/photo-1626645739622-0c5c3b2b9c5e?q=80&w=800',
      packageItems: [
        '3 Kg of Garri',
        '1 Carton of Spaghetti',
        '1 Packet of Maggi',
        '½ Carton of Tomatoes',
        '1 Liter of Groundnut Oil',
        '1 Packet of Salt',
      ],
    },
    {
      id: 'p4',
      title: 'Provision Package',
      price: 91200,
      category: 'Food & Groceries',
      type: 'package' as const,
      duration: '12 months',
      frequency: 'Daily',
      description: 'Household provisions - ₦250 daily',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
      packageItems: [
        '1 Bag of Rice',
        '1 Carton of Spaghetti',
        '1 Kg of Garri',
        '1 Liter of Groundnut Oil',
        '1 Packet of Salt',
        '1 Carton of Eggs',
      ],
    },
    {
      id: 'pr1',
      title: 'Premium Bag of Rice (50kg)',
      price: 85000,
      category: 'Food & Groceries',
      type: 'product' as const,
      description: 'High-quality imported rice, perfect for families',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
    },
    {
      id: 'pr2',
      title: 'Bag of Beans (25kg)',
      price: 45000,
      category: 'Food & Groceries',
      type: 'product' as const,
      description: 'Fresh brown beans, farm direct',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
    },
    {
      id: 'pr3',
      title: 'Groundnut Oil (5 Liters)',
      price: 12500,
      category: 'Food & Groceries',
      type: 'product' as const,
      description: 'Pure groundnut oil, perfect for cooking',
      image: 'https://images.unsplash.com/photo-1626645739622-0c5c3b2b9c5e?q=80&w=800',
    },
    {
      id: 'pr4',
      title: 'Frozen Chicken (Carton)',
      price: 35000,
      category: 'Food & Groceries',
      type: 'product' as const,
      description: 'Fresh frozen chicken, 10kg carton',
      image: 'https://images.unsplash.com/photo-1607623812832-9d5d6c6d8f0f?q=80&w=800',
    },
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'packages' && item.type === 'package') ||
      (activeTab === 'products' && item.type === 'product');

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <button
          onClick={handleBack}
          className="flex cursor-pointer mb-2 items-center gap-2 text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span className="font-medium text-sm">Back</span>
        </button>
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Discover Premium Packages & Products
          </h1>
          <p className="text-slate-600 mt-3 text-base sm:text-lg max-w-2xl">
            Choose from flexible contribution packages or premium one-time purchase products
          </p>
        </div>

        {/* Tabs */}
        <BrowseTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Creative Search & Filter Bar */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm border border-slate-100 p-2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
              <input
                type="text"
                placeholder="Search packages and products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent border border-transparent focus:border-emerald-200 rounded-2xl focus:outline-none text-base placeholder:text-slate-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 px-6 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-base w-full md:w-80 cursor-pointer"
            >
              <option>All Categories</option>
              <option>Food & Groceries</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Events</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="mt-8 text-sm text-slate-500 font-medium">
          Showing {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid - Uniform & Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-8">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-xl">No items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
