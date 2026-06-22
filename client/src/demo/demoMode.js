// Tracks whether the app is running in no-backend "Live Demo" mode.

export const isDemoMode = () => {
  try {
    return localStorage.getItem('demoMode') === 'true'
  } catch {
    return false
  }
}

export const enableDemoMode = () => {
  try {
    localStorage.setItem('demoMode', 'true')
  } catch {
    /* ignore */
  }
}

export const disableDemoMode = () => {
  try {
    localStorage.removeItem('demoMode')
  } catch {
    /* ignore */
  }
}
