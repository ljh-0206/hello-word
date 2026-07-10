<template>
  <section class="hero">
    <h1 class="hero-title">探索未至之境</h1>
    <p class="hero-desc">
      由深度求索公司研发的 AI 推理模型，具备强大的推理能力、多模态理解与长上下文处理能力，开源可商用。
    </p>
    <div class="hero-actions">
      <a href="https://chat.deepseek.com" class="btn btn-primary" target="_blank" rel="noopener">开始对话</a>
      <a href="https://platform.deepseek.com" class="btn btn-outline" target="_blank" rel="noopener">API 开放平台</a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 120px 24px 64px;
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-h);
  letter-spacing: -1.2px;
  margin: 0 0 16px;
  line-height: 1.15;
}

.hero-desc {
  font-size: 16px;
  color: var(--text);
  line-height: 1.7;
  margin: 0 0 32px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-outline {
  background: transparent;
  color: var(--text-h);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 640px) {
  .hero {
    padding: 100px 16px 48px;
  }
  .hero-title {
    font-size: 32px;
  }
  .hero-desc {
    font-size: 15px;
  }
}
</style>
