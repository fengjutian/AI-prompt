import { PromptResponse } from '../types';

// 移除 GoogleGenAI 依赖，改为本地模拟实现
// 这样可以避免因 API Key 问题导致的错误

// 辅助函数：模拟网络延迟
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 1. 模拟提示词优化 (不再调用 API)
export const generateDetailedPrompt = async (topic: string): Promise<PromptResponse> => {
  await simulateDelay(1500); // 模拟思考时间

  return {
    enhancedPrompt: `[AI 模拟优化] 一个关于 "${topic}" 的极具艺术感的画面，具有电影般的照明、复杂的纹理细节、体积光，采用 8k 分辨率渲染，构图完美，细节丰富，充满想象力。`,
    negativePrompt: "模糊、低质量、扭曲、水印、文字、多余的手指、糟糕的解剖结构、过曝、欠曝",
    suggestedModel: "Midjourney v6 (模拟推荐)"
  };
};

// 2. 模拟图片生成 (不再调用 API)
export const generateAiImage = async (prompt: string): Promise<string> => {
  await simulateDelay(2000); // 模拟生成时间

  // 返回一个基于随机种子的 Picsum 图片来模拟生成的艺术图
  // 实际项目中，这里不再调用付费 API
  const randomSeed = Math.floor(Math.random() * 100000) + prompt.length;
  return `https://picsum.photos/seed/${randomSeed}/1024/1024`;
};