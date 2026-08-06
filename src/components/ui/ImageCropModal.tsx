import React, { useState, useRef, useCallback, memo } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ImageCropModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export const ImageCropModal = memo(function ImageCropModal({
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 150, height: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current || !imageRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();

    const imgLeftInContainer = imgRect.left - containerRect.left;
    const imgTopInContainer = imgRect.top - containerRect.top;

    const minX = imgLeftInContainer;
    const maxX = imgLeftInContainer + imgRect.width - crop.width;
    const minY = imgTopInContainer;
    const maxY = imgTopInContainer + imgRect.height - crop.height;

    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

    setCrop((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
    }
  };

  const handleConfirmCrop = useCallback(() => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    setIsProcessing(true);

    const imgRect = img.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const imgOffsetX = imgRect.left - containerRect.left;
    const imgOffsetY = imgRect.top - containerRect.top;

    const cropXOnImg = crop.x - imgOffsetX;
    const cropYOnImg = crop.y - imgOffsetY;

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(
      img,
      cropXOnImg * scaleX,
      cropYOnImg * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      400,
      400
    );

    canvas.toBlob(
      (blob) => {
        setIsProcessing(false);
        if (blob) {
          const file = new File([blob], 'avatar-cropped.png', { type: 'image/png' });
          onCropComplete(file);
        }
      },
      'image/png',
      0.95
    );
  }, [crop, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-app-card rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl border border-app-border transition-colors">
        
        <div className="flex justify-between items-center pb-2 border-b border-app-border">
          <h3 className="text-lg font-bold text-app-text">Recortar Foto</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-app-bg text-app-muted hover:text-app-text cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden bg-slate-950 rounded-2xl flex items-center justify-center max-h-87.5 select-none border border-app-border min-h-64 touch-none"
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Para recortar"
            className="max-h-87.5 w-auto object-contain pointer-events-none"
          />

          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              left: `${crop.x}px`,
              top: `${crop.y}px`,
              width: `${crop.width}px`,
              height: `${crop.height}px`,
            }}
            className="absolute border-2 border-app-accent bg-app-accent/20 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-move touch-none flex items-center justify-center"
          >
            <span className="text-xs text-white font-semibold drop-shadow-md pointer-events-none select-none opacity-80">
              Arraste aqui
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-app-bg px-4 py-2.5 rounded-xl border border-app-border transition-colors">
          <span className="text-xs text-app-muted font-semibold shrink-0">Tamanho:</span>
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
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-app-muted hover:text-app-text transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <Button
            type="button"
            onClick={handleConfirmCrop}
            isLoading={isProcessing}
            loadingText="Processando..."
            className="px-6 py-2.5 text-sm"
          >
            Confirmar e Enviar
          </Button>
        </div>

      </div>
    </div>
  );
});