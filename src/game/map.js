import { TILE_BRICK, TILE_STEEL, TILE_BASE, COLS, ROWS } from './constants.js'

export function createMap() {
  const m = []
  for (let r = 0; r < ROWS; r++) {
    m[r] = []
    for (let c = 0; c < COLS; c++) {
      m[r][c] = 0
    }
  }

  function set(r, c, v) {
    m[r][c] = v
  }

  function fillRect(r1, c1, r2, c2, v) {
    for (let r = r1; r <= r2; r++)
      for (let c = c1; c <= c2; c++)
        set(r, c, v)
  }

  fillRect(3, 1, 5, 3, TILE_BRICK)
  fillRect(3, 5, 4, 5, TILE_BRICK)
  fillRect(3, 9, 5, 11, TILE_BRICK)
  fillRect(3, 13, 4, 13, TILE_BRICK)
  fillRect(3, 16, 5, 18, TILE_BRICK)

  fillRect(7, 1, 9, 3, TILE_BRICK)
  fillRect(7, 6, 8, 6, TILE_BRICK)
  fillRect(7, 8, 9, 11, TILE_BRICK)
  fillRect(10, 10, 10, 11, TILE_BRICK)
  fillRect(7, 13, 8, 13, TILE_BRICK)
  fillRect(7, 16, 9, 18, TILE_BRICK)

  fillRect(11, 1, 12, 3, TILE_BRICK)
  fillRect(10, 3, 10, 3, TILE_BRICK)
  fillRect(11, 6, 11, 8, TILE_BRICK)
  fillRect(11, 11, 11, 13, TILE_BRICK)
  fillRect(11, 16, 12, 18, TILE_BRICK)

  fillRect(13, 3, 13, 4, TILE_BRICK)
  fillRect(13, 6, 13, 7, TILE_BRICK)
  fillRect(13, 10, 13, 11, TILE_BRICK)
  fillRect(13, 14, 13, 16, TILE_BRICK)

  set(5, 7, TILE_STEEL)
  set(5, 8, TILE_STEEL)
  set(5, 11, TILE_STEEL)
  set(5, 12, TILE_STEEL)

  set(14, 9, TILE_BASE)
  set(14, 10, TILE_BASE)
  fillRect(13, 9, 13, 10, TILE_BRICK)

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
