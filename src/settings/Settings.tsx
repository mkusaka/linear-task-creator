// src/settings/Settings.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { save, load } from "@/storage";

// ① sonner の useToast, Toaster をインポート
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export function Settings() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    load<string>("linearApiKey").then((k) => k && setApiKey(k));
  }, []);

  const apply = async () => {
    await save("linearApiKey", apiKey);
    // ③ sonner の toast で成功メッセージ
    toast.success("Linear API key saved!");
  };

  return (
    <>
      <div className="p-4 space-y-4">
        <h1 className="text-lg font-bold">Linear API Key</h1>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="lin_xxx"
        />
        <Button onClick={apply}>Save</Button>
      </div>

      {/* ④ sonner の Toaster を配置 */}
      <Toaster richColors position="bottom-right" />
    </>
  );
}
