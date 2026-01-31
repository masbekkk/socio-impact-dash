import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Search, Bell, User, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

export default function AppTopbar() {
  const { props } = usePage()
  const auth = (props.auth as any) || {}
  const user = auth?.user || { name: 'User', email: 'user@example.com', role: 'pegawai' }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <div className="flex items-center gap-3 flex-1">
        <div className="md:hidden">
          <Button variant="ghost" size="sm">☰</Button>
        </div>
        <div className="hidden md:block flex-1 max-w-sm">
          <Input placeholder="Cari proyek, tugas, atau orang..." className="bg-muted" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback>{user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/profile'>Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form method="POST" action="/logout" className="w-full">
                <input type="hidden" name="_token" value={(props.csrf_token as string)} />
                <button type="submit" className="w-full text-left text-sm flex items-center gap-2 text-red-600">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
