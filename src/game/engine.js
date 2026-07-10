import {
  TILE, TANK_SIZE, TANK_SPEED, BULLET_SPEED,
  TILE_EMPTY, TILE_BRICK, TILE_BASE,
  DIR_UP, DIR_DOWN, DIR_LEFT, DIR_RIGHT,
  PLAYER_LIVES, ENEMY_SCORE,
  COLS, ROWS, CANVAS_W, CANVAS_H
} from './constants.js'
import { createMap, cloneMap, SPAWN_POINTS } from './map.js'

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

function tileAt(map, px, py) {
  const c = Math.floor(px / TILE)
  const r = Math.floor(py / TILE)
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return -1
  return map[r][c]
}

function canMoveTo(map, x, y, size) {
  const half = size / 2
  const corners = [
    { px: x - half + 1, py: y - half + 1 },
    { px: x + half - 1, py: y - half + 1 },
    { px: x - half + 1, py: y + half - 1 },
    { px: x + half - 1, py: y + half - 1 }
  ]
  for (const c of corners) {
    const t = tileAt(map, c.px, c.py)
    if (t !== 0 && t !== -1) return false
  }
  return true
}

function moveTank(map, tank, dir) {
  const d = DIR_DELTA[dir]
  if (!d) return false
  const nx = tank.x + d.x * TANK_SPEED
  const ny = tank.y + d.y * TANK_SPEED
  const clampedX = Math.max(TANK_SIZE / 2, Math.min(CANVAS_W - TANK_SIZE / 2, nx))
  const clampedY = Math.max(TANK_SIZE / 2, Math.min(CANVAS_H - TANK_SIZE / 2, ny))
  if (canMoveTo(map, clampedX, clampedY, TANK_SIZE)) {
    tank.x = clampedX
    tank.y = clampedY
    return true
  }
  return false
}

function destroyTile(map, px, py) {
  const c = Math.floor(px / TILE)
  const r = Math.floor(py / TILE)
  if (r >= 0 && r < ROWS && c >= 0 && c < COLS && map[r][c] === TILE_BRICK) {
    map[r][c] = TILE_EMPTY
  }
}

function attemptSpawn(state) {
  if (state.spawned >= state.totalEnemies) return
  const pt = SPAWN_POINTS[state.spawnIndex % SPAWN_POINTS.length]
  state.spawnIndex++
  const ex = pt.c * TILE + TILE / 2
  const ey = pt.r * TILE + TILE / 2
  const blocked = state.enemies.some(e => Math.abs(e.x - ex) < TILE && Math.abs(e.y - ey) < TILE)
  if (blocked) return
  state.enemies.push({
    x: ex, y: ey, dir: DIR_DOWN, alive: true,
    cooldown: 0, moveDir: DIR_DOWN,
    changeDirTimer: 60 + Math.random() * 120 | 0
  })
  state.spawned++
}

