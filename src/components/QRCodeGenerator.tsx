import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  value: string;
  title?: string;
  size?: number;
  candidateName?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  title = "QR Code",
  size = 200,
  candidateName
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    generateQR();
  }, [value, size]);

  const generateQR = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation using a basic pattern
    // In production, you'd use a library like qrcode
    const qrSize = size;
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Create a simple visual representation
    // This is a placeholder - in production use a proper QR library
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, qrSize, qrSize);

    ctx.fillStyle = '#000000';
    
    // Generate pseudo-random pattern based on value
    const moduleSize = Math.floor(qrSize / 25);
    const hash = simpleHash(value);
    
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Always draw position patterns (corners)
        const isPositionPattern = 
          (row < 7 && col < 7) || // top-left
          (row < 7 && col >= 18) || // top-right
          (row >= 18 && col < 7); // bottom-left

        if (isPositionPattern) {
          // Draw position pattern
          const isOuter = row === 0 || row === 6 || col === 0 || col === 6 ||
                         (row >= 18 && (row === 18 || row === 24)) ||
                         (col >= 18 && (col === 18 || col === 24));
          const isInner = (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
                         (row >= 2 && row <= 4 && col >= 20 && col <= 22) ||
                         (row >= 20 && row <= 22 && col >= 2 && col <= 4);
          
          if (isOuter || isInner) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        } else {
          // Use hash to determine if module should be filled
          const index = row * 25 + col;
          if ((hash[index % hash.length].charCodeAt(0) + index) % 3 === 0) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
    }

    // Add center logo placeholder
    const centerSize = qrSize * 0.2;
    const centerPos = (qrSize - centerSize) / 2;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(qrSize / 2, qrSize / 2, centerSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${centerSize * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RJT', qrSize / 2, qrSize / 2);

    setQrDataUrl(canvas.toDataURL('image/png'));
  };

  const simpleHash = (str: string): string => {
    let hash = '';
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i).toString(16);
    }
    return hash.padEnd(625, '0').substring(0, 625);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `qr-${candidateName || 'rayon-talents'}.png`;
    link.href = qrDataUrl;
    link.click();

    toast({
      title: "QR Code téléchargé!",
      description: "L'image a été sauvegardée.",
    });
  };

  const shareQR = async () => {
    if (!qrDataUrl) return;

    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title,
          text: `Scannez ce QR code pour voir le profil de ${candidateName || 'ce candidat'}`,
          files: [file]
        });
      } else {
        await navigator.clipboard.writeText(value);
        toast({
          title: "Lien copié!",
          description: "Le lien a été copié dans votre presse-papiers.",
        });
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <Card className="white-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCode className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-xl shadow-inner border">
          <canvas ref={canvasRef} className="block" />
        </div>
        
        {candidateName && (
          <p className="text-sm text-gray-600 text-center">
            Scannez pour voter pour <strong>{candidateName}</strong>
          </p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadQR}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" size="sm" onClick={shareQR}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

