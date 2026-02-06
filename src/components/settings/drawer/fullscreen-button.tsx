import { useState, useEffect, useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { Iconify } from '../../iconify';

// ----------------------------------------------------------------------

export function FullScreenButton() {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullscreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('mozfullscreenchange', onFullScreenChange);
    document.addEventListener('MSFullscreenChange', onFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
      document.removeEventListener('mozfullscreenchange', onFullScreenChange);
      document.removeEventListener('MSFullscreenChange', onFullScreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    const docEl = document.documentElement as any;

    if (
      !document.fullscreenElement &&
      !docEl.webkitFullscreenElement &&
      !docEl.mozFullScreenElement &&
      !docEl.msFullscreenElement
    ) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch((err: any) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      const doc = document as any;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }, []);

  return (
    <Tooltip title={fullscreen ? 'Exit' : 'Fullscreen'}>
      <IconButton onClick={handleToggleFullscreen} color={fullscreen ? 'primary' : 'default'}>
        <Iconify
          icon={
            fullscreen
              ? 'solar:quit-full-screen-square-outline'
              : 'solar:full-screen-square-outline'
          }
        />
      </IconButton>
    </Tooltip>
  );
}
