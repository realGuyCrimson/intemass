
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageHeader } from '@/components/page-header';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { type CreateQuestionStep1, createQuestionStep1Schema } from '../schemas';


export default function CreateQuestionPage() {
    const form = useForm<CreateQuestionStep1>({
        resolver: zodResolver(createQuestionStep1Schema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            subject: '',
            curriculum: '',
            maxPoints: 10,
            questionText: '',
        }
    });

    function onSubmit(data: CreateQuestionStep1) {
        console.log(data);
        // Here we would proceed to the next step
    }

  return (
    <>
      <PageHeader
        title="Create a New Question (Step 1 of 3)"
        description="Start by providing the basic details for your question. You'll define the ideal answer and marking scheme in the next steps."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                    <CardDescription>
                        Fill in the core information for the question. This will be displayed to students.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Question Title / Prompt</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Explain the main causes of World War I." {...field} />
                                </FormControl>
                                <FormDescription>
                                    A concise title that summarizes the question.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="business-studies">Business Studies</SelectItem>
                                        <SelectItem value="chemistry">Chemistry</SelectItem>
                                        <SelectItem value="physics">Physics</SelectItem>
                                        <SelectItem value="biology">Biology</SelectItem>
                                        <SelectItem value="history">History</SelectItem>
                                        <SelectItem value="economics">Economics</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="curriculum"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Curriculum</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a curriculum" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="cbse">CBSE</SelectItem>
                                        <SelectItem value="cambridge-o-level">Cambridge O-Level</SelectItem>
                                        <SelectItem value="cambridge-a-level">Cambridge A-Level</SelectItem>
                                        <SelectItem value="ib">IB (International Baccalaureate)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxPoints"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Maximum Points</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="questionText"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Question Text</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Provide the full text of the question, including any context, sources, or specific instructions for the student."
                                    className="min-h-[150px]"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                   You can use markdown for formatting.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Save Draft</Button>
                    <Button type="submit">Next: Standard Answer</Button>
                </CardFooter>
            </Card>
        </form>
      </Form>
    </>
  );
}
