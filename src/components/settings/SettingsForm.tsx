import React, { memo } from 'react';
import { Bell, Shield, Volume2, Save, Loader2 } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { SettingsToggle } from './SettingsToggle';

export interface SettingsFormData {
  sound: boolean;
  is_private: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

interface SettingsFormProps {
  formData: SettingsFormData;
  saving: boolean;
  onToggleField: (key: keyof SettingsFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SettingsForm = memo(function SettingsForm({
  formData,
  saving,
  onToggleField,
  onSubmit,
}: SettingsFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 bg-app-card border border-app-border p-6 sm:p-8 rounded-3xl shadow-xs"
    >
      <SettingsSection title="Notificações" icon={Bell}>
        <SettingsToggle
          label="Notificações por Email"
          checked={formData.email_notifications}
          onChange={() => onToggleField('email_notifications')}
          disabled={true}
        />
        <SettingsToggle
          label="Notificações Push"
          checked={formData.push_notifications}
          onChange={() => onToggleField('push_notifications')}
          disabled={true}
        />
      </SettingsSection>

      <hr className="border-app-border" />

      <SettingsSection title="Privacidade & Efeitos" icon={Shield}>
        <SettingsToggle
          label="Perfil Privado"
          checked={formData.is_private}
          onChange={() => onToggleField('is_private')}
          disabled={true}
        />
        <SettingsToggle
          label="Efeitos de Som"
          icon={Volume2}
          checked={formData.sound}
          onChange={() => onToggleField('sound')}
          disabled={true}
        />
      </SettingsSection>

      <button
        type="submit"
        disabled={saving}
        className="mt-2 bg-app-accent text-app-accent-text px-5 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Salvando...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </>
        )}
      </button>
    </form>
  );
});