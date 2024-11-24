// components/common/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
  }
  
  export default function Button({
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...props
  }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors";
    
    const variants = {
      primary: "bg-green-600 text-white hover:bg-green-700",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    };
  
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }