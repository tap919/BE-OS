import { useState } from 'react';
import { useAuth } from './AuthContext';

export function useGoogleIntegration() {
  const { getOAuthToken } = useAuth();
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const run = async (action: (token: string) => Promise<any>) => {
    const token = getOAuthToken();
    if (!token) { setStatus('error'); return; }
    setStatus('loading');
    try {
      const res = await action(token);
      setResult(res);
      setStatus('success');
    } catch { setStatus('error'); }
  };

  return { run, status, result };
}
