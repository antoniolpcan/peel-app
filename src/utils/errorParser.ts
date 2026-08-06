export const parseApiError = (err: any): string => {

  if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }

  if (err.detail) {
    if (Array.isArray(err.detail)) {
      return err.detail
        .map((d: any) => d.msg.replace('Value error, ', '').replace('String should have', 'O campo deve ter'))
        .join(' | ');
    }
    if (typeof err.detail === 'string') {
      return err.detail;
    }
  }

  try {
    const parsed = JSON.parse(err.message);
    if (parsed.detail && Array.isArray(parsed.detail)) {
      return parsed.detail
        .map((d: any) => d.msg.replace('Value error, ', ''))
        .join('\n');
    }
    if (parsed.detail && typeof parsed.detail === 'string') {
      return parsed.detail;
    }
  } catch (e) {
  }

  return err.message || 'Ocorreu um erro inesperado. Tente novamente.';
};