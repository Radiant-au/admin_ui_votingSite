import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Vote, LogOut, Menu, X, Crown, UserPlus, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'vote_moderator'] },
  { to: '/candidates', icon: Users, label: 'Candidates', roles: ['admin'] },
  { to: '/scoring', icon: ClipboardList, label: 'Scoring', roles: ['admin'] },
  { to: '/moderators', icon: UserPlus, label: 'Moderators', roles: ['admin'] },
  { to: '/control', icon: Vote, label: 'Control', roles: ['admin'] }
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Crown className="h-7 w-7 text-primary" />
          <span className="font-display text-sidebar-foreground font-semibold text-lg golden-text">VoteAdmin</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-sidebar-foreground hover:bg-sidebar-accent">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {isOpen && <div className="lg:hidden fixed inset-0 bg-foreground/50 z-40 animate-fade-in" onClick={() => setIsOpen(false)} />}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <Crown className="h-8 w-8 text-primary" />
          <span className="font-display text-sidebar-foreground font-bold text-xl golden-text">VoteAdmin</span>
        </div>

        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent border border-primary/20">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground font-medium truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-sidebar-accent group",
                isActive ? "bg-primary text-primary-foreground shadow-lg golden-glow" : "text-sidebar-foreground"
              )}>
              <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground">
            <LogOut className="h-5 w-5" /><span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
