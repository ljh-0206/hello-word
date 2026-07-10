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

  set(m, 11, 8, wall)
  set(m, 11, 11, wall)
  fillRect(m, 12, 8, 12, 11, wall)
  fillRect(m, 13, 9, 13, 10, inner)
  set(m, 14, 9, TILE_BASE)
  set(m, 14, 10, TILE_BASE)
  set(m, 13, 8, wall)
  set(m, 13, 11, wall)
  set(m, 14, 8, wall)
  set(m, 14, 11, wall)

  // steel cap above base to block direct fire from spawn point (0,9)
  set(m, 10, 9, steel)
  set(m, 10, 10, steel)

  // extra random brick clutter in front of base for higher levels
  if (wave >= 2) {
    const extras = [
      [9, 7], [9, 12], [10, 6], [10, 13],
      [11, 6], [11, 7], [11, 12], [11, 13]
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
  fillRect(m, 2, 1, 4, 3, TILE_BRICK)
  fillRect(m, 2, 6, 3, 6, TILE_BRICK)
  fillRect(m, 2, 8, 4, 10, TILE_BRICK)
  fillRect(m, 2, 13, 3, 13, TILE_BRICK)
  fillRect(m, 2, 16, 4, 18, TILE_BRICK)
  set(m, 3, 4, TILE_STEEL)
  set(m, 3, 5, TILE_STEEL)
  set(m, 3, 14, TILE_STEEL)
  set(m, 3, 15, TILE_STEEL)
  fillRect(m, 5, 0, 6, 2, TILE_FOREST)
  fillRect(m, 5, 17, 6, 19, TILE_FOREST)
  fillRect(m, 6, 7, 8, 12, TILE_WATER)
  fillRect(m, 6, 3, 6, 5, TILE_BRICK)
  fillRect(m, 8, 3, 8, 4, TILE_BRICK)
  fillRect(m, 8, 15, 8, 16, TILE_BRICK)
  fillRect(m, 6, 14, 6, 16, TILE_BRICK)
  set(m, 5, 7, TILE_STEEL)
  set(m, 5, 8, TILE_STEEL)
  set(m, 5, 11, TILE_STEEL)
  set(m, 5, 12, TILE_STEEL)
  fillRect(m, 9, 0, 10, 2, TILE_FOREST)
  fillRect(m, 9, 17, 10, 19, TILE_FOREST)
  fillRect(m, 10, 5, 10, 7, TILE_BRICK)
  fillRect(m, 10, 12, 10, 14, TILE_BRICK)
  fillRect(m, 12, 2, 12, 4, TILE_BRICK)
  fillRect(m, 12, 15, 12, 17, TILE_BRICK)
  fillRect(m, 12, 6, 12, 7, TILE_BRICK)
  fillRect(m, 12, 12, 12, 13, TILE_BRICK)
  return m
}

function map2() {
  const m = createEmptyMap()
  fillRect(m, 2, 2, 4, 4, TILE_BRICK)
  fillRect(m, 2, 8, 3, 11, TILE_BRICK)
  fillRect(m, 2, 15, 4, 17, TILE_BRICK)
  fillRect(m, 4, 5, 4, 7, TILE_STEEL)
  fillRect(m, 4, 12, 4, 14, TILE_STEEL)
  fillRect(m, 5, 1, 5, 3, TILE_FOREST)
  fillRect(m, 5, 5, 7, 7, TILE_BRICK)
  fillRect(m, 5, 12, 7, 14, TILE_BRICK)
  fillRect(m, 5, 16, 5, 18, TILE_FOREST)
  fillRect(m, 6, 0, 6, 0, TILE_STEEL)
  fillRect(m, 6, 19, 6, 19, TILE_STEEL)
  fillRect(m, 7, 8, 9, 11, TILE_WATER)
  fillRect(m, 8, 2, 8, 4, TILE_BRICK)
  fillRect(m, 8, 15, 8, 17, TILE_BRICK)
  fillRect(m, 9, 0, 10, 2, TILE_FOREST)
  fillRect(m, 9, 17, 10, 19, TILE_FOREST)
  fillRect(m, 10, 4, 10, 6, TILE_BRICK)
  fillRect(m, 10, 13, 10, 15, TILE_BRICK)
  fillRect(m, 11, 0, 11, 2, TILE_BRICK)
  fillRect(m, 11, 17, 11, 19, TILE_BRICK)
  fillRect(m, 12, 3, 12, 5, TILE_BRICK)
  fillRect(m, 12, 14, 12, 16, TILE_BRICK)
  return m
}

function map3() {
  const m = createEmptyMap()
  fillRect(m, 1, 3, 3, 5, TILE_BRICK)
  fillRect(m, 1, 14, 3, 16, TILE_BRICK)
  fillRect(m, 2, 7, 4, 12, TILE_BRICK)
  fillRect(m, 3, 1, 4, 2, TILE_STEEL)
  fillRect(m, 3, 17, 4, 18, TILE_STEEL)
  fillRect(m, 4, 4, 4, 5, TILE_STEEL)
  fillRect(m, 4, 14, 4, 15, TILE_STEEL)
  fillRect(m, 5, 0, 6, 1, TILE_FOREST)
  fillRect(m, 5, 6, 5, 8, TILE_BRICK)
  fillRect(m, 5, 11, 5, 13, TILE_BRICK)
  fillRect(m, 5, 18, 6, 19, TILE_FOREST)
  fillRect(m, 6, 3, 6, 5, TILE_WATER)
  fillRect(m, 6, 14, 6, 16, TILE_WATER)
  fillRect(m, 7, 6, 9, 8, TILE_BRICK)
  fillRect(m, 7, 11, 9, 13, TILE_BRICK)
  fillRect(m, 8, 0, 9, 2, TILE_FOREST)
  fillRect(m, 8, 17, 9, 19, TILE_FOREST)
  fillRect(m, 8, 9, 8, 10, TILE_STEEL)
  fillRect(m, 10, 3, 10, 5, TILE_BRICK)
  fillRect(m, 10, 14, 10, 16, TILE_BRICK)
  fillRect(m, 11, 0, 11, 2, TILE_BRICK)
  fillRect(m, 11, 17, 11, 19, TILE_BRICK)
  fillRect(m, 12, 5, 12, 7, TILE_BRICK)
  fillRect(m, 12, 12, 12, 14, TILE_BRICK)
  return m
}

function map4() {
  const m = createEmptyMap()
  fillRect(m, 2, 1, 3, 3, TILE_STEEL)
  fillRect(m, 2, 16, 3, 18, TILE_STEEL)
  fillRect(m, 2, 5, 3, 7, TILE_BRICK)
  fillRect(m, 2, 12, 3, 14, TILE_BRICK)
  fillRect(m, 3, 8, 5, 11, TILE_BRICK)
  fillRect(m, 4, 0, 5, 1, TILE_FOREST)
  fillRect(m, 4, 18, 5, 19, TILE_FOREST)
  fillRect(m, 5, 3, 5, 5, TILE_BRICK)
  fillRect(m, 5, 14, 5, 16, TILE_BRICK)
  fillRect(m, 6, 6, 8, 8, TILE_WATER)
  fillRect(m, 6, 11, 8, 13, TILE_WATER)
  fillRect(m, 7, 2, 8, 3, TILE_STEEL)
  fillRect(m, 7, 16, 8, 17, TILE_STEEL)
  fillRect(m, 7, 0, 8, 1, TILE_FOREST)
  fillRect(m, 7, 18, 8, 19, TILE_FOREST)
  fillRect(m, 8, 9, 8, 10, TILE_BRICK)
  fillRect(m, 10, 3, 11, 5, TILE_BRICK)
  fillRect(m, 10, 14, 11, 16, TILE_BRICK)
  fillRect(m, 10, 7, 10, 8, TILE_STEEL)
  fillRect(m, 10, 11, 10, 12, TILE_STEEL)
  fillRect(m, 12, 0, 12, 2, TILE_BRICK)
  fillRect(m, 12, 17, 12, 19, TILE_BRICK)
  fillRect(m, 12, 5, 12, 7, TILE_BRICK)
  fillRect(m, 12, 12, 12, 14, TILE_BRICK)
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
  { r: 0, c: 0 },
  { r: 0, c: 9 },
  { r: 0, c: 18 }
]
