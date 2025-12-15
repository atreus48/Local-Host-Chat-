import React from 'react';
import * as Lucide from 'lucide-react';

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: keyof typeof Lucide;
  size?: number | string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className, ...props }) => {
  const IconComponent = Lucide[name] as React.ElementType;
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} {...props} />;
};