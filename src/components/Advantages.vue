<template>
  <section class="advantages">
    <div class="inner">
      <h2 class="section-title">技术优势</h2>
      <div class="table">
        <div v-for="item in items" :key="item.label" class="row">
          <span class="label">{{ item.label }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
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
  background: var(--section-bg);
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

.table {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--card-bg);
}

.row + .row {
  border-top: 1px solid var(--border);
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
}

.value {
  font-size: 14px;
  color: var(--text);
  text-align: right;
}

@media (max-width: 640px) {
  .advantages {
    padding: 60px 16px;
  }
  .section-title {
    font-size: 24px;
    margin-bottom: 32px;
  }
  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .value {
    text-align: left;
  }
}
</style>
