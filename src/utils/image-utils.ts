export type CompressionStats = {
    originalSize: number;
    compressedSize: number;
    percentageSaved: number;
};

/**
 * Compresses an image file and returns statistics about the compression.
 */
export async function compressImageWithStats(
    file: File,
    maxSizeBytes: number = 200 * 1024,
    quality: number = 0.7
): Promise<{ file: File; stats: CompressionStats }> {
    const originalSize = file.size;
    const compressedFile = await compressImage(file, maxSizeBytes, quality);
    const compressedSize = compressedFile.size;

    const percentageSaved = originalSize > 0
        ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100)
        : 0;

    return {
        file: compressedFile,
        stats: {
            originalSize,
            compressedSize,
            percentageSaved,
        },
    };
}

/**
 * Formats bytes to human readable format (KB, MB, etc.)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Compresses an image file if it exceeds the specified maximum size.
 */
export async function compressImage(
    file: File,
    maxSizeBytes: number = 200 * 1024,
    quality: number = 0.7
): Promise<File> {
    // If file is already smaller than maxSizeBytes, no need to compress
    if (file.size <= maxSizeBytes) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Maintain aspect ratio while potentially downscaling if the image is massive
                const MAX_DIMENSION = 2000;
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    if (width > height) {
                        height = (height / width) * MAX_DIMENSION;
                        width = MAX_DIMENSION;
                    } else {
                        width = (width / height) * MAX_DIMENSION;
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file);
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Recursive function to find the right quality to fit under maxSizeBytes
                const compress = (q: number) => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                resolve(file);
                                return;
                            }

                            if (blob.size <= maxSizeBytes || q <= 0.1) {
                                // Ensure name has an extension if it doesn't already
                                let fileName = file.name;
                                if (!fileName.toLowerCase().endsWith('.jpg') && !fileName.toLowerCase().endsWith('.jpeg')) {
                                    fileName = `${fileName.split('.')[0]}.jpg`;
                                }

                                const compressedFile = new File([blob], fileName, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                // Reduce quality and try again
                                compress(q - 0.1);
                            }
                        },
                        'image/jpeg',
                        q
                    );
                };

                compress(quality);
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}
