'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { Copy, FileUp, LoaderCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ocrAction } from '@/app/(dashboard)/actions';
import { type OcrState } from '@/app/(dashboard)/schemas';

const initialState: OcrState = {
  status: 'idle',
  message: '',
};

export default function OcrPage() {
  const [state, formAction] = useActionState(ocrAction, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [preview, setPreview] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string>('');
  
  const isProcessing = isPending;

  useEffect(() => {
    if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'OCR Failed',
        description: state.message,
      });
    }
    if (state.status === 'success') {
      toast({
        title: 'OCR Complete',
        description: 'Text has been extracted from the image.',
      });
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setDataUri(result);
        
        startTransition(() => {
          const formData = new FormData();
          formData.append('imageDataUri', result);
          formAction(formData);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyText = () => {
    if (state.data?.extractedText) {
      navigator.clipboard.writeText(state.data.extractedText);
      toast({
        title: 'Copied to Clipboard',
        description: 'The extracted text has been copied.',
      });
    }
  };

  const extractedText = state.data?.extractedText || '';

  return (
    <>
      <PageHeader
        title="OCR for Handwritten Submissions"
        description="Upload an image of a handwritten or scanned essay. The system will use Optical Character Recognition (OCR) to extract the text, making it ready for AI analysis."
      />
      <form>
        <input type="hidden" name="imageDataUri" value={dataUri} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Essay Image</CardTitle>
              <CardDescription>
                Select a clear image of a handwritten essay.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ocrFile" className="sr-only">
                  Essay Image
                </Label>
                <Input
                  id="ocrFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </div>
              <div
                className={cn(
                  'relative aspect-[3/4] w-full rounded-md border-2 border-dashed flex items-center justify-center overflow-hidden',
                  !preview && 'p-8 text-center text-muted-foreground'
                )}
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Essay preview"
                    fill
                    objectFit="contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileUp className="size-8" />
                    <span>Image preview will appear here</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Text</CardTitle>
              <CardDescription>
                The text recognized from the image will be displayed below.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              {isProcessing && (
                <div className="absolute inset-0 z-10 bg-background/80 flex flex-col items-center justify-center rounded-md">
                  <LoaderCircle className="size-8 animate-spin text-primary mb-4" />
                  <p className="font-semibold">Processing Image...</p>
                  <p className="text-sm text-muted-foreground">
                    This may take a moment.
                  </p>
                </div>
              )}
              <Textarea
                value={extractedText}
                readOnly
                placeholder="Extracted text will appear here..."
                className="min-h-[300px] lg:min-h-[400px] text-base"
              />
              {extractedText && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={handleCopyText}
                  aria-label="Copy text"
                  type="button"
                >
                  <Copy className="size-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </>
  );
}
