import {
  TILE, TANK_SIZE, TANK_SPEED, TANK_FAST_SPEED, BULLET_SPEED,
  TILE_EMPTY, TILE_BRICK, TILE_STEEL, TILE_BASE, TILE_WATER, TILE_FOREST,
  DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT,
  PLAYER_LIVES, ENEMY_SCORE, HEAVY_SCORE,
  TANK_REGULAR, TANK_FAST, TANK_HEAVY,
  POWER_STAR, POWER_SHIELD, POWER_BOMB,
  INVULN_DURATION, SPAWN_FLASH_DURATION,
  COLS, ROWS, CANVAS_W, CANVAS_H
} from './constants.js'
import { createMap, cloneMap, SPAWN_POINTS } from './map.js'
import { audio } from './audio.js'

const DIR_DELTA = {
  [DIR_UP]:    { x: 0, y: -1 },
  [DIR_DOWN]:  { x: 0, y: 1 },
  [DIR_LEFT]:  { x: -1, y: 0 },
  [DIR_RIGHT]: { x: 1, y: 0 }
}

function tankRect(t) {
  const half = TANK_SIZE / 2
  return { x: t.x - half, y: t.y - half, w: TANK_SIZE, h: TANK_SIZE }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function tileAt(map, px, py) {
  const c = Math.floor(px / TILE)
  const r = Math.floor(py / TILE)
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return -1
  return map[r][c]
}

function canMoveTo(map, x, y, size, allTanks) {
  const half = size / 2
  const corners = [
    { px: x - half + 1, py: y - half + 1 },
    { px: x + half - 1, py: y - half + 1 },
    { px: x - half + 1, py: y + half - 1 },
    { px: x + half - 1, py: y + half - 1 }
  ]
  for (const c of corners) {
    const t = tileAt(map, c.px, c.py)
    if (t === -1) return false
    if (t !== TILE_EMPTY && t !== TILE_FOREST) return false
  }

  const myRect = { x: x - half, y: y - half, w: size, h: size }
  for (const tank of allTanks) {
    if (!tank.alive) continue
    const other = tankRect(tank)
    if (rectsOverlap(myRect, other)) return false
  }
  return true
}

function moveTank(map, tank, dir, speed, allTanks) {
  const d = DIR_DELTA[dir]
  if (!d) return false
  const nx = tank.x + d.x * speed
  const ny = tank.y + d.y * speed
  const clampedX = Math.max(TANK_SIZE / 2, Math.min(CANVAS_W - TANK_SIZE / 2, nx))
  const clampedY = Math.max(TANK_SIZE / 2, Math.min(CANVAS_H - TANK_SIZE / 2, ny))
  if (canMoveTo(map, clampedX, clampedY, TANK_SIZE, allTanks)) {
    tank.x = clampedX
    tank.y = clampedY
    return true
  }
  return false
}

function destroyTile(map, px, py) {
  const c = Math.floor(px / TILE)
  const r = Math.floor(py / TILE)
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return
  if (map[r][c] === TILE_BRICK) {
    map[r][c] = TILE_EMPTY
  }
}

function spawnEnemy(state) {
  if (state.spawned >= state.totalEnemies) return
  const pt = SPAWN_POINTS[state.spawnIndex % SPAWN_POINTS.length]
  state.spawnIndex++
  const ex = pt.c * TILE + TILE / 2
  const ey = pt.r * TILE + TILE / 2

  const allButNew = [...state.enemies]
  if (state.player.alive) allButNew.push(state.player)
  const blocked = !canMoveTo(state.map, ex, ey, TANK_SIZE, allButNew)
  if (blocked) return

  const w = state.wave
  const types = []
  for (let i = 0; i < 5; i++) types.push(TANK_REGULAR)
  if (w >= 2) { types.push(TANK_FAST); types.push(TANK_FAST) }
  if (w >= 3) { types.push(TANK_HEAVY) }
  if (w >= 4) { types.push(TANK_HEAVY); types.push(TANK_HEAVY) }

  const roll = (Math.random() * types.length) | 0
  const type = types[Math.min(roll, types.length - 1)]
  const hp = type === TANK_HEAVY ? 3 : 1
  const speed = type === TANK_FAST ? TANK_FAST_SPEED : TANK_SPEED

  state.enemies.push({
    x: ex, y: ey, dir: DIR_DOWN, alive: true,
    type, hp, speed,
    cooldown: 0, moveDir: DIR_DOWN,
    changeDirTimer: Math.max(30, 60 + Math.random() * 120 - w * 5) | 0,
    invulnTimer: SPAWN_FLASH_DURATION
  })
  state.spawned++
}

function randomPowerUp() {
  const powers = [POWER_STAR, POWER_STAR, POWER_SHIELD, POWER_BOMB]
  return powers[(Math.random() * powers.length) | 0]
}

function getPowerUpDropRate(wave) {
  return Math.max(2, 4 - Math.floor(wave / 3))
}

export function createGame(onWin, onLose) {
  const map = createMap(1)
  const state = {
    map,
    player: {
      x: 5 * TILE + TILE / 2,
      y: 17 * TILE + TILE / 2,
      dir: DIR_UP, alive: true, isPlayer: true,
      lives: PLAYER_LIVES, score: 0, cooldown: 0,
      invulnTimer: INVULN_DURATION,
      fireLevel: 1,
      shieldTimer: 0
    },
    enemies: [],
    bullets: [],
    explosions: [],
    wave: 1,
    totalEnemies: 6,
    spawned: 0,
    spawnTimer: 0,
    spawnIndex: 0,
    gameOver: false,
    win: false,
    keys: {},
    powerUp: null,
    powerUpTimer: 0,
    killCount: 0,
    powerUpCooldown: 0,
    paused: true,
    frameCount: 0
  }

  function addExplosion(x, y, big) {
    state.explosions.push({ x, y, timer: big ? 25 : 15, big })
  }

  function fire(tank, isPlayer) {
    if (!tank.alive) return
    const half = TANK_SIZE / 2
    const d = DIR_DELTA[tank.dir]

    state.bullets.push({
      x: tank.x + d.x * half,
      y: tank.y + d.y * half,
      dir: tank.dir,
      isPlayer
    })

    if (isPlayer && state.player.fireLevel >= 3) {
      const perp = tank.dir === DIR_UP || tank.dir === DIR_DOWN ? DIR_LEFT : DIR_UP
      const pd = DIR_DELTA[perp]
      state.bullets.push({
        x: tank.x + d.x * half + pd.x * 6,
        y: tank.y + d.y * half + pd.y * 6,
        dir: tank.dir,
        isPlayer: true
      })
      state.bullets.push({
        x: tank.x + d.x * half - pd.x * 6,
        y: tank.y + d.y * half - pd.y * 6,
        dir: tank.dir,
        isPlayer: true
      })
    }

    if (isPlayer) audio.shoot()
  }

  function killTank(tank) {
    tank.alive = false
    addExplosion(tank.x, tank.y, true)
    audio.explosion()
  }

  function collectPowerUp() {
    const pu = state.powerUp
    if (!pu) return
    if (pu.type === POWER_STAR) {
      state.player.fireLevel = Math.min(3, state.player.fireLevel + 1)
    } else if (pu.type === POWER_SHIELD) {
      state.player.shieldTimer = 300
      state.player.invulnTimer = 300
    } else if (pu.type === POWER_BOMB) {
      for (const e of state.enemies) {
        if (e.alive) {
          e.alive = false
          addExplosion(e.x, e.y, false)
          state.player.score += e.type === TANK_HEAVY ? HEAVY_SCORE : ENEMY_SCORE
        }
      }
      state.enemies = state.enemies.filter(e => e.alive)
      state.killCount += 10
    }
    state.powerUp = null
    state.powerUpTimer = 0
    audio.powerUp()
  }

  return {
    state,
    start() {
      state.paused = false
    },
    update() {
      if (state.gameOver || state.paused) return
      state.frameCount++

      const enemyTanksOnly = [...state.enemies]

      // player
      if (state.player.alive) {
        const k = state.keys
        if (k['ArrowUp']) { state.player.dir = DIR_UP; moveTank(state.map, state.player, DIR_UP, TANK_SPEED, enemyTanksOnly) }
        else if (k['ArrowDown']) { state.player.dir = DIR_DOWN; moveTank(state.map, state.player, DIR_DOWN, TANK_SPEED, enemyTanksOnly) }
        else if (k['ArrowLeft']) { state.player.dir = DIR_LEFT; moveTank(state.map, state.player, DIR_LEFT, TANK_SPEED, enemyTanksOnly) }
        else if (k['ArrowRight']) { state.player.dir = DIR_RIGHT; moveTank(state.map, state.player, DIR_RIGHT, TANK_SPEED, enemyTanksOnly) }

        state.player.cooldown--
        if (k[' '] && state.player.cooldown <= 0) {
          state.player.cooldown = state.player.fireLevel >= 3 ? 10 : 15
          fire(state.player, true)
        }

        if (state.player.invulnTimer > 0) state.player.invulnTimer--
        if (state.player.shieldTimer > 0) state.player.shieldTimer--
      }

      // enemies
      for (const e of state.enemies) {
        if (!e.alive) continue
        if (e.invulnTimer > 0) { e.invulnTimer--; continue }

        const enemiesExcludingSelf = state.enemies.filter(x => x !== e)
        const allOtherTanks = [...enemiesExcludingSelf]
        if (state.player.alive) allOtherTanks.push(state.player)

        e.changeDirTimer--
        if (e.changeDirTimer <= 0 || !canMoveTo(state.map, e.x, e.y, TANK_SIZE, allOtherTanks)) {
          e.changeDirTimer = Math.max(30, 60 + Math.random() * 90 - state.wave * 5) | 0
          const dirs = [DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT]
          const shuffled = dirs.sort(() => Math.random() - 0.5)
          let moved = false
          for (const d of shuffled) {
            e.dir = d
            e.moveDir = d
            if (moveTank(state.map, e, d, e.speed, allOtherTanks)) {
              moved = true
              break
            }
          }
          if (!moved) continue
        } else {
          e.dir = e.moveDir
          moveTank(state.map, e, e.moveDir, e.speed, allOtherTanks)
        }

        e.cooldown--
        if (e.cooldown <= 0) {
          const cd = e.type === TANK_HEAVY ? 90 : Math.max(20, 45 + Math.random() * 45 - state.wave * 3) | 0
          e.cooldown = cd
          fire(e, false)
          if (!e.isPlayer) audio.shoot()
        }
      }
      state.enemies = state.enemies.filter(e => e.alive)

      // bullets
      for (let i = state.bullets.length - 1; i >= 0; i--) {
        const b = state.bullets[i]
        const d = DIR_DELTA[b.dir]
        b.x += d.x * BULLET_SPEED
        b.y += d.y * BULLET_SPEED

        let remove = false
        if (b.x < 0 || b.x > CANVAS_W || b.y < 0 || b.y > CANVAS_H) {
          remove = true
        } else {
          const t = tileAt(state.map, b.x, b.y)
          if (t === TILE_BRICK) {
            destroyTile(state.map, b.x, b.y)
            remove = true
            audio.hit()
          } else if (t === TILE_STEEL) {
            remove = true
            audio.hit()
          } else if (t === TILE_BASE) {
            state.map[Math.floor(b.y / TILE)][Math.floor(b.x / TILE)] = 0
            addExplosion(b.x, b.y, true)
            audio.explosion()
            onLose(state)
            remove = true
          } else if (t !== TILE_WATER && t !== TILE_FOREST) {
            // hit enemies
            if (b.isPlayer) {
              for (const e of state.enemies) {
                if (!e.alive) continue
                const er = tankRect(e)
                if (b.x >= er.x && b.x <= er.x + er.w && b.y >= er.y && b.y <= er.y + er.h) {
                  const score = e.type === TANK_HEAVY ? HEAVY_SCORE : ENEMY_SCORE
                  state.player.score += score
                  e.hp--
                  if (e.hp <= 0) {
                    killTank(e)
                    state.killCount++
                    state.powerUpCooldown++
                    const dropRate = getPowerUpDropRate(state.wave)
                    if (state.killCount % dropRate === 0 && !state.powerUp) {
                      state.powerUp = { x: e.x, y: e.y, type: randomPowerUp(), timer: 600 }
                      state.powerUpTimer = 0
                    }
                  } else {
                    audio.hit()
                  }
                  remove = true
                  break
                }
              }
            }
            // hit player
            if (!b.isPlayer && state.player.alive && state.player.invulnTimer <= 0 && state.player.shieldTimer <= 0) {
              const pr = tankRect(state.player)
              if (b.x >= pr.x && b.x <= pr.x + pr.w && b.y >= pr.y && b.y <= pr.y + pr.h) {
                killTank(state.player)
                state.player.lives--
                if (state.player.lives <= 0) {
                  onLose(state)
                } else {
                  state.player.invulnTimer = INVULN_DURATION
                }
                remove = true
              }
            }
          }
        }
        if (remove) state.bullets.splice(i, 1)
      }

      // explosions
      for (let i = state.explosions.length - 1; i >= 0; i--) {
        state.explosions[i].timer--
        if (state.explosions[i].timer <= 0) state.explosions.splice(i, 1)
      }

      // spawn enemies
      const spawnInterval = Math.max(60, 150 - state.wave * 10)
      state.spawnTimer++
      if (state.spawnTimer >= spawnInterval && state.enemies.filter(e => e.alive && e.invulnTimer <= 0).length < 3 && state.spawned < state.totalEnemies) {
        state.spawnTimer = 0
        spawnEnemy(state)
      }

      // power-up
      if (state.powerUp) {
        state.powerUp.timer--
        state.powerUpTimer++
        if (state.powerUp.timer <= 0) {
          state.powerUp = null
        } else if (state.player.alive) {
          const pr = tankRect(state.player)
          const pw = 24
          const puRect = { x: state.powerUp.x - pw / 2, y: state.powerUp.y - pw / 2, w: pw, h: pw }
          if (rectsOverlap(pr, puRect)) {
            collectPowerUp()
          }
        }
      }

      // revive player
      if (!state.player.alive && state.player.lives > 0) {
        state.player.x = 4 * TILE + TILE / 2
        state.player.y = 14 * TILE + TILE / 2
        state.player.dir = DIR_UP
        state.player.alive = true
        state.player.invulnTimer = INVULN_DURATION
        state.player.shieldTimer = INVULN_DURATION
        state.player.cooldown = 0
      }

      // win check
      if (state.enemies.length === 0 && state.spawned >= state.totalEnemies && !state.gameOver) {
        onWin(state)
      }
    },
    reset() {
      state.map = createMap(1)
      state.player.x = 5 * TILE + TILE / 2
      state.player.y = 17 * TILE + TILE / 2
      state.player.dir = DIR_UP
      state.player.alive = true
      state.player.lives = PLAYER_LIVES
      state.player.score = 0
      state.player.cooldown = 0
      state.player.invulnTimer = INVULN_DURATION
      state.player.fireLevel = 1
      state.player.shieldTimer = 0
      state.enemies = []
      state.bullets = []
      state.explosions = []
      state.wave = 1
      state.totalEnemies = 6
      state.spawned = 0
      state.spawnTimer = 0
      state.spawnIndex = 0
      state.gameOver = false
      state.win = false
      state.powerUp = null
      state.powerUpTimer = 0
      state.killCount = 0
      state.powerUpCooldown = 0
      state.paused = false
      state.frameCount = 0
    },
    nextWave() {
      const next = state.wave + 1
      state.wave = next
      state.totalEnemies = 6 + next * 3
      state.spawned = 0
      state.spawnTimer = 0
      state.spawnIndex = 0
      state.enemies = []
      state.bullets = []
      state.explosions = []
      state.player.x = 5 * TILE + TILE / 2
      state.player.y = 17 * TILE + TILE / 2
      state.player.dir = DIR_UP
      state.player.alive = true
      state.player.cooldown = 0
      state.player.invulnTimer = INVULN_DURATION
      state.player.fireLevel = Math.max(1, state.player.fireLevel)
      state.map = cloneMap(createMap(next))
      state.gameOver = false
      state.win = false
      state.powerUp = null
      state.powerUpTimer = 0
    },
    togglePause() {
      if (!state.gameOver) state.paused = !state.paused
    }
  }
}
