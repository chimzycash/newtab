import * as enzyme from 'enzyme'
import * as React from 'react'
import * as types from '../../constants/types'

import { Column } from '../../components/grid/Column'
import { Grid } from '../../components/grid/Grid'
import { initialState, reducer } from '../../reducers/grid'
import { Instructions } from './Instructions'

describe('Grid component', () => {
  it('should render the instructions component upon initialisation', () => {
    const { tiles, columns, columnOrder } = initialState
    const grid = enzyme.shallow(
      <Grid tiles={tiles} columns={columns} columnOrder={columnOrder} />
    )
    expect(grid.find(Instructions)).toHaveLength(1)
    expect(grid.find(Column)).toHaveLength(0)
  })

  it('should render 3 columns after first tile is added', () => {
    const addedTileState = reducer(initialState, {
      type: types.ADD_TILE,
      payload: {
        tile: {
          id: 'new.tile',
          url: 'tile.url',
        },
      },
    })
    const { tiles, columns, columnOrder } = addedTileState
    const grid = enzyme.shallow(
      <Grid tiles={tiles} columns={columns} columnOrder={columnOrder} />
    )
    expect(grid.find(Column)).toHaveLength(3)
  })

  it('should render an added column, but only after a tile is added', () => {
    let addedColumnState = reducer(initialState, {
      type: types.ADD_COLUMN,
      payload: {
        column: {
          id: 'new.column',
          tileIds: [],
        },
      },
    })

    const { tiles, columns, columnOrder } = addedColumnState
    let grid = enzyme.shallow(
      <Grid tiles={tiles} columns={columns} columnOrder={columnOrder} />
    )
    expect(grid.find(Column)).toHaveLength(0)

    addedColumnState = reducer(addedColumnState, {
      type: types.ADD_TILE,
      payload: {
        tile: {
          id: 'new.tile',
          url: 'tile.url',
        },
      },
    })

    const {
      tiles: newTiles,
      columns: newColumns,
      columnOrder: newColumnOrder,
    } = addedColumnState

    grid = enzyme.shallow(
      <Grid
        tiles={newTiles}
        columns={newColumns}
        columnOrder={newColumnOrder}
      />
    )
    expect(grid.find(Column)).toHaveLength(4)
  })
})
