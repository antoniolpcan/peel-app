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
    const container = containerRef.current;
    if (!img || !container) return;

    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const imgOffsetX = imgRect.left - containerRect.left;
    const imgOffsetY = imgRect.top - containerRect.top;

    const cropXOnImg = crop.x - imgOffsetX;
    const cropYOnImg = crop.y - imgOffsetY;

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      img,
      cropXOnImg * scaleX,
      cropYOnImg * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      300,
      300
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'avatar-cropped.png', { type: 'image/png' });
        onCropComplete(file);
      }
    }, 'image/png', 0.95);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-app-card rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl border border-app-border transition-colors">
        
        <div className="flex justify-between items-center pb-2 border-b border-app-border">
          <h3 className="text-lg font-bold text-app-text">Recortar Foto</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-app-bg text-app-muted hover:text-app-text cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative overflow-hidden bg-slate-950 rounded-2xl flex items-center justify-center max-h-87.5 select-none cursor-crosshair border border-app-border min-h-64"
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
            className="absolute border-2 border-app-accent bg-app-accent/20 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] cursor-move transition-all duration-75"
          >
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold drop-shadow-md pointer-events-none select-none">
              Arraste aqui
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-app-bg px-4 py-2 rounded-xl border border-app-border transition-colors">
          <span className="text-xs text-app-muted font-semibold">Tamanho:</span>
          <input
            type="range"
            min="80"
            max="250"
            value={crop.width}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCrop((prev) => ({ ...prev, width: val, height: val }));
            }}
            className="grow cursor-pointer accent-app-accent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-app-muted hover:text-app-text transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="bg-app-accent text-app-accent-text font-medium px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all shadow-md cursor-pointer"
          >
            Confirmar e Enviar
          </button>
        </div>

      </div>
    </div>
  );
}