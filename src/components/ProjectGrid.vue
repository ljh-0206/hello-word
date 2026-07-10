<script setup>
const emit = defineEmits(['select'])

const projects = [
  {
    id: 'battle-city',
    title: '坦克大战',
    desc: '经典红白机游戏复刻，基于 Canvas 实现完整游戏逻辑与物理碰撞',
    tags: ['Vue 3', 'Canvas'],
    status: '上线',
    icon: '🎮'
  },
  {
    id: 'placeholder',
    title: '下一个项目',
    desc: '新的项目正在规划中，敬请期待',
    tags: [],
    status: '即将上线',
    icon: '🚀'
  }
]
</script>

<template>
  <section class="projects">
    <div class="inner">
      <h2 class="section-title">项目列表</h2>
      <div class="grid">
        <div
          v-for="p in projects"
          :key="p.id"
          class="card"
          :class="{ 'card-coming': p.status === '即将上线' }"
          @click="emit('select', p.id)"
        >
          <div class="card-icon">{{ p.icon }}</div>
          <div class="card-body">
            <h3 class="card-title">{{ p.title }}</h3>
            <p class="card-desc">{{ p.desc }}</p>
            <div class="card-footer">
              <div class="tags">
                <span v-for="tag in p.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <span class="status" :class="p.status === '上线' ? 'status-live' : 'status-coming'">
                {{ p.status }}
              </span>
            </div>
          </div>
          <button class="card-btn" :class="p.status === '上线' ? 'btn-live' : 'btn-coming'">
            {{ p.status === '上线' ? '进入项目' : '敬请期待' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  padding: 0 24px 80px;
}
.inner {
  max-width: 960px;
  margin: 0 auto;
}
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-h);
  text-align: center;
  margin: 0 0 32px;
  letter-spacing: -0.3px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
  position: relative;
}
.card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 28px var(--shadow);
  transform: translateY(-3px);
}
.card-coming {
  opacity: 0.5;
  cursor: default;
}
.card-coming:hover {
  border-color: var(--border);
  box-shadow: none;
}
.card-icon {
  font-size: 40px;
  line-height: 1;
  margin-bottom: 16px;
}
.card-body {
  flex: 1;
}
.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 8px;
}
.card-desc {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  margin: 0 0 16px;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tags {
  display: flex;
  gap: 6px;
}
.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--section-bg);
  color: var(--label-dim);
  border: 1px solid var(--border);
}
.status {
  font-size: 12px;
  font-weight: 500;
}
.status-live {
  color: var(--accent);
}
.status-coming {
  color: var(--label-dim);
}
.card-btn {
  margin-top: 16px;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-live {
  background: var(--accent);
  color: #fff;
}
.btn-live:hover {
  background: var(--accent-hover);
}
.btn-coming {
  background: var(--section-bg);
  color: var(--label-dim);
  border: 1px solid var(--border);
  cursor: default;
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .projects {
    padding: 0 16px 60px;
  }
}
</style>
