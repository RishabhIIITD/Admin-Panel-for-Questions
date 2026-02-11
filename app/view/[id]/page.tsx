'use client';

import { useRouter, useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Loader2, ArrowLeft, Edit, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Preview from '@/components/Preview';
import type { MCQRecord } from '@/lib/mcq';

export default function ViewMCQPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [mcq, setMcq] = useState<MCQRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  const fetchMCQ = useCallback(async () => {
    try {
      const res = await fetch(`/api/mcqs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMcq(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load MCQ');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchMCQ();
    }
  }, [id, fetchMCQ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!mcq) return null;

  const options: Array<{ key: keyof MCQRecord; label: MCQRecord['correctOption'] }> = [
    { key: 'optionA', label: 'A' },
    { key: 'optionB', label: 'B' },
    { key: 'optionC', label: 'C' },
    { key: 'optionD', label: 'D' },
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-6 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">View MCQ Details</h1>
        <Button onClick={() => router.push(`/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit MCQ
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-8 shadow-sm">
        
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">ID</span>
                <div className="flex items-center gap-2 font-mono text-sm">
                    {id}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                        {copiedId ? <Check className="h-3 w-3 text-green-500"/> : <Copy className="h-3 w-3"/>}
                    </Button>
                </div>
            </div>
            <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Subject / Topic</span>
                <div className="font-medium">{mcq.subject} <span className="text-muted-foreground mx-1">•</span> {mcq.topic}</div>
            </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Type</span>
                <div className="font-medium">{mcq.type}</div>
            </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Difficulty</span>
                <div className="font-medium capitalize">{mcq.difficulty}</div>
            </div>
        </div>

        {/* Question */}
        <div>
            <h3 className="text-lg font-semibold mb-2">Question</h3>
            <div className="p-4 border rounded-md bg-background">
                <Preview content={mcq.question} />
            </div>
        </div>

        {/* Options */}
        <div>
            <h3 className="text-lg font-semibold mb-2">Options</h3>
            <div className="grid grid-cols-1 gap-3">
                {options.map(({ key, label }) => (
                    mcq[key] && (
                        <div key={key} className={`p-3 border rounded-md flex items-start gap-3 ${mcq.correctOption === label ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold shrink-0 mt-0.5 ${mcq.correctOption === label ? 'bg-green-500 text-white border-green-500' : 'bg-muted text-muted-foreground'}`}>
                                {label}
                            </div>
                            <div className="w-full">
                                <Preview content={mcq[key]} />
                            </div>
                            {mcq.correctOption === label && <Check className="h-5 w-5 text-green-500 shrink-0" />}
                        </div>
                    )
                ))}
            </div>
        </div>

        {/* Explanation */}
        {mcq.explanation && (
            <div>
                <h3 className="text-lg font-semibold mb-2">Explanation</h3>
                <div className="p-4 border rounded-md bg-muted/30">
                    <Preview content={mcq.explanation} />
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
