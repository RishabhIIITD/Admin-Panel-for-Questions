import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import Preview from '@/components/Preview';
import { Loader2 } from 'lucide-react';
import { mcqPayloadSchema, type MCQPayload } from '@/lib/mcq';

interface MCQFormProps {
  initialData?: MCQPayload & { id?: string };
  onSubmit: (data: MCQPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export default function MCQForm({ initialData, onSubmit, isSubmitting = false }: MCQFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<MCQPayload>({
    resolver: zodResolver(mcqPayloadSchema),
    defaultValues: initialData || {
      subject: '',
      topic: '',
      subtopic: '',
      type: 'MCQ',
      difficulty: 'Medium',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A',
      explanation: '',
    },
  });

  const watchedValues = useWatch({ control });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register('subject')} placeholder="e.g. Physics" />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" {...register('topic')} placeholder="e.g. Kinematics" />
              {errors.topic && <p className="text-red-500 text-sm">{errors.topic.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtopic">Subtopic</Label>
              <Input id="subtopic" {...register('subtopic')} placeholder="e.g. Projectile Motion" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input id="type" {...register('type')} placeholder="e.g. Single Correct" />
              {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <select
              id="difficulty"
              {...register('difficulty')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Very Easy">Very Easy</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Challenge">Challenge</option>
            </select>
            {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question (Markdown + LaTeX)</Label>
            <Textarea id="question" {...register('question')} className="min-h-[150px]" placeholder="Write your question here..." />
            {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="optionA">Option A</Label>
              <Textarea id="optionA" {...register('optionA')} placeholder="Option A text..." />
              {errors.optionA && <p className="text-red-500 text-sm">{errors.optionA.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionB">Option B</Label>
              <Textarea id="optionB" {...register('optionB')} placeholder="Option B text..." />
              {errors.optionB && <p className="text-red-500 text-sm">{errors.optionB.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionC">Option C</Label>
              <Textarea id="optionC" {...register('optionC')} placeholder="Option C text..." />
              {errors.optionC && <p className="text-red-500 text-sm">{errors.optionC.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionD">Option D</Label>
              <Textarea id="optionD" {...register('optionD')} placeholder="Option D text..." />
              {errors.optionD && <p className="text-red-500 text-sm">{errors.optionD.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctOption">Correct Option</Label>
            <select
              id="correctOption"
              {...register('correctOption')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
            {errors.correctOption && <p className="text-red-500 text-sm">{errors.correctOption.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea id="explanation" {...register('explanation')} className="min-h-[100px]" placeholder="Detailed explanation..." />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save MCQ'}
          </Button>
        </form>
      </div>

      <div className="space-y-6 border-l pl-8 sticky top-6 h-fit max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        
        <div className="space-y-6">
          <div className="p-4 border rounded-lg shadow-sm bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Question</h3>
            <Preview content={watchedValues.question || '*Question preview will appear here*'} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Options</h3>
            <div className={`p-3 border rounded-md ${watchedValues.correctOption === 'A' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}`}>
              <span className="font-bold mr-2">A.</span>
              <div className="inline-block align-top w-[calc(100%-2rem)]">
                <Preview content={watchedValues.optionA || 'Option A'} />
              </div>
            </div>
            <div className={`p-3 border rounded-md ${watchedValues.correctOption === 'B' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}`}>
              <span className="font-bold mr-2">B.</span>
              <div className="inline-block align-top w-[calc(100%-2rem)]">
                <Preview content={watchedValues.optionB || 'Option B'} />
              </div>
            </div>
            <div className={`p-3 border rounded-md ${watchedValues.correctOption === 'C' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}`}>
              <span className="font-bold mr-2">C.</span>
              <div className="inline-block align-top w-[calc(100%-2rem)]">
                <Preview content={watchedValues.optionC || 'Option C'} />
              </div>
            </div>
            <div className={`p-3 border rounded-md ${watchedValues.correctOption === 'D' ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}`}>
              <span className="font-bold mr-2">D.</span>
              <div className="inline-block align-top w-[calc(100%-2rem)]">
                <Preview content={watchedValues.optionD || 'Option D'} />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg shadow-sm bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Explanation</h3>
            <Preview content={watchedValues.explanation || '*Explanation preview will appear here*'} />
          </div>
        </div>
      </div>
    </div>
  );
}
