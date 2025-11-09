
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookMarked,
  BotMessageSquare,
  ClipboardCheck,
  LayoutDashboard,
  ScanText,
  PlusCircle,
  FileQuestion,
  View,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IntomassIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create-question', label: 'Create Question', icon: PlusCircle },
  { href: '/submit-answer', label: 'Submit Answer', icon: FileQuestion },
  { href: '/results', label: 'View Results', icon: View },
  { href: '/essay-scoring', label: 'Essay Scoring', icon: BookMarked },
  { href: '/feedback', label: 'AI Feedback', icon: BotMessageSquare },
  { href: '/diagram-analysis', label: 'Diagram Analysis', icon: ClipboardCheck },
  { href: '/ocr', label: 'OCR Submission', icon: ScanText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <IntomassIcon className="size-7 text-primary" />
            <h1 className="font-headline text-xl font-semibold">INTEMASS AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <Avatar className="size-9">
              <AvatarImage
                src="https://picsum.photos/seed/teacher/100/100"
                alt="Teacher avatar"
                data-ai-hint="person face"
              />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col group-data-[state=expanded]:flex">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Dr. Evelyn Reed
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                e.reed@cambridge.edu
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             {/* Can add breadcrumbs or page title here later */}
          </div>
          <div className='flex items-center gap-4'>
            <Button asChild>
                <Link href="/create-question">Create Question</Link>
            </Button>
             {/* User menu or other actions */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
        <footer className="p-4 text-center text-sm text-muted-foreground">
            Powered by Gemini AI
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
