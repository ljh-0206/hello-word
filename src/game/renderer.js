import {
  CANVAS_W, CANVAS_H, TILE, TANK_SIZE,
  TILE_EMPTY, TILE_BRICK, TILE_STEEL, TILE_BASE, TILE_FOREST, TILE_WATER,
  TANK_REGULAR, TANK_FAST, TANK_HEAVY,
  POWER_STAR, POWER_SHIELD, POWER_BOMB,
  COLORS
} from './constants.js'

export function render(ctx, state) {
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  drawTerrain(ctx, state.map)

  for (const e of state.enemies) {
    if (e.alive) drawTank(ctx, e)
  }
  if (state.player.alive) {
    drawTank(ctx, state.player)
  }

  drawForestOverlay(ctx, state.map)

  for (const b of state.bullets) {
    ctx.fillStyle = b.isPlayer ? '#ffff66' : '#ffffff'
    ctx.fillRect(b.x - 2, b.y - 2, 4, 4)
  }

  if (state.powerUp) {
    drawPowerUp(ctx, state.powerUp, state.powerUpTimer)
  }

  for (const ex of state.explosions) {
    const r = ex.big ? Math.min((25 - ex.timer) * 2, 30) : Math.min((15 - ex.timer) * 2, 20)
    ctx.fillStyle = '#ff6600'
    ctx.beginPath()
    ctx.arc(ex.x, ex.y, Math.max(r, 4), 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffcc00'
    ctx.beginPath()
    ctx.arc(ex.x, ex.y, Math.max(r * 0.5, 2), 0, Math.PI * 2)
    ctx.fill()
  }

  renderUI(ctx, state)
}

function drawTerrain(ctx, map) {
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const t = map[r][c]
      if (t === TILE_FOREST) continue
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
        ctx.fillStyle = '#bbb'
        ctx.fillRect(x + 8, y + 8, 4, 4)
        ctx.fillRect(x + 20, y + 8, 4, 4)
        ctx.fillRect(x + 8, y + 20, 4, 4)
        ctx.fillRect(x + 20, y + 20, 4, 4)
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
        ctx.fillStyle = '#cc8800'
        ctx.font = '16px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('★', cx, cy + 1)
      } else if (t === TILE_WATER) {
        ctx.fillStyle = '#2244aa'
        ctx.fillRect(x, y, TILE, TILE)
        ctx.fillStyle = '#3366cc'
        for (let i = 0; i < 3; i++) {
          const wx = x + 6 + i * 10
          ctx.fillRect(wx, y + 6 + (i % 2) * 4, 8, 4)
          ctx.fillRect(wx + 4, y + 16 + (i % 2) * 4, 8, 4)
        }
      }
    }
  }
}

function drawForestOverlay(ctx, map) {
  ctx.save()
  ctx.globalAlpha = 0.35
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === TILE_FOREST) {
        const x = c * TILE
        const y = r * TILE
        ctx.fillStyle = '#116622'
        ctx.fillRect(x, y, TILE, TILE)
        ctx.fillStyle = '#228833'
        ctx.beginPath()
        ctx.arc(x + 8, y + 10, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + 22, y + 8, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + 16, y + 20, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + 26, y + 22, 6, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  ctx.restore()
}

function getTankColors(type) {
  switch (type) {
    case TANK_FAST:  return { body: '#44cc44', dark: '#228822' }
    case TANK_HEAVY: return { body: '#cc44cc', dark: '#882288' }
    default:         return { body: '#cc4444', dark: '#882222' }
  }
}

function drawTank(ctx, tank) {
  if (!tank.alive) return

  if (tank.invulnTimer && tank.invulnTimer > 0) {
    if (Math.floor(tank.invulnTimer / 6) % 2 === 0) return
  }

  let bodyColor, darkColor
  if (tank.isPlayer) {
    bodyColor = '#ffcc00'
    darkColor = '#cc8800'
  } else {
    const c = getTankColors(tank.type)
    bodyColor = c.body
    darkColor = c.dark
  }

  const half = TANK_SIZE / 2
  ctx.save()
  ctx.translate(tank.x, tank.y)
  const angle = [0, Math.PI, -Math.PI / 2, Math.PI / 2][tank.dir]
  ctx.rotate(angle)

  ctx.fillStyle = bodyColor
  ctx.fillRect(-half + 2, -half + 2, TANK_SIZE - 4, TANK_SIZE - 4)
  ctx.fillStyle = darkColor
  ctx.fillRect(-half + 4, -half + 4, TANK_SIZE - 8, TANK_SIZE - 8)
  ctx.fillStyle = bodyColor
  ctx.fillRect(-4, -half - 2, 8, 6)
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(0, 0, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = darkColor
  ctx.fillRect(-half, -half + 2, 4, TANK_SIZE - 4)
  ctx.fillRect(half - 4, -half + 2, 4, TANK_SIZE - 4)

  if (tank.type === TANK_HEAVY) {
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.strokeRect(-half + 6, -half + 6, TANK_SIZE - 12, TANK_SIZE - 12)
  }
  if (tank.isPlayer && tank.fireLevel >= 2) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(-1, -half - 6, 2, 4)
  }
  if (tank.isPlayer && tank.fireLevel >= 3) {
    ctx.fillRect(-1, -half - 10, 2, 4)
  }

  ctx.restore()

  if (tank.shieldTimer && tank.shieldTimer > 0) {
    ctx.save()
    ctx.strokeStyle = 'rgba(100,200,255,0.6)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(tank.x, tank.y, half + 4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(100,200,255,0.3)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(tank.x, tank.y, half + 6, 0, Math.PI * 2)
    ctx.stroke()
  ctx.restore()
}
}

function drawPowerUp(ctx, pu, timer) {
  if (Math.floor(timer / 8) % 2 === 0) return
  const x = pu.x
  const y = pu.y
  ctx.save()
  ctx.fillStyle = '#333'
  ctx.fillRect(x - 14, y - 14, 28, 28)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  ctx.strokeRect(x - 14, y - 14, 28, 28)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '20px monospace'
  if (pu.type === POWER_STAR) {
    ctx.fillStyle = '#ffcc00'
    ctx.fillText('★', x, y + 1)
  } else if (pu.type === POWER_SHIELD) {
    ctx.fillStyle = '#66ccff'
    ctx.fillText('◈', x, y + 1)
  } else if (pu.type === POWER_BOMB) {
    ctx.fillStyle = '#ff6644'
    ctx.fillText('●', x, y + 1)
  }
  ctx.restore()
}

function renderUI(ctx, state) {
  ctx.save()
  ctx.fillStyle = '#ffffff'
  ctx.font = '12px monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('得分: ' + state.player.score, 8, 8)
  ctx.textAlign = 'right'
  ctx.fillText('命数: ' + state.player.lives + '  关卡: ' + state.wave, CANVAS_W - 8, 8)

  if (state.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(state.win ? '过关！' : '游戏结束', CANVAS_W / 2, CANVAS_H / 2 - 30)
    ctx.font = '14px monospace'
    ctx.fillText(state.win ? '按 Enter 进入下一关' : '按 Enter 重新开始', CANVAS_W / 2, CANVAS_H / 2 + 20)
    ctx.fillText('按 ESC 退出', CANVAS_W / 2, CANVAS_H / 2 + 42)
  }
  ctx.restore()
}


