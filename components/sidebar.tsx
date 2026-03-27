import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Activity, Settings, HelpCircle, X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const mainLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Prediction", href: "/predict", icon: Activity },
    { name: "Prediction History", href: "/history", icon: History },
  ];

  return (
    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-68 flex-shrink-0 border-r border-[var(--color-gold)]/20 bg-[var(--color-primary-900)] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 md:p-8 pb-6 md:pb-10 flex items-center justify-between">
        <Link href="/" className="block group">
          <h1 className="text-2xl font-black text-[#E8F0E4] tracking-tighter transition-all duration-300 group-hover:tracking-tight">
            Agri<span className="text-[var(--color-gold)]">Forecast</span>
          </h1>
          <div className="flex items-center gap-2 mt-1.5 opacity-80">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_#D4A017]" />
            <p className="text-[9px] font-bold text-[#CBD5C9] tracking-[0.2em] uppercase">Digital Agronomist</p>
          </div>
        </Link>
        {/* Close button on mobile */}
        <button onClick={onClose} className="lg:hidden text-[var(--color-gold)] p-2 hover:bg-[var(--color-primary-800)]/40 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-5 space-y-1.5 md:space-y-3 overflow-y-auto">
        <p className="px-4 text-[9px] font-black text-[var(--color-gold)]/60 uppercase tracking-[0.3em] mb-4">Core Navigation</p>
        {mainLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-sm text-[13px] font-bold transition-all duration-300 uppercase tracking-widest ${
                isActive 
                  ? "bg-[var(--color-gold)] text-[var(--color-primary-900)] shadow-[0_0_15px_rgba(212,160,23,0.3)] scale-[1.02]" 
                  : "text-[#CBD5C9] hover:text-[var(--color-gold)] hover:bg-[var(--color-primary-800)]/40"
              }`}
              onClick={onClose}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[3px]' : 'stroke-2'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 md:p-6 space-y-4 md:space-y-5 bg-[var(--color-primary-800)]/20 border-t border-[var(--color-gold)]/10 mt-auto">
        <div className="glass-dark rounded-lg p-4 border border-[var(--color-gold)]/30 shadow-inner">
          <p className="text-[9px] font-black text-[var(--color-gold)] uppercase tracking-[0.25em] mb-2 pl-0.5 opacity-90">System Integrity</p>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400/40 animate-ping" />
            </div>
            <span className="text-[11px] font-bold text-[#E8F0E4] tracking-wide">Satellites Online</span>
          </div>
        </div>

        <nav className="space-y-2 px-2">
          <Link href="/settings" className="flex items-center gap-3 py-2 text-[11px] font-bold text-[#CBD5C9] uppercase tracking-widest hover:text-[var(--color-gold)] transition-all duration-300">
            <Settings className="w-4 h-4" />
            Control Panel
          </Link>
          <a href="mailto:samarthhk1234@gmail.com" className="flex items-center gap-3 py-2 text-[11px] font-bold text-[#CBD5C9] uppercase tracking-widest hover:text-[var(--color-gold)] transition-all duration-300">
            <HelpCircle className="w-4 h-4" />
            Support Relay
          </a>
        </nav>
      </div>
    </aside>
  );
}
