'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Trash2, Edit, Eye, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { MCQRecord } from '@/lib/mcq';

export default function Dashboard() {
  const [mcqs, setMcqs] = useState<MCQRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMCQs();
  }, []);

  const fetchMCQs = async () => {
    try {
      const res = await fetch('/api/mcqs');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch');
      }
      
      setMcqs(data);
    } catch (error: unknown) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Failed to fetch MCQs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this MCQ?')) return;
    
    try {
      const res = await fetch(`/api/mcqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setMcqs((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete MCQ');
    }
  };

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredMCQs = mcqs.filter(mcq => {
    const searchLower = search.toLowerCase();
    return (
      mcq.id?.toLowerCase().includes(searchLower) ||
      mcq.subject?.toLowerCase().includes(searchLower) ||
      mcq.topic?.toLowerCase().includes(searchLower) ||
      mcq.question?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="text-destructive font-semibold text-lg">Error Loading MCQs</div>
        <p className="text-muted-foreground max-w-md">{error}</p>
        <p className="text-sm text-muted-foreground">
          Please check your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file and ensure Google Sheets credentials are correct.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">MCQ Dashboard</h1>
        <Link href="/create">
          <Button>Create New MCQ</Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by ID, Subject, Topic, or Question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Subject</th>
              <th className="p-4 font-medium">Topic</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Difficulty</th>
              <th className="p-4 font-medium w-1/3">Question</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMCQs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-muted-foreground">
                  No MCQs found.
                </td>
              </tr>
            ) : (
              filteredMCQs.map((mcq) => (
                <tr key={mcq.id} className="border-t hover:bg-muted/50">
                  <td className="p-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span title={mcq.id}>{mcq.id.slice(0, 8)}...</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(mcq.id)}
                        title="Copy ID"
                      >
                        {copiedId === mcq.id ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </td>
                  <td className="p-4">{mcq.subject}</td>
                  <td className="p-4">{mcq.topic}</td>
                  <td className="p-4">{mcq.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      mcq.difficulty === 'Very Easy' ? 'bg-green-100 text-green-800' :
                      mcq.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                      mcq.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      mcq.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mcq.difficulty || 'Medium'}
                    </span>
                  </td>
                  <td className="p-4 truncate max-w-xs">{mcq.question}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => router.push(`/view/${mcq.id}`)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => router.push(`/edit/${mcq.id}`)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive" 
                      onClick={() => handleDelete(mcq.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
