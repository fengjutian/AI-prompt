import React from 'react';
import { Search } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative overflow-hidden bg-canvas pb-16 pt-20 lg:pb-24 lg:pt-32">
      {/* Decorative blobs - lighter for light theme */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute top-32 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          探索提示词工程的<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            艺术魅力
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
          探索数千幅 AI 生成的杰作，复制提示词，并使用我们的高级 AI 工具释放您的创造力。
        </p>

        <div className="mt-10 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-lg hover:shadow-xl"
              placeholder="搜索风格、概念或关键词..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;