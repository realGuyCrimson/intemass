

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
import { UserProvider, useUser } from '@/hooks/use-user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { USERS } from '@/lib/users';
import { FirebaseClientProvider } from '@/firebase';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, role: ['teacher', 'student'] },
  { href: '/create-question', label: 'Create Question', icon: PlusCircle, role: ['teacher'] },
  { href: '/submit-answer', label: 'Submit Answer', icon: FileQuestion, role: ['student'] },
  { href: '/results', label: 'View Results', icon: View, role: ['student', 'teacher'] },
  { href: '/essay-scoring', label: 'Essay Scoring', icon: BookMarked, role: ['teacher'] },
  { href: '/feedback', label: 'AI Feedback', icon: BotMessageSquare, role: ['teacher'] },
  { href: '/diagram-analysis', label: 'Diagram Analysis', icon: ClipboardCheck, role: ['teacher'] },
  { href: '/ocr', label: 'OCR Submission', icon: ScanText, role: ['teacher'] },
];

function UserSwitcher() {
    const { user, setUser } = useUser();

    if (!user) return null;

    const handleUserChange = (userId: string) => {
        const selectedUser = USERS.find(u => u.id === userId);
        if (selectedUser) {
            setUser(selectedUser);
        }
    };

    return (
        <div className="flex items-center gap-3 p-2">
            <Avatar className="size-9">
              <AvatarImage
                src={user.avatarUrl}
                alt={`${user.name} avatar`}
                data-ai-hint="person face"
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col group-data-[state=expanded]:flex">
                <Select value={user.id} onValueChange={handleUserChange}>
                    <SelectTrigger className="w-[180px] border-none !bg-transparent text-sm font-semibold text-sidebar-foreground ring-offset-sidebar-background focus:ring-sidebar-ring">
                        <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                        {USERS.map(u => (
                            <SelectItem key={u.id} value={u.id}>
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-6">
                                        <AvatarImage src={u.avatarUrl} alt={u.name} />
                                        <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{u.name} ({u.role})</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <span className="text-xs text-sidebar-foreground/70 -mt-1 ml-3">
                    {user.email}
                </span>
            </div>
          </div>
    )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  // Wait until the user is loaded on the client to prevent hydration mismatch
  if (!user) {
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
                    {/* Render a skeleton or loading state here */}
                </SidebarContent>
              </Sidebar>
              <SidebarInset>
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
              </SidebarInset>
          </SidebarProvider>
      )
  }

  const filteredNavItems = navItems.filter(item => {
    if (!item.role) return true;
    return item.role.includes(user.role);
  });

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
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
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
          <UserSwitcher />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             {/* Can add breadcrumbs or page title here later */}
          </div>
          <div className='flex items-center gap-4'>
             {/* The user switcher and role-based sidebar links handle primary actions now. */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
        <footer className="p-4 text-center text-sm text-muted-foreground">
            Powered by MegaForte Pvt. Ltd. ©2025
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
        <FirebaseClientProvider>
            <AppLayout>{children}</AppLayout>
        </FirebaseClientProvider>
    </UserProvider>
  );
}
