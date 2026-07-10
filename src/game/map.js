import { TILE_BRICK, TILE_STEEL, TILE_BASE, TILE_WATER, TILE_FOREST, COLS, ROWS } from './constants.js'

function createEmptyMap() {
  const m = []
  for (let r = 0; r < ROWS; r++) {
    m[r] = []
    for (let c = 0; c < COLS; c++) {
      m[r][c] = 0
    }
  }
  return m
}

function set(m, r, c, v) {
  if (r >= 0 && r < ROWS && c >= 0 && c < COLS) m[r][c] = v
}

function fillRect(m, r1, c1, r2, c2, v) {
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++)
      set(m, r, c, v)
}

function addBase(m, wave) {
  const brick = TILE_BRICK
  const steel = TILE_STEEL
  const wall = wave >= 3 ? steel : brick
  const inner = wave >= 5 ? steel : brick

  set(m, 14, 14, wall)
  set(m, 14, 17, wall)
  fillRect(m, 15, 14, 15, 17, wall)
  fillRect(m, 16, 15, 16, 16, inner)
  set(m, 17, 15, TILE_BASE)
  set(m, 17, 16, TILE_BASE)
  set(m, 16, 14, wall)
  set(m, 16, 17, wall)
  set(m, 17, 14, wall)
  set(m, 17, 17, wall)

  set(m, 13, 15, steel)
  set(m, 13, 16, steel)

  if (wave >= 2) {
    const extras = [
      [12, 13], [12, 18], [13, 12], [13, 19],
      [14, 12], [14, 13], [14, 18], [14, 19],
      [15, 12], [15, 13], [15, 18], [15, 19]
    ]
    const count = Math.min(extras.length, 2 + wave)
    const shuffled = extras.sort(() => Math.random() - 0.5)
    for (let i = 0; i < count && i < shuffled.length; i++) {
      const [r, c] = shuffled[i]
      if (m[r][c] === 0) set(m, r, c, wave >= 4 ? steel : brick)
    }
  }
}

function map1() {
  const m = createEmptyMap()
  fillRect(m, 2, 2, 4, 5, TILE_BRICK)
  fillRect(m, 2, 10, 3, 11, TILE_BRICK)
  fillRect(m, 2, 14, 4, 17, TILE_BRICK)
  fillRect(m, 2, 20, 3, 21, TILE_BRICK)
  fillRect(m, 2, 26, 4, 29, TILE_BRICK)
  set(m, 3, 7, TILE_STEEL)
  set(m, 3, 8, TILE_STEEL)
  set(m, 3, 24, TILE_STEEL)
  set(m, 3, 25, TILE_STEEL)
  set(m, 3, 12, TILE_STEEL)
  set(m, 3, 19, TILE_STEEL)
  fillRect(m, 5, 0, 6, 3, TILE_FOREST)
  fillRect(m, 5, 28, 6, 31, TILE_FOREST)
  fillRect(m, 6, 9, 8, 14, TILE_WATER)
  fillRect(m, 6, 17, 8, 22, TILE_WATER)
  fillRect(m, 6, 5, 6, 7, TILE_BRICK)
  fillRect(m, 6, 25, 6, 27, TILE_BRICK)
  fillRect(m, 8, 4, 8, 6, TILE_BRICK)
  fillRect(m, 8, 25, 8, 27, TILE_BRICK)
  fillRect(m, 6, 1, 8, 2, TILE_BRICK)
  fillRect(m, 6, 29, 8, 30, TILE_BRICK)
  set(m, 5, 7, TILE_STEEL)
  set(m, 5, 8, TILE_STEEL)
  set(m, 5, 23, TILE_STEEL)
  set(m, 5, 24, TILE_STEEL)
  fillRect(m, 9, 0, 10, 3, TILE_FOREST)
  fillRect(m, 9, 28, 10, 31, TILE_FOREST)
  fillRect(m, 10, 7, 10, 9, TILE_BRICK)
  fillRect(m, 10, 22, 10, 24, TILE_BRICK)
  fillRect(m, 10, 12, 10, 14, TILE_BRICK)
  fillRect(m, 10, 17, 10, 19, TILE_BRICK)
  fillRect(m, 12, 2, 12, 5, TILE_BRICK)
  fillRect(m, 12, 26, 12, 29, TILE_BRICK)
  fillRect(m, 12, 9, 12, 11, TILE_BRICK)
  fillRect(m, 12, 20, 12, 22, TILE_BRICK)
  fillRect(m, 11, 0, 12, 1, TILE_BRICK)
  fillRect(m, 11, 30, 12, 31, TILE_BRICK)
  return m
}

