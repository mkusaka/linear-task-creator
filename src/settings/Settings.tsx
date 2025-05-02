// src/settings/Settings.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { save, load } from '@/storage'

export function Settings() {
  const [apiKey, setApiKey] = useState('')
  useEffect(() => {
    load<string>('linearApiKey').then(k => k && setApiKey(k))
  }, [])
  const apply = () => save('linearApiKey', apiKey)
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Linear API Key</h1>
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk_xxx"
      />
      <Button onClick={apply}>Save</Button>
    </div>
  )
}
