<template>
  <section class="usage">
    <div class="inner">
      <h2 class="section-title">应用场景</h2>
      <div class="list">
        <div v-for="(item, i) in items" :key="item.title" class="usage-card">
          <span class="usage-num">{{ pad(i + 1) }}</span>
          <div class="usage-body">
            <h3 class="usage-title">{{ item.title }}</h3>
            <p class="usage-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    title: '编程助手',
    desc: '从代码生成、Bug 调试到架构设计，DeepSeek 可协助开发者完成全流程工作。'
  },
  {
    title: '内容创作',
    desc: '文章撰写、文案策划、翻译润色，快速生成高质量文本内容。'
  },
  {
    title: '数据分析',
    desc: '上传表格或文档，AI 自动提取关键信息并生成分析结论。'
  }
]

function pad(n) {
  return String(n).padStart(2, '0')
}
</script>

<style scoped>
.usage {
  padding: 80px 24px;
}

.inner {
  max-width: 720px;
  margin: 0 auto;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-h);
  text-align: center;
  margin: 0 0 48px;
  letter-spacing: -0.3px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.usage-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  transition: border-color 0.2s;
}

.usage-card:hover {
  border-color: var(--accent);
}

.usage-num {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.usage-body {
  flex: 1;
}

.usage-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 6px;
}

.usage-desc {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 640px) {
  .usage {
    padding: 60px 16px;
  }
  .section-title {
    font-size: 24px;
    margin-bottom: 32px;
  }
}
</style>
