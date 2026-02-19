
import type { Brigada } from 'src/types/brigada';
import type { StanokType } from 'src/types/stanok';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { BrigadaForm } from './brigada-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    brigada?: Brigada;
    machineId: number;
    machineType: StanokType;
};

export function BrigadaDialog({ open, onClose, brigada, machineId, machineType }: Props) {
    const { t } = useTranslate('stanok');

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{brigada ? t('brigada.edit_item') : t('brigada.new_item')}</DialogTitle>
            <DialogContent>
                <BrigadaForm
                    brigada={brigada}
                    machineId={machineId}
                    machineType={machineType}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
