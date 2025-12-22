import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const themes = [
  { name: 'Rouge', value: 'theme-red', color: 'bg-red-500' },
  { name: 'Bleu', value: 'theme-blue', color: 'bg-blue-500' },
  { name: 'Vert', value: 'theme-green', color: 'bg-green-500' },
];

export const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = React.useState('theme-red');

  const handleThemeChange = (theme: string) => {
    // Remove all theme classes
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '');
    
    // Add new theme class
    if (theme !== 'theme-red') {
      document.documentElement.classList.add(theme);
    }
    
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'theme-red';
    handleThemeChange(savedTheme);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => handleThemeChange(theme.value)}
            className="flex items-center gap-2"
          >
            <div className={`w-4 h-4 rounded-full ${theme.color}`} />
            <span>{theme.name}</span>
            {currentTheme === theme.value && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};