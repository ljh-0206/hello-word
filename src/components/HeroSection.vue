<template>
  <section class="hero">
    <h1 class="hero-title">DeepSeek</h1>
    <p class="hero-subtitle">新一代 AI 推理模型，激发你的创造力</p>
    <p class="hero-desc">
      由深度求索公司研发，具备强大的推理能力、多模态理解与长上下文处理能力。
      开源可商用，赋能每一位开发者与创作者。
    </p>
    <div class="hero-actions">
      <a href="https://chat.deepseek.com" class="btn btn-primary" target="_blank" rel="noopener">开始使用</a>
      <a href="https://deepseek.com" class="btn btn-secondary" target="_blank" rel="noopener">了解更多</a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 140px 24px 80px;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: var(--text-h);
  letter-spacing: -1.5px;
  margin: 0 0 16px;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 22px;
  color: var(--accent);
  margin: 0 0 20px;
  font-weight: 500;
}

.hero-desc {
  font-size: 17px;
  color: var(--text);
  line-height: 1.7;
  margin: 0 0 36px;
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
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
}

.btn-primary:hover {
  background: var(--accent-hover);
  box-shadow: 0 4px 14px var(--accent-glow);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-h);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 640px) {
  .hero {
    padding: 120px 16px 60px;
  }
  .hero-title {
    font-size: 36px;
  }
  .hero-subtitle {
    font-size: 18px;
  }
  .hero-desc {
    font-size: 15px;
  }
}
</style>
