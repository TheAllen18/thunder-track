
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HolographicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'primary' | 'secondary';
}

const HolographicButton: React.FC<HolographicButtonProps> = ({
  children,
  onClick,
  className,
  size = 'default',
  variant = 'primary'
}) => {
  const baseClasses = variant === 'primary' 
    ? 'quantum-button' 
    : 'bg-slate-800/50 border-2 border-emerald-500/30 text-emerald-400 hover:bg-slate-700/50 hover:border-emerald-400';

  return (
    <Button
      onClick={onClick}
      className={cn(
        baseClasses,
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-12 py-6 text-xl',
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  );
};

export default HolographicButton;
