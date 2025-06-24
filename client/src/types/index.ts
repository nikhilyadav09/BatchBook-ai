import { ReactNode } from 'react';

// types/index.ts - Common Types
export interface BaseComponentProps {
    className?: string;
    children?: ReactNode;
  }
  
  export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
  export type ButtonSize = 'sm' | 'md' | 'lg';
  export type InputSize = 'sm' | 'md' | 'lg';
  export type ToastType = 'success' | 'error' | 'warning' | 'info';