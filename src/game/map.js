import { TILE_BRICK, TILE_STEEL, TILE_BASE, TILE_WATER, TILE_FOREST, COLS, ROWS } from './constants.js'

export function createMap() {
  const m = []
  for (let r = 0; r < ROWS; r++) {
    m[r] = []
    for (let c = 0; c < COLS; c++) {
      m[r][c] = 0
    }
  }

  function set(r, c, v) {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) m[r][c] = v
  }

  function fillRect(r1, c1, r2, c2, v) {
    for (let r = r1; r <= r2; r++)
      for (let c = c1; c <= c2; c++)
        set(r, c, v)
  }

  // upper brick clusters
  fillRect(2, 1, 4, 3, TILE_BRICK)
  fillRect(2, 6, 3, 6, TILE_BRICK)
  fillRect(2, 8, 4, 10, TILE_BRICK)
  fillRect(2, 13, 3, 13, TILE_BRICK)
  fillRect(2, 16, 4, 18, TILE_BRICK)

  // steel walls upper
  set(3, 4, TILE_STEEL)
  set(3, 5, TILE_STEEL)
  set(3, 14, TILE_STEEL)
  set(3, 15, TILE_STEEL)

  // forest areas
  fillRect(5, 0, 6, 2, TILE_FOREST)
  fillRect(5, 17, 6, 19, TILE_FOREST)

  // water river
  fillRect(6, 7, 8, 12, TILE_WATER)

  // mid brick clusters
  fillRect(6, 3, 6, 5, TILE_BRICK)
  fillRect(8, 3, 8, 4, TILE_BRICK)
  fillRect(8, 15, 8, 16, TILE_BRICK)
  fillRect(6, 14, 6, 16, TILE_BRICK)

  // steel walls mid
  set(5, 7, TILE_STEEL)
  set(5, 8, TILE_STEEL)
  set(5, 11, TILE_STEEL)
  set(5, 12, TILE_STEEL)

  // forest mid
  fillRect(9, 0, 10, 2, TILE_FOREST)
  fillRect(9, 17, 10, 19, TILE_FOREST)

  // lower brick walls
  fillRect(10, 5, 10, 7, TILE_BRICK)
  fillRect(10, 12, 10, 14, TILE_BRICK)
  fillRect(12, 2, 12, 4, TILE_BRICK)
  fillRect(12, 15, 12, 17, TILE_BRICK)
  fillRect(12, 6, 12, 7, TILE_BRICK)
  fillRect(12, 12, 12, 13, TILE_BRICK)

  // base enclosure (3-wall: top, left, right)
  fillRect(12, 9, 13, 10, TILE_BRICK)
  set(11, 8, TILE_BRICK)
  set(11, 11, TILE_BRICK)
  fillRect(12, 8, 12, 8, TILE_BRICK)
  fillRect(12, 11, 12, 11, TILE_BRICK)

  // base
  set(14, 9, TILE_BASE)
  set(14, 10, TILE_BASE)

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
