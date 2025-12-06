import React, { useState } from 'react';
import { ArtPiece } from '../types';
import { Copy, Heart, Maximize2 } from 'lucide-react';

interface ArtCardProps {
  piece: ArtPiece;
  onSelect: (piece: ArtPiece) => void;
}

const ArtCard: React.FC<ArtCardProps> = ({ piece, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(piece.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group relative break-inside-avoid mb-6 rounded-xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(piece)}
    >
      <img 
        src={piece.imageUrl} 
        alt={piece.title} 
        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Overlay - Stays dark for text contrast */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg truncate">{piece.title}</h3>
          <p className="text-gray-300 text-xs mt-1 mb-3 line-clamp-2 font-medium">{piece.prompt}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
               <button 
                onClick={copyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-medium text-white transition-colors backdrop-blur-sm border border-white/10"
              >
                {copied ? '已复制！' : <><Copy className="w-3 h-3" /> 提示词</>}
              </button>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
               <span className="flex items-center gap-1 text-xs font-medium">
                 <Heart className="w-3 h-3 fill-current" /> {piece.likes}
               </span>
               <Maximize2 className="w-4 h-4 hover:text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtCard;