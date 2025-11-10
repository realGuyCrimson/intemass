
'use client';

import { useMemo } from 'react';
import { useUser } from '@/hooks/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import {
  collection,
  query,
  where,
  orderBy,
  type Firestore,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { PageHeader } from '@/components/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { type GradingResult, type StudentAnswer } from '@/types/models';
import { format } from 'date-fns';

function ResultsTable({
  results,
  studentAnswers,
  isLoading,
  isTeacher,
}: {
  results: (GradingResult & { id: string })[] | null;
  studentAnswers: (StudentAnswer & { id: string })[] | null;
  isLoading: boolean;
  isTeacher: boolean;
}) {
  const enhancedResults = useMemo(() => {
    if (!results || !studentAnswers) return [];
    return results.map((result) => {
      const studentAnswer = studentAnswers.find(
        (sa) => sa.id === result.studentAnswerId
      );
      return {
        ...result,
        studentName: studentAnswer?.studentName || 'Unknown',
        questionId: studentAnswer?.questionId || 'Unknown',
        submittedAt: studentAnswer?.submittedAt,
      };
    });
  }, [results, studentAnswers]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!enhancedResults || enhancedResults.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No results found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {isTeacher && <TableHead>Student</TableHead>}
          <TableHead>Question ID</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Percentage</TableHead>
          <TableHead>Graded On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enhancedResults.map((result) => (
          <TableRow key={result.id}>
            {isTeacher && <TableCell>{result.studentName}</TableCell>}
            <TableCell className="font-mono text-xs">{result.questionId}</TableCell>
            <TableCell className="text-right font-medium">
              {result.totalScore} / {result.maxScore}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant={result.percentage > 80 ? 'default' : 'secondary'}>
                {result.percentage.toFixed(1)}%
              </Badge>
            </TableCell>
            <TableCell>
              {result.gradedAt
                ? format(new Date(result.gradedAt.toString()), 'PPpp')
                : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ResultsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const isTeacher = user?.role === 'teacher';

  const studentAnswersQuery = useMemo(() => {
    if (!firestore || !user) return null;
    if (isTeacher) {
      return query(
        collection(firestore, 'studentAnswers'),
        orderBy('submittedAt', 'desc')
      );
    }
    // For students, find their answers
    return query(
      collection(firestore, 'studentAnswers'),
      where('studentName', '==', user.name),
      orderBy('submittedAt', 'desc')
    );
  }, [firestore, user, isTeacher]);

  const {
    data: studentAnswers,
    isLoading: isLoadingStudentAnswers,
  } = useCollection<StudentAnswer>(studentAnswersQuery);

  const gradingResultsQuery = useMemo(() => {
    if (!firestore) return null;
    if (isTeacher) {
      return query(
        collection(firestore, 'gradingResults'),
        orderBy('gradedAt', 'desc')
      );
    }
    // For students, if we have their answer IDs, query for those results
    if (studentAnswers && studentAnswers.length > 0) {
      const studentAnswerIds = studentAnswers.map((sa) => sa.id);
      return query(
        collection(firestore, 'gradingResults'),
        where('studentAnswerId', 'in', studentAnswerIds)
      );
    }
    // If a student has no answers, we don't need to query for results
    if (studentAnswers && studentAnswers.length === 0) {
      return null;
    }
    // Return null while student answers are loading
    return null;
  }, [firestore, isTeacher, studentAnswers]);

  const {
    data: gradingResults,
    isLoading: isLoadingGradingResults,
  } = useCollection<GradingResult>(gradingResultsQuery);

  const isLoading = isLoadingStudentAnswers || (isTeacher ? isLoadingGradingResults : (studentAnswers === null || isLoadingGradingResults));

  return (
    <>
      <PageHeader
        title="View Results"
        description={
          isTeacher
            ? "Browse and view the grading results for all student submissions."
            : "Review your past submissions and the feedback you've received."
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Grading History</CardTitle>
          <CardDescription>
            A log of all essays that have been graded by the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResultsTable
            results={gradingResults}
            studentAnswers={studentAnswers}
            isLoading={isLoading}
            isTeacher={isTeacher}
          />
        </CardContent>
      </Card>
    </>
  );
}
