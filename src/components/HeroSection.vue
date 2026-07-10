<template>
  <section class="hero">
    <div class="geo geo-1"></div>
    <div class="geo geo-2"></div>

    <h1 class="hero-title">DeepSeek 项目成果</h1>
    <p class="hero-desc">
      基于 DeepSeek 能力打造的开源项目合集。从经典游戏复刻到创新应用探索，
      每个项目都是用 AI 辅助开发的实践尝试。
    </p>

    <div class="stats">
      <div class="stat-item">
        <span class="stat-num">1</span>
        <span class="stat-label">已上线</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">3</span>
        <span class="stat-label">技术栈</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">更多</span>
        <span class="stat-label">待发布</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 80px 24px 48px;
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
  position: relative;
}

.geo {
  position: absolute;
  border-radius: 50%;
  border: 2px solid var(--border);
  pointer-events: none;
}
.geo-1 {
  width: 60px;
  height: 60px;
  top: 40px;
  left: -20px;
  opacity: 0.4;
}
.geo-2 {
  width: 40px;
  height: 40px;
  bottom: 60px;
  right: -10px;
  opacity: 0.3;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-h);
  letter-spacing: -0.8px;
  margin: 0 0 16px;
  line-height: 1.2;
  position: relative;
}

.hero-desc {
  font-size: 15px;
  color: var(--text);
  line-height: 1.8;
  margin: 0 0 36px;
  position: relative;
}

.stats {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  position: relative;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-h);
  line-height: 1.1;
}
.stat-label {
  font-size: 12px;
  color: var(--label-dim);
}
.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
}

@media (max-width: 640px) {
  .hero {
    padding: 64px 16px 32px;
  }
  .hero-title {
    font-size: 28px;
  }
  .stats {
    gap: 16px;
    padding: 12px 20px;
  }
  .stat-num {
    font-size: 18px;
  }
  .geo-1, .geo-2 {
    display: none;
  }
}
</style>
