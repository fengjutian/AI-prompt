import React, { useState } from 'react';
import { Wand2, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { generateDetailedPrompt } from '../services/geminiService';
import { PromptResponse } from '../types';

interface PromptBuilderProps {
  onUsePrompt: (prompt: string) => void;
}

const PromptBuilder: React.FC<PromptBuilderProps> = ({ onUsePrompt }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEnhance = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateDetailedPrompt(topic);
      setResult(data);
    } catch (err) {
      setError("优化提示词失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.enhancedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-10 shadow-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI 提示词构建师</h2>
          <p className="text-gray-500">将简单的想法转化为专业级的艺术提示词。</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              您的想法
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：一只在太空中吃披萨的猫..."
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
            />
          </div>

          <button
            onClick={handleEnhance}
            disabled={isLoading || !topic.trim()}
            className="w-full py-4 rounded-xl bg-dark text-white font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {isLoading ? '优化中...' : '优化提示词'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-10 animate-fade-in">
            <div className="bg-gray-50 border border-border rounded-xl p-6 relative group">
              <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">优化结果</h3>
              <p className="text-gray-800 leading-relaxed text-lg">{result.enhancedPrompt}</p>
              
              <div className="mt-6 flex flex-wrap gap-4 border-t border-gray-200 pt-4">
                <div className="flex-1 min-w-[200px]">
                  <span className="text-xs text-gray-500 uppercase font-bold">负面提示词</span>
                  <p className="text-gray-600 text-sm mt-1">{result.negativePrompt}</p>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <span className="text-xs text-gray-500 uppercase font-bold">建议风格</span>
                  <p className="text-primary text-sm mt-1 font-medium">{result.suggestedModel}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg text-gray-600 border border-gray-200 shadow-sm transition-colors"
                  title="复制到剪贴板"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => onUsePrompt(result.enhancedPrompt)}
                className="text-primary hover:text-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-1 mx-auto"
              >
                使用此提示词生成艺术作品 &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptBuilder;