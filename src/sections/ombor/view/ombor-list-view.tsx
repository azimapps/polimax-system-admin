
import { useBoolean } from 'minimal-shared/hooks';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { OmborDialog } from '../ombor-dialog';

// ----------------------------------------------------------------------

export function OmborListView() {
    const { t } = useTranslate('ombor');
    const dialog = useBoolean();

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                <Typography variant="h4">{t('list_title')}</Typography>

                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={dialog.onTrue}
                >
                    {t('new_item')}
                </Button>
            </Stack>

            <Card sx={{ p: 5, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Materiallar ro&apos;yxati bu erda ko&apos;rsatiladi. Yangi materialni qo&apos;shish uchun yuqoridagi tugmani bosing.
                </Typography>
            </Card>

            <OmborDialog open={dialog.value} onClose={dialog.onFalse} />
        </Container>
    );
}
