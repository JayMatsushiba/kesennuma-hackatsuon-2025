'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useTranslations } from "next-intl";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function UserProfile() {
  const { primaryWallet, handleLogOut } = useDynamicContext();
  const t = useTranslations('auth');

  if (!primaryWallet) return null;

  const address = primaryWallet.address;

  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2">
      <div className="flex flex-col">
        <span className="text-xs text-slate-500">{t('connected')}</span>
        <span className="text-sm font-medium text-slate-900">
          {formatAddress(address)}
        </span>
      </div>
      <button
        onClick={handleLogOut}
        className="text-sm text-red-600 hover:text-red-700 font-medium"
        aria-label={t('logout')}
      >
        {t('logout')}
      </button>
    </div>
  );
}
