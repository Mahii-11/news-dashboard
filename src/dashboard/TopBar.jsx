import { Search, Bell, Settings, Menu } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function TopBar({ onToggleSidebar }) {
  return (
    <div className="h-16 topbar-shell flex items-center justify-between px-6">
      
      {/* Left side - Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="icon-btn lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex search-bar flex-1 max-w-md">
          <Search size={18} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search pages, content, settings..."
            className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder-muted-foreground"
          />
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-background-secondary rounded border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button className="icon-btn relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-card"></span>
        </button>
        
        <button className="icon-btn" aria-label="Settings">
          <Settings size={20} />
        </button>

        <div className="w-10 h-10 avatar-gradient rounded-xl flex items-center justify-center font-semibold cursor-pointer hover:shadow-glow transition-shadow ml-1">
          U
        </div>
      </div>
    </div>
  )
}
