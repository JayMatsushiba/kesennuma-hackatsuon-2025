'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useTranslations } from "next-intl";
import LoginButton from "./LoginButton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { primaryWallet } = useDynamicContext();
  const t = useTranslations('auth');

  if (!primaryWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {t('loginRequired')}
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t('loginMessage')}
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
