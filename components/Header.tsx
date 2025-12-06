import React from 'react';
import { NavTab } from '../types';
import { Palette, Sparkles, Image as ImageIcon, Menu, Upload } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onUpload: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onUpload }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: NavTab.EXPLORE, label: '探索画廊', icon: <Palette className="w-5 h-5" /> },
    { id: NavTab.PROMPT_BUILDER, label: '提示词生成器', icon: <Sparkles className="w-5 h-5" /> },
    { id: NavTab.CREATE_ART, label: '艺术创作', icon: <ImageIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onTabChange(NavTab.EXPLORE)}>
            <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              PromptMuse
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentTab === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <button
              onClick={onUpload}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-dark hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              <Upload className="w-4 h-4" />
              分享提示词
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onUpload}
              className="p-2 rounded-full text-white bg-dark hover:bg-gray-800"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                  currentTab === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onUpload();
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Upload className="w-5 h-5" />
              分享提示词
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;