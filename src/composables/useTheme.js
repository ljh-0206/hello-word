import { ref, watchEffect } from 'vue'

const isDark = ref(false)

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
  isDark.value = dark
}

export function useTheme() {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored === 'dark')
  } else {
    applyTheme(getSystemPreference())
  }

  watchEffect(() => {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches)
    }
  })

  function toggleTheme() {
    applyTheme(!isDark.value)
  }

  return { isDark, toggleTheme }
}
