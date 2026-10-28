import { useContext } from 'react';
import { EventContext } from '../context/EventContextInstance';
import type { EventContextType, TabType } from '../context/EventContextInstance';

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export type { EventContextType, TabType };
