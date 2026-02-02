// Shared types for theme modals and components

export interface ModalContentProps {
  type: 'text' | 'image' | 'video';
  title?: string;
  message?: string;
  mediaUrl?: string;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ModalContentProps;
  config?: any;
}

export interface LockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  unlockDate: Date;
  onNotify?: () => void;
  theme?: string;
}

export interface LockedModalThemeConfig {
  title: string;
  message: string;
  buttonColor: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  descColor: string;
  icon: any;
}
