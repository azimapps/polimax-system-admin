import type { CreateLeadConversationRequest } from 'src/types/lead';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import {
    useAddLeadConversation,
    useGetLeadConversations,
    useDeleteLeadConversation,
} from 'src/hooks/use-leads';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const ConversationSchema = zod.object({
    message: zod.string().min(1, { message: 'Message is required!' }),
});

type Props = {
    open: boolean;
    onClose: () => void;
    leadId: number;
};

export function LeadConversationDialog({ open, onClose, leadId }: Props) {
    const { t } = useTranslate('lead');

    const { data: conversations = [], isLoading } = useGetLeadConversations(leadId);
    const { mutateAsync: addConversation, isPending: isAdding } = useAddLeadConversation(leadId);
    const { mutateAsync: deleteConversation } = useDeleteLeadConversation(leadId);

    const methods = useForm<CreateLeadConversationRequest>({
        resolver: zodResolver(ConversationSchema),
        defaultValues: { message: '' },
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await addConversation(data);
            reset();
            toast.success(t('messages.success_conversation_add'));
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    });

    const handleDelete = async (id: number) => {
        try {
            await deleteConversation(id);
            toast.success(t('messages.success_conversation_delete'));
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('conversations_title')}</DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Stack sx={{ p: 3, pb: 0 }}>
                    <Form methods={methods} onSubmit={onSubmit}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Field.Text
                                name="message"
                                placeholder={t('conversation_placeholder')}
                                multiline
                                rows={2}
                            />
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isAdding}
                                sx={{ height: 56 }}
                            >
                                {t('send')}
                            </LoadingButton>
                        </Stack>
                    </Form>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={2} sx={{ px: 3, pb: 3, maxHeight: 400, overflow: 'auto' }}>
                        {conversations.length === 0 && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                {t('no_conversations')}
                            </Typography>
                        )}
                        {conversations.map((conversation) => (
                            <Stack
                                key={conversation.id}
                                spacing={0.5}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: 'background.neutral',
                                    position: 'relative',
                                    '&:hover .delete-btn': { opacity: 1 },
                                }}
                            >
                                <Typography variant="body2">{conversation.message}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {fDateTime(conversation.created_at)}
                                </Typography>
                                <IconButton
                                    className="delete-btn"
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(conversation.id)}
                                    sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        opacity: 0,
                                        transition: (theme) => theme.transitions.create('opacity'),
                                    }}
                                >
                                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                </IconButton>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </DialogContent>

            <Stack sx={{ p: 3, pt: 0 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    {t('close')}
                </Button>
            </Stack>
        </Dialog>
    );
}
