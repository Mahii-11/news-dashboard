import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const Icon = resolvedTheme === 'dark' ? Moon : Sun;
  const label =
    theme === 'system'
      ? `System (${resolvedTheme})`
      : resolvedTheme === 'dark'
        ? 'Dark mode'
        : 'Light mode';

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle-btn"
      aria-label={`Theme: ${label}. Click to switch.`}
      title={label}
    >
      <Icon size={18} className="theme-toggle-icon" />
      {theme === 'system' && (
        <Monitor size={10} className="theme-toggle-badge" />
      )}
    </button>
  );
}
