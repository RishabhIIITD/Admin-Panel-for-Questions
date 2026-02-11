import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/Button';

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-48">
            <Image 
              src="https://ug-sot-internship-cu.vercel.app/assets/Logo.png" 
              alt="upGrad School of Technology" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost">Create MCQ</Button>
          </Link>
          <Link href="/contest">
            <Button variant="ghost">Create Contest</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
