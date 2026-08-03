import { useState, useRef, useEffect } from 'react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const themes: { id: Theme; label: string; icon: string }[] = [
        { id: 'light', label: 'Claro', icon: '☀️' },
        { id: 'dark', label: 'Escuro', icon: '🌙' },
        { id: 'midnight', label: 'Midnight', icon: '🌌' },
        { id: 'dracula', label: 'Dracula', icon: '🧛‍♂️' },
        { id: 'nord', label: 'Nord', icon: '❄️' },
        { id: 'emerald', label: 'Emerald', icon: '🌿' },
        { id: 'sakura', label: 'Sakura', icon: '🌸' },
        { id: 'sepia', label: 'Sépia', icon: '📜' },
    ];

    const currentTheme = themes.find((t) => t.id === theme) || themes[0];

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
    <div className="relative inline-block" ref={dropdownRef}>
        <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-app-card text-app-text border border-app-border px-3 py-1.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all hover:opacity-90 shadow-2xs"
        >
        <span>{currentTheme.icon}</span>
        <span>{currentTheme.label}</span>
        <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
        </span>
        </button>

        {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-app-card border border-app-border rounded-2xl shadow-xl z-50 py-1.5 animate-fadeIn overflow-hidden">
            {themes.map((t) => {
            const isSelected = t.id === theme;
            return (
                <button
                key={t.id}
                type="button"
                onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                    ? 'bg-indigo-500/10 text-indigo-500 font-bold'
                    : 'text-app-text hover:bg-app-bg'
                }`}
                >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                </button>
            );
            })}
        </div>
        )}
    </div>
    );
}