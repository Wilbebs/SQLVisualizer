import React, { ButtonHTMLAttributes, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Handle button animation when pressed
  const handleMouseDown = () => {
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 300);
  };

  // Base styles
  const baseClasses = 'relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out';
  
  // Size styles
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  // Variant styles (colors)
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  };
  
  // Width style
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Hover and pulse effect
  const effectClasses = 'hover:scale-105 hover:shadow-md focus:outline-none';
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${effectClasses} ${className}`}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {children}
      {isPressed && (
        <span 
          className="absolute inset-0 rounded-md animate-pulse-fast"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  );
};

export default Button;