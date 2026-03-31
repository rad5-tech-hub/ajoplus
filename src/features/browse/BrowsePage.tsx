// src/features/browse/BrowsePage.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import BrowseTabs from './components/BrowseTabs';
import ProductCard from './components/ProductCard';
import CustomerNavbar from '../customer/components/CustomerNavbar';

const BrowsePage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'products'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Mock data with real Unsplash images (kept only here)
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
      <CustomerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Browse All Packages & Products
          </h1>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Choose from contribution packages or one-time purchase products
          </p>
        </div>

        <BrowseTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-4 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search packages and products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 text-base"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 px-5 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-base w-full md:w-72"
          >
            <option>All Categories</option>
            <option>Food & Groceries</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
            <option>Events</option>
          </select>
        </div>

        <p className="mt-8 text-sm text-slate-500">Showing {filteredItems.length} items</p>

        {/* Uniform Height Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;