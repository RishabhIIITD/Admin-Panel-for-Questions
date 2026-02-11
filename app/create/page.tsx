'use client';

import MCQForm from '@/components/MCQForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, Copy, PlusCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { MCQPayload } from '@/lib/mcq';

export default function CreateMCQPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMcqId, setCreatedMcqId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleSubmit = async (data: MCQPayload) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/mcqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create MCQ');
      
      const newMcq = await res.json();
      setCreatedMcqId(newMcq.id);

    } catch (error) {
      console.error(error);
      alert('Failed to create MCQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (createdMcqId) {
      try {
        await navigator.clipboard.writeText(createdMcqId);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleCreateAnother = () => {
    setCreatedMcqId(null);
    setCopiedId(false);
    // Optional: reload to clear form state if MCQForm doesn't reset automatically
    // But since we are unmounting MCQForm when showing success, remounting it will reset it.
  };

  if (createdMcqId) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-2xl text-center">
        <div className="bg-card border rounded-lg p-8 shadow-sm flex flex-col items-center space-y-6">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground">MCQ Created Successfully!</h2>
          
          <div className="w-full bg-muted/50 p-4 rounded-lg border flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">MCQ ID</span>
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono bg-background px-3 py-1 rounded border">{createdMcqId}</code>
              <Button variant="outline" size="icon" onClick={handleCopy} title="Copy ID">
                {copiedId ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            {copiedId && <span className="text-xs text-green-600 font-medium">Copied to clipboard!</span>}
          </div>

          <div className="flex gap-4 w-full justify-center pt-4">
            <Button variant="outline" onClick={() => router.push('/')} className="flex-1 max-w-[200px]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            <Button onClick={handleCreateAnother} className="flex-1 max-w-[200px]">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New MCQ</h1>
      <MCQForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
