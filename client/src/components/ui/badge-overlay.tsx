import { ReactNode } from "react";

interface BadgeOverlayProps {
  children: ReactNode;
  label: string;
  type?: "tv" | "movie" | "ova" | "special";
  className?: string;
}

const BadgeOverlay = ({ 
  children, 
  label, 
  type, 
  className 
}: BadgeOverlayProps) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      <div className="absolute top-2 left-2 flex space-x-1">
        {type && (
          <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-900 bg-opacity-80 text-white">
            {type.toUpperCase()}
          </span>
        )}
        
        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-[#ff3a3a] text-white">
          {label}
        </span>
      </div>
    </div>
  );
};

export default BadgeOverlay;
