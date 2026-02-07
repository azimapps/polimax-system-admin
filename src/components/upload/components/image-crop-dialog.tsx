import type { Area, Point } from 'react-easy-crop';

import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    image: string;
    onCropComplete: (croppedImage: File) => void;
};

export function ImageCropDialog({ open, onClose, image, onCropComplete }: Props) {
    const { t } = useTranslate();
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (location: Point) => {
        setCrop(location);
    };

    const onZoomChange = (value: number) => {
        setZoom(value);
    };

    const onCropCompleteHandler = useCallback((grouped: Area, pixels: Area) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (error) => reject(error));
            img.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
            img.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area,
        rotation = 0
    ): Promise<Blob | null> => {
        const img = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        const maxSize = Math.max(img.width, img.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        // set each dimensions to double largest dimension to allow for a safe area for the
        // image to rotate without being clipped by canvas context
        canvas.width = safeArea;
        canvas.height = safeArea;

        // translate canvas context to a central location on image to allow rotating around the center.
        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        // draw rotated image and store data.
        ctx.drawImage(
            img,
            safeArea / 2 - img.width * 0.5,
            safeArea / 2 - img.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + img.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + img.height * 0.5 - pixelCrop.y)
        );

        // As Base64 string
        // return canvas.toDataURL('image/jpeg');

        // As Blob
        return new Promise((resolve, reject) => {
            // Start with high quality
            let quality = 0.9;

            const compress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas is empty'));
                            return;
                        }

                        // Check if file size is > 300KB (307200 bytes)
                        if (blob.size > 307200 && quality > 0.1) {
                            quality -= 0.1;
                            compress();
                        } else {
                            resolve(blob);
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            compress();
        });
    };

    const handleSave = async () => {
        if (croppedAreaPixels) {
            try {
                const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
                if (croppedBlob) {
                    const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
                    onCropComplete(file);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('crop_image')}</DialogTitle>

            <DialogContent sx={{ position: 'relative', height: 400, width: '100%', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 80, bgcolor: 'background.neutral' }}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                    />
                </Box>

                <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 99 }}>
                    <Typography variant="overline" sx={{ mb: 1, display: 'block' }}>
                        {t('zoom')}
                    </Typography>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoomValue) => onZoomChange(Number(zoomValue))}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    {t('cancel')}
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    {t('save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