function map2() {
  const m = createEmptyMap()
  fillRect(m, 2, 3, 4, 6, TILE_BRICK)
  fillRect(m, 2, 13, 3, 18, TILE_BRICK)
  fillRect(m, 2, 25, 4, 28, TILE_BRICK)
  fillRect(m, 4, 8, 4, 11, TILE_STEEL)
  fillRect(m, 4, 20, 4, 23, TILE_STEEL)
  fillRect(m, 5, 1, 5, 4, TILE_FOREST)
  fillRect(m, 5, 8, 7, 11, TILE_BRICK)
  fillRect(m, 5, 20, 7, 23, TILE_BRICK)
  fillRect(m, 5, 27, 5, 30, TILE_FOREST)
  set(m, 6, 0, TILE_STEEL)
  set(m, 6, 31, TILE_STEEL)
  fillRect(m, 7, 13, 9, 18, TILE_WATER)
  fillRect(m, 8, 3, 8, 6, TILE_BRICK)
  fillRect(m, 8, 25, 8, 28, TILE_BRICK)
  fillRect(m, 8, 0, 8, 1, TILE_BRICK)
  fillRect(m, 8, 30, 8, 31, TILE_BRICK)
  fillRect(m, 9, 0, 10, 3, TILE_FOREST)
  fillRect(m, 9, 28, 10, 31, TILE_FOREST)
  fillRect(m, 10, 6, 10, 9, TILE_BRICK)
  fillRect(m, 10, 22, 10, 25, TILE_BRICK)
  fillRect(m, 11, 1, 11, 4, TILE_BRICK)
  fillRect(m, 11, 27, 11, 30, TILE_BRICK)
  fillRect(m, 12, 4, 12, 7, TILE_BRICK)
  fillRect(m, 12, 24, 12, 27, TILE_BRICK)
  fillRect(m, 13, 2, 13, 4, TILE_BRICK)
  fillRect(m, 13, 27, 13, 29, TILE_BRICK)
  return m
}

function map3() {
  const m = createEmptyMap()
  fillRect(m, 1, 5, 3, 8, TILE_BRICK)
  fillRect(m, 1, 23, 3, 26, TILE_BRICK)
  fillRect(m, 2, 11, 4, 20, TILE_BRICK)
  fillRect(m, 3, 1, 4, 3, TILE_STEEL)
  fillRect(m, 3, 28, 4, 30, TILE_STEEL)
  fillRect(m, 4, 9, 4, 10, TILE_STEEL)
  fillRect(m, 4, 21, 4, 22, TILE_STEEL)
  fillRect(m, 5, 0, 6, 2, TILE_FOREST)
  fillRect(m, 5, 29, 6, 31, TILE_FOREST)
  fillRect(m, 5, 10, 5, 13, TILE_BRICK)
  fillRect(m, 5, 18, 5, 21, TILE_BRICK)
  fillRect(m, 6, 5, 6, 8, TILE_WATER)
  fillRect(m, 6, 23, 6, 26, TILE_WATER)
  fillRect(m, 7, 10, 9, 13, TILE_BRICK)
  fillRect(m, 7, 18, 9, 21, TILE_BRICK)
  fillRect(m, 8, 0, 9, 3, TILE_FOREST)
  fillRect(m, 8, 28, 9, 31, TILE_FOREST)
  fillRect(m, 8, 14, 8, 17, TILE_STEEL)
  fillRect(m, 10, 5, 10, 8, TILE_BRICK)
  fillRect(m, 10, 23, 10, 26, TILE_BRICK)
  fillRect(m, 10, 12, 10, 14, TILE_BRICK)
  fillRect(m, 10, 17, 10, 19, TILE_BRICK)
  fillRect(m, 11, 0, 11, 3, TILE_BRICK)
  fillRect(m, 11, 28, 11, 31, TILE_BRICK)
  fillRect(m, 12, 7, 12, 10, TILE_BRICK)
  fillRect(m, 12, 21, 12, 24, TILE_BRICK)
  fillRect(m, 13, 5, 13, 7, TILE_BRICK)
  fillRect(m, 13, 24, 13, 26, TILE_BRICK)
  return m
}

function map4() {
  const m = createEmptyMap()
  fillRect(m, 2, 1, 3, 5, TILE_STEEL)
  fillRect(m, 2, 26, 3, 30, TILE_STEEL)
  fillRect(m, 2, 8, 3, 11, TILE_BRICK)
  fillRect(m, 2, 20, 3, 23, TILE_BRICK)
  fillRect(m, 3, 13, 5, 18, TILE_BRICK)
  fillRect(m, 4, 0, 5, 2, TILE_FOREST)
  fillRect(m, 4, 29, 5, 31, TILE_FOREST)
  fillRect(m, 5, 6, 5, 8, TILE_BRICK)
  fillRect(m, 5, 23, 5, 25, TILE_BRICK)
  fillRect(m, 6, 9, 8, 12, TILE_WATER)
  fillRect(m, 6, 19, 8, 22, TILE_WATER)
  fillRect(m, 7, 2, 8, 5, TILE_STEEL)
  fillRect(m, 7, 26, 8, 29, TILE_STEEL)
  fillRect(m, 7, 0, 8, 1, TILE_FOREST)
  fillRect(m, 7, 30, 8, 31, TILE_FOREST)
  fillRect(m, 8, 13, 8, 18, TILE_BRICK)
  fillRect(m, 10, 4, 11, 8, TILE_BRICK)
  fillRect(m, 10, 23, 11, 27, TILE_BRICK)
  fillRect(m, 10, 10, 10, 12, TILE_STEEL)
  fillRect(m, 10, 19, 10, 21, TILE_STEEL)
  fillRect(m, 12, 0, 12, 3, TILE_BRICK)
  fillRect(m, 12, 28, 12, 31, TILE_BRICK)
  fillRect(m, 12, 7, 12, 10, TILE_BRICK)
  fillRect(m, 12, 21, 12, 24, TILE_BRICK)
  fillRect(m, 13, 5, 13, 8, TILE_BRICK)
  fillRect(m, 13, 23, 13, 26, TILE_BRICK)
  return m
}

export function createMap(wave) {
  const idx = ((wave - 1) % 4)
  const maps = [map1, map2, map3, map4]
  const m = maps[idx]()
  addBase(m, wave)
  return m
}

export function cloneMap(map) {
  return map.map(row => [...row])
}

export const SPAWN_POINTS = [
  { r: 0, c: 2 },
  { r: 0, c: 15 },
  { r: 0, c: 29 }
]
