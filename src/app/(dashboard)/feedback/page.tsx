'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LoaderCircle, Sparkles, ThumbsDown, ThumbsUp, Lightbulb } from 'lucide-react';

import { generateFeedbackAction } from '@/app/(dashboard)/actions';
import { type FeedbackState } from '@/app/(dashboard)/schemas';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const initialState: FeedbackState = {
  status: 'idle',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Generate Feedback
        </>
      )}
    </Button>
  );
}

export default function FeedbackPage() {
  const [state, formAction] = useActionState(generateFeedbackAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Feedback Generation Failed',
        description: state.message,
      });
    }
    if (state.status === 'success') {
      toast({
        title: 'Feedback Generated',
        description: state.message,
      });
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state, toast]);

  return (
    <>
      <PageHeader
        title="Automated Feedback Generation"
        description="Generate personalized feedback reports for students. The AI analysis will identify strengths, weaknesses, and provide specific suggestions for improvement."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form action={formAction} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Essay Details</CardTitle>
                <CardDescription>Provide the essay and some context for a more accurate analysis.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input id="gradeLevel" name="gradeLevel" placeholder="e.g., 10th Grade, A-Level" required />
                  </div>
                  <div>
                    <Label htmlFor="topic">Essay Topic</Label>
                    <Input id="topic" name="topic" placeholder="e.g., The Industrial Revolution" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="essay">Essay Text</Label>
                  <Textarea
                    id="essay"
                    name="essay"
                    placeholder="Paste the student's full essay here..."
                    className="min-h-[250px] text-base"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                 <SubmitButton />
              </CardFooter>
            </Card>
          </form>
        </div>

        <div ref={resultsRef} className="lg:col-span-1 space-y-6 animate-in fade-in-50 duration-500">
            {state.status === 'success' && state.data ? (
                <>
                <h2 className="font-headline text-2xl font-bold lg:hidden">Feedback Results</h2>
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ThumbsUp className="text-green-500" /> Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-sm text-muted-foreground">{state.data.strengths}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ThumbsDown className="text-red-500"/> Weaknesses</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-sm text-muted-foreground">{state.data.weaknesses}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-500" /> Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-sm text-muted-foreground">{state.data.suggestions}</p>
                    </CardContent>
                </Card>
                </>
            ) : (
                <Card className="sticky top-20 h-fit">
                    <CardHeader>
                        <CardTitle>Feedback Report</CardTitle>
                        <CardDescription>Generated feedback will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                            <p>Submit an essay to generate a feedback report.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </>
  );
}
