/**
 * BackupPrompt — re-export nudge against Safari storage eviction.
 *
 * Shows once per qualifying boot (never exported, or export older than 30
 * days), snoozable for 7 days. Export replaces the previous backup file;
 * latest always wins. Self-contained snackbar; silent when no tithis exist.
 */
import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import {
  shouldPromptBackup,
  markExported,
  snoozeBackup,
  performBackupExport,
  type BackupPromptState,
} from '../services/backupReminder';

export const BackupPrompt: React.FC = () => {
  const { t } = useI18n();
  const customTithis = useAppStore((s) => s.customTithis);
  const exportCustomTithis = useAppStore((s) => s.exportCustomTithis);
  const [state, setState] = useState<BackupPromptState | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const s = shouldPromptBackup({ tithiCount: customTithis.length });
    setState(s.prompt ? s : null);
    setDone(false);
  }, [customTithis.length]);

  if (!state) return null;

  const message =
    state.reason === 'never'
      ? t('myTithis.backupNever') || 'Back up your tithis? One tap keeps them safe.'
      : (t('myTithis.backupStale') || 'Backup is {days} days old — export a fresh copy?').replace(
          '{days}',
          String(state.daysSince)
        );

  const handleExport = async () => {
    const outcome = await performBackupExport(exportCustomTithis());
    if (outcome !== 'failed') {
      markExported();
      setDone(true);
    }
    setState(null);
  };

  const handleLater = () => {
    snoozeBackup();
    setState(null);
  };

  return (
    <>
      <Snackbar
        open={!done}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 9 }}
      >
        <Alert
          severity="info"
          onClose={handleLater}
          sx={{ borderRadius: 1, alignItems: 'center' }}
          action={
            <>
              <Button size="small" onClick={handleLater} sx={{ whiteSpace: 'nowrap' }}>
                {t('myTithis.backupLater') || 'Later'}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleExport}
                sx={{ borderRadius: 1, whiteSpace: 'nowrap', ml: 1 }}
              >
                {t('myTithis.export') || 'Export Tithis'}
              </Button>
            </>
          }
        >
          {message}
        </Alert>
      </Snackbar>
      <Snackbar open={done} autoHideDuration={3000} onClose={() => setDone(false)} sx={{ mb: 9 }}>
        <Alert severity="success" onClose={() => setDone(false)} sx={{ borderRadius: 1 }}>
          {t('myTithis.backupDone') || 'Backup saved — replaces the old one'}
        </Alert>
      </Snackbar>
    </>
  );
};
