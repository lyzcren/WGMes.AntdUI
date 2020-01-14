import screenfull from 'screenfull';

export function print(module, grfId, id) {
  const w = window.open('about:blank');
  w.location.href = `/print/${module}/${grfId}/${id}`;
}

export function autoSreenfull() {
  try {
    setTimeout(() => {
      if (!screenfull.isFullscreen) {
        if (screenfull.enabled) {
          screenfull.request();
        }
      }
    }, 2000);
  } catch (error) {
    autoSreenfull();
  }
}

export function watchFullScreen(dispatch) {
  const screenChange = () => {
    dispatch({
      type: 'global/fullScreen',
      payload: {
        isFullScreen: screenfull.isFullscreen,
      },
    });
  };
  if (screenfull.enabled) {
    screenfull.on('change', screenChange);
  }
}

export function changeFullScreen() {
  try {
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request();
    }
  } catch (error) {}
}
