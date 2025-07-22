import { WalletMinimal } from "lucide-react";
import { GLOBAL_CONFIG } from "@/lib/global-config";

export default function Logo({
  fullTitle = false,
  logo = false,
  noText = false,
}: Readonly<{
  fullTitle?: boolean;
  logo?: boolean;
  noText?: boolean;
}>) {
  return (
    <div className="flex items-center gap-2 font-mono">
      {logo && !noText && (
        <WalletMinimal className="-rotate-45 size-6 text-secondary" />
      )}

      {fullTitle && !noText && (
        <h1 className="font-bold text-2xl">{GLOBAL_CONFIG.logo.fullTitle}</h1>
      )}
    </div>
  );
}
