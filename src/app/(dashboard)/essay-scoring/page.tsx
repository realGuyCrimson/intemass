'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { BotMessageSquare, LoaderCircle, Sparkles, Star, ThumbsDown, ThumbsUp } from 'lucide-react';

import { scoreEssayAction, type EssayScoringState } from '@/app/(dashboard)/actions';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const initialState: EssayScoringState = {
  status: 'idle',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Scoring Essay...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Get AI Score
        </>
      )}
    </Button>
  );
}

export default function EssayScoringPage() {
  const [state, formAction] = useFormState(scoreEssayAction, initialState);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Scoring Failed',
        description: state.message,
      });
    }
    if (state.status === 'success') {
      toast({
        title: 'Scoring Complete',
        description: state.message,
      });
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <>
      <PageHeader
        title="AI-Powered Essay Scoring"
        description="Leverage advanced transformer models to semantically analyze essays. Provide the essay text and the marking scheme to receive a score, feedback, strengths, and weaknesses."
      />

      <form ref={formRef} action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Essay Text</CardTitle>
              <CardDescription>
                Paste the student's essay into the text area below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="essayText" className="sr-only">
                Essay Text
              </Label>
              <Textarea
                id="essayText"
                name="essayText"
                placeholder="Start typing or paste the essay here..."
                className="min-h-[300px] text-base"
                required
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mark Scheme</CardTitle>
              <CardDescription>
                Provide the marking scheme or rubric for the AI to follow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="markScheme" className="sr-only">
                Mark Scheme
              </Label>
              <Textarea
                id="markScheme"
                name="markScheme"
                placeholder="Describe the criteria for scoring, points allocation, etc..."
                className="min-h-[300px] text-base"
                required
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <SubmitButton />
          </CardContent>
        </Card>
      </form>

      {state.status === 'success' && state.data && (
        <div ref={resultsRef} className="mt-12 animate-in fade-in-50 duration-500">
          <h2 className="font-headline text-2xl font-bold mb-6">Scoring Results</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overall Score</span>
                  <Badge className="text-lg" variant="default">{state.data.score}/100</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This score is based on the provided mark scheme and a semantic analysis of the essay content.</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
            
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BotMessageSquare /> Detailed Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.data.feedback}</p>
                </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
