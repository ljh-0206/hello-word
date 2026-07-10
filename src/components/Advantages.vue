<template>
  <section class="advantages">
    <h2 class="section-title">技术优势</h2>
    <div class="items">
      <div v-for="item in items" :key="item.label" class="advantage-item">
        <span class="advantage-label">{{ item.label }}</span>
        <span class="advantage-value">{{ item.value }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  { label: '开源许可', value: 'MIT 协议，可自由用于商业项目' },
  { label: 'API 成本', value: '行业领先的低价，适合大规模调用' },
  { label: '部署方式', value: '云端 API 与私有化部署均可' },
  { label: '文件解析', value: '支持 PDF、Word、Excel、PPT、图片等多种格式' }
]
</script>

<style scoped>
.advantages {
  padding: 80px 24px;
  max-width: 720px;
  margin: 0 auto;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-h);
  text-align: center;
  margin: 0 0 48px;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.advantage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: var(--card-bg);
}

.advantage-item + .advantage-item {
  border-top: 1px solid var(--border);
}

.advantage-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-h);
}

.advantage-value {
  font-size: 14px;
  color: var(--text);
  text-align: right;
}

@media (max-width: 640px) {
  .advantages {
    padding: 60px 16px;
  }
  .section-title {
    font-size: 26px;
    margin-bottom: 32px;
  }
  .advantage-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .advantage-value {
    text-align: left;
  }
}
</style>
