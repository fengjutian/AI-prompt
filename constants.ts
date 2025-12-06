import { ArtPiece } from './types';

export const MOCK_GALLERY: ArtPiece[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/seed/cyberpunk/600/800',
    title: '霓虹东京漂移者',
    prompt: 'Cyberpunk street samurai, neon lights, rain-slicked streets of futuristic Tokyo, volumetric lighting, unreal engine 5 render, highly detailed, 8k, ray tracing, cinematic shot',
    negativePrompt: 'blurry, low quality, deformed, ugly, bad anatomy',
    model: 'Midjourney v6',
    tags: ['赛博朋克', '科幻', '角色'],
    author: 'NeoArtist',
    likes: 1240
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/seed/nature/600/600',
    title: '空灵森林之灵',
    prompt: 'A mystical deer with antlers made of cherry blossom branches, standing in a bioluminescent forest, magical atmosphere, soft glow, fantasy art, digital painting, artstation style',
    model: 'Stable Diffusion XL',
    tags: ['奇幻', '自然', '动物'],
    author: 'ForestWalker',
    likes: 890
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/seed/arch/600/900',
    title: '黑曜石城堡',
    prompt: 'Grand gothic architecture, obsidian castle floating in the sky, clouds, dramatic lighting, wide angle, matte painting, concept art, epic scale, lord of the rings style',
    model: 'DALL-E 3',
    tags: ['建筑', '奇幻', '风景'],
    author: 'BuildMaster',
    likes: 2100
  },
  {
    id: '4',
    imageUrl: 'https://picsum.photos/seed/portrait/600/750',
    title: '维多利亚蒸汽朋克',
    prompt: 'Portrait of a steampunk inventor with brass goggles, intricate gear mechanisms in background, victorian clothing, oil painting style, warm tones, detailed texture',
    model: 'Midjourney v5.2',
    tags: ['蒸汽朋克', '肖像', '复古'],
    author: 'GearHead',
    likes: 1543
  },
  {
    id: '5',
    imageUrl: 'https://picsum.photos/seed/abstract/600/600',
    title: '量子流动',
    prompt: 'Abstract representation of quantum mechanics, fluid shapes, iridescent colors, liquid metal, 3d render, octane render, abstract art, surrealism',
    model: 'Stable Diffusion 1.5',
    tags: ['抽象', '3D', '超现实'],
    author: 'QuantumMind',
    likes: 670
  },
  {
    id: '6',
    imageUrl: 'https://picsum.photos/seed/space/600/400',
    title: '星云巡洋舰',
    prompt: 'A sleek spaceship flying through a colorful nebula, stars, cosmic dust, cinematic lighting, sci-fi concept art, realistic, high detail',
    model: 'Midjourney v6',
    tags: ['太空', '科幻', '载具'],
    author: 'StarVoyager',
    likes: 3200
  }
];

export const SUGGESTED_TAGS = ['赛博朋克', '奇幻', '肖像', '风景', '动漫', '3D 渲染', '抽象', '摄影'];