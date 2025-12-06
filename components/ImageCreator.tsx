import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { generateAiImage } from '../services/geminiService';

interface ImageCreatorProps {
  initialPrompt?: string;
}

const ImageCreator: React.FC<ImageCreatorProps> = ({ initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateAiImage(prompt);
      setGeneratedImage(base64Image);
    } catch (err) {
      setError("图片生成失败。请确保您的 API 密钥有效并有权访问图像模型。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              创作工作室
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  提示词
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述您的想象..."
                  className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-700 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                {isGenerating ? '构思中...' : '生成图片'}
              </button>
              
              <div className="text-xs text-gray-500 text-center">
                由 Gemini 2.5 Flash Image 驱动
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border rounded-2xl p-2 h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
            
            {/* Checkerboard pattern for transparency indication */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

            {!generatedImage && !isGenerating && !error && (
              <div className="text-center p-10 relative z-10">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">准备创作</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                  在左侧输入提示词并点击生成，见证奇迹时刻。
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="text-center z-10">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-600 animate-pulse">正在合成像素...</p>
              </div>
            )}

            {error && (
              <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100 max-w-md relative z-10">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-red-700 font-medium">生成错误</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {generatedImage && !isGenerating && (
              <div className="relative w-full h-full flex items-center justify-center group z-10">
                <img 
                  src={generatedImage} 
                  alt="Generated Art" 
                  className="max-w-full max-h-[700px] object-contain rounded-lg shadow-2xl"
                />
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={generatedImage} 
                    download={`promptmuse-${Date.now()}.png`}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-gray-900 shadow-lg hover:bg-white transition-colors border border-gray-200"
                  >
                    <Download className="w-4 h-4" />
                    保存
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCreator;