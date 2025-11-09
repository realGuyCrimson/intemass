'use client';

import { useEffect, useRef, useState, type FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { ClipboardCheck, Image as ImageIcon, LoaderCircle, Percent, Sparkles } from 'lucide-react';

import { analyzeDiagramAction } from '@/app/(dashboard)/actions';
import { type DiagramState } from '@/app/(dashboard)/schemas';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const initialState: DiagramState = {
  status: 'idle',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Analyze Diagram
        </>
      )}
    </Button>
  );
}

const DiagramAnalysisPage: FC = () => {
  const [state, formAction] = useFormState(analyzeDiagramAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string>('');

  useEffect(() => {
    if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.message,
      });
    }
    if (state.status === 'success') {
      toast({
        title: 'Analysis Complete',
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div>
        <PageHeader
          title="Diagram Analysis"
          description="Upload a diagram or drawing to analyze its components and accuracy against a set of expectations. The AI will provide a completeness score and detailed feedback."
        />
        <form ref={formRef} action={formAction} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Diagram</CardTitle>
              <CardDescription>Select an image file (PNG, JPG, etc.) of the diagram you want to analyze.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="diagramFile">Diagram Image</Label>
                    <Input id="diagramFile" name="diagramFile" type="file" accept="image/*" onChange={handleFileChange} />
                    <input type="hidden" name="diagramDataUri" value={dataUri} />
                </div>
                 {preview && (
                    <div className="mt-4 relative aspect-video w-full rounded-md border-2 border-dashed flex items-center justify-center overflow-hidden">
                        <Image src={preview} alt="Diagram preview" layout="fill" objectFit="contain" />
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <CardTitle>Analysis Criteria</CardTitle>
                <CardDescription>List the components you expect to find in the diagram, separated by commas.</CardDescription>
             </CardHeader>
             <CardContent>
                <Label htmlFor="expectedComponents">Expected Components</Label>
                <Textarea
                    id="expectedComponents"
                    name="expectedComponents"
                    placeholder="e.g., Nucleus, Mitochondria, Cell Wall, Cytoplasm..."
                    rows={4}
                />
             </CardContent>
             <CardFooter>
                <SubmitButton />
             </CardFooter>
          </Card>
        </form>
      </div>
      
      <div className="lg:sticky lg:top-20">
         <Card className={cn(
            "transition-opacity duration-500",
            state.status !== 'success' && 'opacity-50'
         )}>
             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck /> Analysis Results
                 </CardTitle>
                 <CardDescription>The AI-generated analysis of the diagram will appear here.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                 {state.status === 'success' && state.data ? (
                     <>
                        <div>
                            <Label className="flex items-center gap-2 text-sm font-semibold mb-2"><Percent /> Completeness Score</Label>
                            <div className="flex items-center gap-4">
                                <Progress value={state.data.completenessScore * 100} className="w-[60%]" />
                                <span className="font-bold text-lg text-primary">{Math.round(state.data.completenessScore * 100)}%</span>
                            </div>
                        </div>
                        <div>
                             <Label className="flex items-center gap-2 text-sm font-semibold mb-2"><Sparkles /> Accuracy Feedback</Label>
                            <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md border">{state.data.accuracyFeedback}</p>
                        </div>
                    </>
                 ) : (
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <ImageIcon className="size-10 mb-2" />
                        <p>Results will be displayed here after analysis.</p>
                     </div>
                 )}
             </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default DiagramAnalysisPage;
