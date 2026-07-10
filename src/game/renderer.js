import {
  CANVAS_W, CANVAS_H, TILE, TANK_SIZE,
  TILE_EMPTY, TILE_BRICK, TILE_STEEL, TILE_BASE,
  COLORS
} from './constants.js'

export function render(ctx, state) {
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  drawMap(ctx, state.map)
  drawTank(ctx, state.player, COLORS.player, COLORS.playerDark)
  for (const e of state.enemies) {
    if (e.alive) drawTank(ctx, e, COLORS.enemy, COLORS.enemyDark)
  }
  ctx.fillStyle = '#ffff66'
  for (const b of state.bullets) {
    ctx.fillStyle = b.isPlayer ? '#ffff66' : '#ffffff'
    ctx.fillRect(b.x - 2, b.y - 2, 4, 4)
  }
  for (const ex of state.explosions) {
    const r = (15 - ex.timer) * 2
    ctx.fillStyle = '#ff6600'
    ctx.beginPath()
    ctx.arc(ex.x, ex.y, Math.max(r, 4), 0, Math.PI * 2)
    ctx.fill()
  }
  renderUI(ctx, state)
}

function drawMap(ctx, map) {
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const t = map[r][c]
      const x = c * TILE
      const y = r * TILE
      if (t === TILE_BRICK) {
        ctx.fillStyle = '#cc6633'
        ctx.fillRect(x, y, TILE, TILE)
        ctx.strokeStyle = '#994422'
        ctx.lineWidth = 1
        ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2)
        ctx.beginPath()
        ctx.moveTo(x + TILE / 2, y)
        ctx.lineTo(x + TILE / 2, y + TILE)
        ctx.moveTo(x, y + TILE / 2)
        ctx.lineTo(x + TILE, y + TILE / 2)
        ctx.stroke()
      } else if (t === TILE_STEEL) {
        ctx.fillStyle = '#999999'
        ctx.fillRect(x, y, TILE, TILE)
        ctx.strokeStyle = '#777'
        ctx.lineWidth = 1
        ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4)
        ctx.strokeRect(x + 4, y + 4, TILE - 8, TILE - 8)
      } else if (t === TILE_BASE) {
        const cx = x + TILE / 2
        const cy = y + TILE / 2
        ctx.fillStyle = '#ffcc00'
        ctx.beginPath()
        ctx.moveTo(cx, y + 2)
        ctx.lineTo(x + TILE - 2, cy)
        ctx.lineTo(cx, y + TILE - 2)
        ctx.lineTo(x + 2, cy)
        ctx.closePath()
        ctx.fill()
      }
    }
  }
}

function drawTank(ctx, tank, color, darkColor) {
  if (!tank.alive) return
  const half = TANK_SIZE / 2
  ctx.save()
  ctx.translate(tank.x, tank.y)
  const angle = [0, Math.PI, -Math.PI / 2, Math.PI / 2][tank.dir]
  ctx.rotate(angle)
  ctx.fillStyle = color
  ctx.fillRect(-half + 2, -half + 2, TANK_SIZE - 4, TANK_SIZE - 4)
  ctx.fillStyle = darkColor
  ctx.fillRect(-half + 4, -half + 4, TANK_SIZE - 8, TANK_SIZE - 8)
  ctx.fillStyle = color
  ctx.fillRect(-4, -half - 2, 8, 6)
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(0, 0, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = darkColor
  ctx.fillRect(-half, -half + 2, 4, TANK_SIZE - 4)
  ctx.fillRect(half - 4, -half + 2, 4, TANK_SIZE - 4)
  ctx.restore()
}

function renderUI(ctx, state) {
  ctx.fillStyle = '#ffffff'
  ctx.font = '12px monospace'
  ctx.textAlign = 'left'
  ctx.fillText('SCORE: ' + state.player.score, 8, 16)
  ctx.textAlign = 'right'
  ctx.fillText('LIVES: ' + state.player.lives + '  WAVE: ' + state.wave, CANVAS_W - 8, 16)
  if (state.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(state.win ? 'YOU WIN!' : 'GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 10)
    ctx.font = '14px monospace'
    ctx.fillText('Press ENTER to restart', CANVAS_W / 2, CANVAS_H / 2 + 30)
    ctx.fillText('Press ESC to exit', CANVAS_W / 2, CANVAS_H / 2 + 52)
  }
}
