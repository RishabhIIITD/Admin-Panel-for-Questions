'use client';

import MCQForm from '@/components/MCQForm';
import { useRouter, useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { MCQPayload, MCQRecord } from '@/lib/mcq';

export default function EditMCQPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [mcq, setMcq] = useState<MCQRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: MCQPayload) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/mcqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update MCQ');

      alert('MCQ updated successfully!');
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Failed to update MCQ');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit MCQ</h1>
      <MCQForm initialData={mcq} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
