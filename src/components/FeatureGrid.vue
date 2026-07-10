<template>
  <section class="features">
    <h2 class="section-title">核心功能</h2>
    <div class="grid">
      <div v-for="f in features" :key="f.title" class="card">
        <h3 class="card-title">{{ f.title }}</h3>
        <p class="card-desc">{{ f.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    title: '推理能力',
    desc: '采用强化学习训练，具备强大的逻辑推理与数学能力，在多项基准测试中表现优异。'
  },
  {
    title: '多模态理解',
    desc: '支持图文联合理解，可处理图表、公式、手写内容等视觉信息。'
  },
  {
    title: '128K 长上下文',
    desc: '单次可处理约 20 万字的文本内容，适用于长文档分析、论文阅读等场景。'
  },
  {
    title: '代码生成',
    desc: '支持多种编程语言，可完成代码编写、调试、优化与解释说明。'
  }
]
</script>

<style scoped>
.features {
  padding: 80px 24px;
  max-width: 960px;
  margin: 0 auto;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-h);
  text-align: center;
  margin: 0 0 48px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 20px var(--shadow);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 10px;
}

.card-desc {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .features {
    padding: 60px 16px;
  }
  .section-title {
    font-size: 26px;
    margin-bottom: 32px;
  }
}
</style>
