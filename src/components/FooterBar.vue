<template>
  <footer class="footer">
    <div class="footer-inner">
      <span class="footer-copy">&copy; 2026 DeepSeek</span>
      <a href="https://deepseek.com" class="footer-link" target="_blank" rel="noopener">deepseek.com</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 0 24px;
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-copy {
  font-size: 13px;
  color: var(--label-dim);
}

.footer-link {
  font-size: 13px;
  color: var(--label-dim);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--accent);
}
</style>
