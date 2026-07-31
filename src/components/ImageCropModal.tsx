import { useState, useRef } from 'react';

interface ImageCropModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export function ImageCropModal({ imageSrc, onClose, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    newX = Math.max(0, Math.min(newX, containerRect.width - crop.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - crop.height));

    setCrop((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleConfirmCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'avatar-cropped.png', { type: 'image/png' });
        onCropComplete(file);
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl border border-slate-100">
        
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">✂️ Recortar Foto de Perfil</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative overflow-hidden bg-slate-900 rounded-2xl flex items-center justify-center max-h-87.5 select-none cursor-crosshair"
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Para recortar"
            className="max-h-87.5 w-auto object-contain pointer-events-none"
          />

          <div
            onMouseDown={handleMouseDown}
            style={{
              left: `${crop.x}px`,
              top: `${crop.y}px`,
              width: `${crop.width}px`,
              height: `${crop.height}px`,
            }}
            className="absolute border-2 border-indigo-500 bg-indigo-500/20 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move"
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium drop-shadow-md">
              Arraste aqui
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-semibold">Tamanho:</span>
          <input
            type="range"
            min="80"
            max="250"
            value={crop.width}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCrop((prev) => ({ ...prev, width: val, height: val }));
            }}
            className="grow cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmCrop}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 cursor-pointer"
          >
            Confirmar e Enviar
          </button>
        </div>

      </div>
    </div>
  );
}