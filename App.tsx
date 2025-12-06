import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ArtCard from './components/ArtCard';
import { MOCK_GALLERY, SUGGESTED_TAGS } from './constants';
import { NavTab, ArtPiece } from './types';
import { generateAiImage } from './services/geminiService';
import { X, Upload, Image as ImageIcon, Type, Tag, Plus, Shuffle, Sparkles, Loader2 } from 'lucide-react';

function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>(NavTab.EXPLORE);
  
  // Initialize gallery from localStorage or fall back to mock data
  const [gallery, setGallery] = useState<ArtPiece[]>(() => {
    try {
      const saved = localStorage.getItem('user_art_gallery');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load gallery from localStorage:', error);
    }
    return MOCK_GALLERY;
  });

  const [selectedPiece, setSelectedPiece] = useState<ArtPiece | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [newPiece, setNewPiece] = useState({
    title: '',
    prompt: '',
    imageUrl: '',
    model: 'Gemini 2.5 Flash',
    tags: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist gallery to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user_art_gallery', JSON.stringify(gallery));
  }, [gallery]);

  // Filtering logic
  const filteredGallery = gallery.filter(piece => {
    const query = searchQuery.toLowerCase();
    return (
      piece.title.toLowerCase().includes(query) ||
      piece.prompt.toLowerCase().includes(query) ||
      piece.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleRandomImage = () => {
    const randomSeed = Math.floor(Math.random() * 10000);
    setNewPiece(prev => ({
      ...prev,
      imageUrl: `https://picsum.photos/seed/${randomSeed}/800/800`
    }));
  };

  const handleGeneratePreview = async () => {
    if (!newPiece.prompt) return;
    setIsGeneratingPreview(true);
    try {
      const base64 = await generateAiImage(newPiece.prompt);
      setNewPiece(prev => ({ ...prev, imageUrl: base64 }));
    } catch (error) {
      console.error("Failed to generate preview", error);
      alert("生成预览失败，请稍后重试。");
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPiece(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPiece.title || !newPiece.prompt || !newPiece.imageUrl) return;

    const piece: ArtPiece = {
      id: Date.now().toString(),
      title: newPiece.title,
      prompt: newPiece.prompt,
      imageUrl: newPiece.imageUrl,
      model: newPiece.model,
      tags: newPiece.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: 'You',
      likes: 0
    };

    setGallery([piece, ...gallery]);
    setIsUploadOpen(false);
    setNewPiece({
      title: '',
      prompt: '',
      imageUrl: '',
      model: 'Gemini 2.5 Flash',
      tags: ''
    });
    // Go to explore to see it
    setCurrentTab(NavTab.EXPLORE);
  };

  return (
    <div className="min-h-screen bg-canvas text-dark font-sans selection:bg-primary selection:text-white pb-20">
      <Header 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        onUpload={() => setIsUploadOpen(true)}
      />

      <main>
        {currentTab === NavTab.EXPLORE && (
          <>
            <Hero onSearch={setSearchQuery} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Tags Filter */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                <button 
                  onClick={() => setSearchQuery('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm ${searchQuery === '' ? 'bg-dark text-white border-dark' : 'bg-white text-gray-600 border-border hover:bg-gray-50'}`}
                >
                  全部
                </button>
                {SUGGESTED_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm ${searchQuery === tag ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-border hover:bg-gray-50'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Gallery Grid (Masonry effect using columns) */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredGallery.map(piece => (
                  <ArtCard 
                    key={piece.id} 
                    piece={piece} 
                    onSelect={setSelectedPiece} 
                  />
                ))}
              </div>

              {filteredGallery.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl">未找到匹配的杰作。</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-primary hover:underline"
                  >
                    清除搜索
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-8 right-8 z-40 p-4 bg-primary text-white rounded-full shadow-xl hover:bg-indigo-600 transition-all hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary/30 group flex items-center gap-2"
        aria-label="添加提示词"
      >
        <Plus className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold text-sm">
          发布提示词
        </span>
      </button>

      {/* Detail Modal */}
      {selectedPiece && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedPiece(null)}>
          <div className="bg-card w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
            
            {/* Image Side */}
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4 relative">
              <div className="absolute inset-0 bg-gray-200/50"></div>
              <img 
                src={selectedPiece.imageUrl} 
                alt={selectedPiece.title} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg relative z-10"
              />
            </div>

            {/* Info Side */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto bg-white">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPiece.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">作者：{selectedPiece.author}</p>
                </div>
                <button 
                  onClick={() => setSelectedPiece(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">提示词</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-700 leading-relaxed text-sm">
                    {selectedPiece.prompt}
                  </div>
                </div>

                {selectedPiece.negativePrompt && (
                   <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">负面提示词</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-500 leading-relaxed text-sm">
                      {selectedPiece.negativePrompt}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                     <span className="block text-xs text-gray-500 uppercase">模型</span>
                     <span className="text-gray-900 font-medium">{selectedPiece.model}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                     <span className="block text-xs text-gray-500 uppercase">标签</span>
                     <span className="text-gray-900 font-medium text-sm truncate">
                       {selectedPiece.tags.join(', ')}
                     </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPiece.prompt);
                  }}
                  className="w-full py-3 bg-dark text-white hover:bg-black rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                  复制提示词
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-dark/70 backdrop-blur-md animate-fade-in" onClick={() => setIsUploadOpen(false)}>
           <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                 <Upload className="w-5 h-5 text-primary" /> 分享你的提示词
               </h2>
               <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="w-6 h-6" />
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto">
               <form onSubmit={handleSubmit} className="space-y-5">
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                   <div className="relative">
                     <Type className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input 
                       required
                       type="text" 
                       placeholder="为你的作品起个名字"
                       className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                       value={newPiece.title}
                       onChange={e => setNewPiece({...newPiece, title: e.target.value})}
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">提示词 (Prompt)</label>
                   <textarea 
                     required
                     placeholder="输入生成该图片的完整提示词..."
                     className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                     value={newPiece.prompt}
                     onChange={e => setNewPiece({...newPiece, prompt: e.target.value})}
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">封面图片 (可自动生成)</label>
                   <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                     <div className="relative flex-1 w-full">
                       <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                       <input 
                         required
                         type="text" 
                         placeholder="输入图片链接或上传图片"
                         className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                         value={newPiece.imageUrl}
                         onChange={e => setNewPiece({...newPiece, imageUrl: e.target.value})}
                       />
                       <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-2 top-2 p-1.5 bg-white text-gray-400 hover:text-primary rounded-md border border-gray-200 hover:border-primary transition-all shadow-sm"
                        title="上传本地图片"
                       >
                         <Upload className="w-4 h-4" />
                       </button>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept="image/*"
                         onChange={handleFileUpload}
                       />
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto">
                       <button 
                        type="button"
                        onClick={handleGeneratePreview}
                        disabled={isGeneratingPreview || !newPiece.prompt}
                        className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all disabled:opacity-50 hover:shadow-md"
                        title="使用 AI 生成封面"
                       >
                         {isGeneratingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         AI 生成
                       </button>
                       <button 
                        type="button"
                        onClick={handleRandomImage}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                        title="使用随机图片"
                       >
                         <Shuffle className="w-4 h-4" />
                         随机
                       </button>
                     </div>
                   </div>
                   {newPiece.imageUrl && (
                      <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-h-48 w-full flex justify-center">
                        <img src={newPiece.imageUrl} alt="Preview" className="h-full object-contain" />
                      </div>
                   )}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">模型</label>
                     <select 
                       className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                       value={newPiece.model}
                       onChange={e => setNewPiece({...newPiece, model: e.target.value})}
                     >
                       <option>Gemini 2.5 Flash</option>
                       <option>Midjourney v6</option>
                       <option>Stable Diffusion 3</option>
                       <option>DALL-E 3</option>
                       <option>集梦</option>
                       <option>Nano Banana</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                     <div className="relative">
                       <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                       <input 
                         type="text" 
                         placeholder="赛博朋克, 风景 (逗号分隔)"
                         className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                         value={newPiece.tags}
                         onChange={e => setNewPiece({...newPiece, tags: e.target.value})}
                       />
                     </div>
                   </div>
                 </div>

                 <div className="pt-4 flex gap-3">
                   <button 
                     type="button" 
                     onClick={() => setIsUploadOpen(false)}
                     className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                   >
                     取消
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 py-3 rounded-xl bg-dark text-white font-bold hover:bg-black transition-colors shadow-lg"
                   >
                     发布
                   </button>
                 </div>
               </form>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;