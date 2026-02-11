import type { CreateLeadConversationRequest } from 'src/types/lead';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

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
import { ConfirmDialog } from 'src/components/custom-dialog';

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

    const { data: conversations = [], isPending, error, isError } = useGetLeadConversations(leadId);
    const { mutateAsync: addConversation, isPending: isAdding } = useAddLeadConversation(leadId);
    const { mutateAsync: deleteConversation } = useDeleteLeadConversation(leadId);

    const confirmDelete = useBoolean();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const methods = useForm<CreateLeadConversationRequest>({
        resolver: zodResolver(ConversationSchema),
        defaultValues: { message: '' },
    });

    const { handleSubmit, reset, formState: { isSubmitting } } = methods;

    useEffect(() => {
        if (open) {
            reset({ message: '' });
        }
    }, [open, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (!leadId) {
                toast.error('Lead ID is missing');
                return;
            }
            await addConversation(data);
            reset();
            toast.success(t('messages.success_conversation_add') || 'Conversation added');
        } catch (err: any) {
            console.error('Add conversation error:', err);
            const errorMessage = err?.message || err?.detail || (typeof err === 'string' ? err : null) || t('messages.error_generic') || 'Error adding conversation';
            toast.error(errorMessage);
        }
    });

    const handleDelete = useCallback(async () => {
        if (!deletingId) return;
        try {
            await deleteConversation(deletingId);
            toast.success(t('messages.success_conversation_delete') || 'Deleted');
            confirmDelete.onFalse();
            setDeletingId(null);
        } catch (err: any) {
            console.error('Delete conversation error:', err);
            const errorMessage = err?.message || err?.detail || (typeof err === 'string' ? err : null) || t('messages.error_generic') || 'Error deleting';
            toast.error(errorMessage);
        }
    }, [deletingId, deleteConversation, t, confirmDelete]);

    const onClickDelete = (id: number) => {
        setDeletingId(id);
        confirmDelete.onTrue();
    };

    const renderLoading = (
        <Box display="flex" justifyContent="center" alignItems="center" p={5} minHeight={200}>
            <CircularProgress />
        </Box>
    );

    const renderError = (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={5} minHeight={200} color="error.main">
            <Typography variant="body2" sx={{ mb: 1 }}>{t('messages.error_loading_conversations') || 'Error loading conversations'}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {(error as any)?.message || (error as any)?.detail || (typeof error === 'string' ? error : 'Unknown error')}
            </Typography>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {t('conversations_title')} {leadId > 0 && `(ID: ${leadId})`}
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Stack sx={{ p: 3, pb: 0 }}>
                    <Form methods={methods} onSubmit={onSubmit}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Field.Text
                                name="message"
                                placeholder={t('conversation_placeholder')}
                                multiline
                                rows={2}
                                disabled={isAdding || isSubmitting}
                            />
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isAdding || isSubmitting}
                                sx={{ height: 56 }}
                            >
                                {t('send')}
                            </LoadingButton>
                        </Stack>
                    </Form>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {isPending ? renderLoading : (
                    <>
                        {isError ? renderError : (
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
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{conversation.message}</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            {fDateTime(conversation.created_at)}
                                        </Typography>
                                        <IconButton
                                            className="delete-btn"
                                            size="small"
                                            color="error"
                                            onClick={() => onClickDelete(conversation.id)}
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
                    </>
                )}
            </DialogContent>

            <Stack sx={{ p: 3, pt: 0 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    {t('close')}
                </Button>
            </Stack>

            <ConfirmDialog
                open={confirmDelete.value}
                onClose={confirmDelete.onFalse}
                title={t('messages.delete_conversation_confirm_title') || t('delete_confirm_title')}
                content={t('messages.delete_conversation_confirm_message') || t('delete_confirm_message')}
                action={
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        {t('delete')}
                    </Button>
                }
            />
        </Dialog>
    );
}
