import { startTransition, useState, useCallback } from 'react';

interface TransitionState<T> {
  value: T;
  isPending: boolean;
}

export function useTransitionState<T>(initialValue: T) {
  const [state, setState] = useState<TransitionState<T>>({
    value: initialValue,
    isPending: false,
  });

  const setValueWithTransition = useCallback((newValue: T) => {
    setState(prev => ({ ...prev, isPending: true }));
    
    startTransition(() => {
      setState({
        value: newValue,
        isPending: false,
      });
    });
  }, []);

  const setValueImmediate = useCallback((newValue: T) => {
    setState({
      value: newValue,
      isPending: false,
    });
  }, []);

  return {
    value: state.value,
    isPending: state.isPending,
    setValueWithTransition,
    setValueImmediate,
  };
}
