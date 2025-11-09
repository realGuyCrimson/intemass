
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student';
    avatarUrl: string;
}

export const USERS: User[] = [
    {
        id: 'user-1',
        name: 'Dr. Evelyn Reed',
        email: 'e.reed@cambridge.edu',
        role: 'teacher',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop'
    },
    {
        id: 'user-2',
        name: 'Liam Johnson',
        email: 'liam.j@university.com',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1599566147214-ce487862ea4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBmYWNlfGVufDB8fHx8MTc2MjY1MjA5NXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        id: 'user-3',
        name: 'Olivia Smith',
        email: 'olivia.s@university.com',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1616002411355-49593fd89721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b21hbiUyMGZhY2V8ZW58MHx8fHwxNzYyNjA5NDk5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
];
