
'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BarChart,
  BookOpen,
  CheckCircle,
  FileText,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar as RechartsBar,
  CartesianGrid,
} from 'recharts';

import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const scoreDistributionData = [
  { range: '0-20', count: 5, fill: 'hsl(var(--chart-1))' },
  { range: '21-40', count: 12, fill: 'hsl(var(--chart-2))' },
  { range: '41-60', count: 25, fill: 'hsl(var(--chart-3))' },
  { range: '61-80', count: 30, fill: 'hsl(var(--chart-4))' },
  { range: '81-100', count: 15, fill: 'hsl(var(--chart-5))' },
];

const recentSubmissions = [
  {
    id: 1,
    student: 'Liam Johnson',
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-1')?.imageUrl || '',
    assignment: 'Unit 4.14: Business Marketing',
    score: 88,
    status: 'Graded',
  },
  {
    id: 2,
    student: 'Olivia Smith',
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-2')?.imageUrl || '',
    assignment: 'IB History: The Cold War',
    score: 92,
    status: 'Graded',
  },
  {
    id: 3,
    student: 'Noah Williams',
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-3')?.imageUrl || '',
    assignment: 'A-Level Biology: Cell Structure',
    score: 76,
    status: 'Graded',
  },
  {
    id: 4,
    student: 'Emma Brown',
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-4')?.imageUrl || '',
    assignment: 'CBSE Physics: Laws of Motion',
    score: 65,
    status: 'Graded',
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="text-center">
         <PageHeader
            title="Automated Essay Grading in 30 Seconds"
            description="INTEMASS AI leverages cutting-edge semantic analysis to provide fast, consistent, and insightful feedback on written work."
            className="items-center"
        />
        <div className="flex justify-center gap-4">
            <Button asChild size="lg">
                <Link href="/create-question">I'm a Teacher - Create Question</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
                <Link href="/submit-answer">I'm a Student - Submit Answer</Link>
            </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submissions Graded
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Grading Time
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~45s</div>
            <p className="text-xs text-muted-foreground">
              vs. 15-20 mins manually
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+92.3%</div>
            <p className="text-xs text-muted-foreground">
              Grading speed vs. manual
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Score Distribution
            </CardTitle>
            <CardDescription>
              Distribution of scores across all recent assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <ResponsiveContainer>
                <RechartsBarChart data={scoreDistributionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                  <RechartsBar dataKey="count" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                A list of the most recent essays graded by the system.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <a href="#">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                           <AvatarImage src={submission.avatar} alt="Avatar" data-ai-hint="person face" />
                           <AvatarFallback>{submission.student.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{submission.student}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={submission.score > 80 ? 'default' : 'secondary'}
                        className="font-semibold"
                      >
                        {submission.score}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    