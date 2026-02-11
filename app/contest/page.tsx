'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Loader2, Copy, Check } from 'lucide-react';
import type { MCQRecord } from '@/lib/mcq';

export default function ContestPage() {
  const [name, setName] = useState('');
  const [idsInput, setIdsInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [mcqs, setMcqs] = useState<MCQRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMCQs();
  }, []);

  const fetchMCQs = async () => {
    try {
      const res = await fetch('/api/mcqs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMcqs(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load MCQs for validation');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    setError('');
    setJsonOutput('');

    if (!name.trim()) {
      setError('Contest name is required');
      return;
    }

    const ids = idsInput
      .split(/[\n,]+/)
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (ids.length === 0) {
      setError('Please enter at least one MCQ ID');
      return;
    }

    // Validate IDs
    const validIds = new Set(mcqs.map((m) => m.id));
    const invalidIds = ids.filter(id => !validIds.has(id));

    if (invalidIds.length > 0) {
      setError(`Invalid MCQ IDs found: ${invalidIds.join(', ')}`);
      return;
    }

    const contestData = {
      contest_name: name,
      mcq_ids: ids
    };

    setJsonOutput(JSON.stringify(contestData, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create Contest</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Contest Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Math Quiz 1" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ids">MCQ IDs (comma or new line separated)</Label>
          <Textarea 
            id="ids" 
            value={idsInput} 
            onChange={(e) => setIdsInput(e.target.value)} 
            placeholder="Paste MCQ IDs here..."
            className="min-h-[150px] font-mono"
          />
          <p className="text-sm text-muted-foreground">
            Only valid IDs from the database will be accepted.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <Button onClick={handleGenerate} className="w-full">Generate Contest JSON</Button>

        {jsonOutput && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Contest JSON</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </Button>
            </div>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
              {jsonOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