export function createGame(onWin, onLose) {
  const map = createMap()
  const state = {
    map,
    player: {
      x: 4 * TILE + TILE / 2,
      y: 14 * TILE + TILE / 2,
      dir: DIR_UP, alive: true,
      lives: PLAYER_LIVES, score: 0, cooldown: 0
    },
    enemies: [],
    bullets: [],
    explosions: [],
    wave: 1,
    totalEnemies: 4,
    spawned: 0,
    spawnTimer: 0,
    spawnIndex: 0,
    gameOver: false,
    win: false,
    keys: {}
  }

  function addExplosion(x, y) {
    state.explosions.push({ x, y, timer: 15 })
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
  }

  function killTank(tank) {
    tank.alive = false
    addExplosion(tank.x, tank.y)
  }

  return {
    state,
    update() {
      if (state.gameOver) return

      // player
      if (state.player.alive) {
        const k = state.keys
        if (k['ArrowUp']) { state.player.dir = DIR_UP; moveTank(state.map, state.player, DIR_UP) }
        else if (k['ArrowDown']) { state.player.dir = DIR_DOWN; moveTank(state.map, state.player, DIR_DOWN) }
        else if (k['ArrowLeft']) { state.player.dir = DIR_LEFT; moveTank(state.map, state.player, DIR_LEFT) }
        else if (k['ArrowRight']) { state.player.dir = DIR_RIGHT; moveTank(state.map, state.player, DIR_RIGHT) }
        state.player.cooldown--
        if (k[' '] && state.player.cooldown <= 0) {
          state.player.cooldown = 15
          fire(state.player, true)
        }
      }

      // enemies
      for (const e of state.enemies) {
        if (!e.alive) continue
        e.changeDirTimer--
        if (e.changeDirTimer <= 0) {
          e.changeDirTimer = 60 + Math.random() * 120 | 0
          if (Math.random() < 0.5) e.moveDir = (Math.random() * 4) | 0
        }
        e.dir = e.moveDir
        moveTank(state.map, e, e.moveDir)
        e.cooldown--
        if (e.cooldown <= 0) {
          e.cooldown = 60 + Math.random() * 60 | 0
          fire(e, false)
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
          } else if (t === TILE_BASE) {
            state.map[Math.floor(b.y / TILE)][Math.floor(b.x / TILE)] = 0
            onLose(state)
            remove = true
          } else {
            // hit enemies
            if (b.isPlayer) {
              for (const e of state.enemies) {
                if (!e.alive) continue
                const er = tankRect(e)
                if (b.x >= er.x && b.x <= er.x + er.w && b.y >= er.y && b.y <= er.y + er.h) {
                  killTank(e)
                  state.player.score += ENEMY_SCORE
                  remove = true
                  break
                }
              }
            }
            // hit player
            if (!b.isPlayer && state.player.alive) {
              const pr = tankRect(state.player)
              if (b.x >= pr.x && b.x <= pr.x + pr.w && b.y >= pr.y && b.y <= pr.y + pr.h) {
                killTank(state.player)
                state.player.lives--
                if (state.player.lives <= 0) onLose(state)
                remove = true
              }
            }
          }
        }
        if (remove) {
          state.bullets.splice(i, 1)
        }
      }

      // explosions
      for (let i = state.explosions.length - 1; i >= 0; i--) {
        state.explosions[i].timer--
        if (state.explosions[i].timer <= 0) state.explosions.splice(i, 1)
      }

      // spawn enemies
      state.spawnTimer++
      if (state.spawnTimer >= 120 && state.enemies.length < 3 && state.spawned < state.totalEnemies) {
        state.spawnTimer = 0
        attemptSpawn(state)
      }

      // revive player
      if (!state.player.alive && state.player.lives > 0) {
        state.player.x = 4 * TILE + TILE / 2
        state.player.y = 14 * TILE + TILE / 2
        state.player.alive = true
      }

      // win check
      if (state.enemies.length === 0 && state.spawned >= state.totalEnemies) {
        onWin(state)
      }
    },
    reset() {
      state.map = createMap()
      state.player.x = 4 * TILE + TILE / 2
      state.player.y = 14 * TILE + TILE / 2
      state.player.dir = DIR_UP
      state.player.alive = true
      state.player.lives = PLAYER_LIVES
      state.player.score = 0
      state.player.cooldown = 0
      state.enemies = []
      state.bullets = []
      state.explosions = []
      state.wave = 1
      state.totalEnemies = 4
      state.spawned = 0
      state.spawnTimer = 0
      state.spawnIndex = 0
      state.gameOver = false
      state.win = false
    },
    nextWave() {
      state.wave++
      state.totalEnemies = 4 + state.wave * 2
      state.spawned = 0
      state.spawnTimer = 0
      state.spawnIndex = 0
      state.enemies = []
      state.bullets = []
      state.player.x = 4 * TILE + TILE / 2
      state.player.y = 14 * TILE + TILE / 2
      state.player.dir = DIR_UP
      state.player.alive = true
      state.player.cooldown = 0
      state.map = cloneMap(createMap())
      state.gameOver = false
      state.win = false
    }
  }
}
