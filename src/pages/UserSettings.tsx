import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Check } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { PageLayout } from '@/components/layout/PageLayout';
import { SettingsForm, type SettingsFormData } from '@/components/settings/SettingsForm';

export function UserSettingsPage() {
  const { settings, loading, error, updateSettings } = useUserSettings();

  const [formData, setFormData] = useState<SettingsFormData>({
    sound: false,
    is_private: false,
    email_notifications: true,
    push_notifications: true,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const isInitialized = useRef(false);

  useEffect(() => {
    if (settings && !isInitialized.current) {
      setFormData({
        sound: Boolean(settings.sound),
        is_private: Boolean(settings.is_private),
        email_notifications: Boolean(settings.email_notifications),
        push_notifications: Boolean(settings.push_notifications),
      });

      isInitialized.current = true;
    }
  }, [settings]);

  const toggleField = useCallback((key: keyof SettingsFormData) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateSettings(formData);
      setSuccessMsg('Configurações salvas com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Configurações da Conta</h1>
          <p className="text-sm text-app-muted">Ajuste suas preferências de experiência e privacidade.</p>
        </div>

        {error && (
          <div role="alert" className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {loading && !settings ? (
          <div className="flex items-center justify-center py-20 text-app-muted gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-app-accent" />
            Carregando preferências...
          </div>
        ) : (
          <SettingsForm
            formData={formData}
            saving={saving}
            onToggleField={toggleField}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </PageLayout>
  );
}