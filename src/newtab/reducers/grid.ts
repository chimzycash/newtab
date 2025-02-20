import { Action } from 'actions/grid'
import {
  ADD_COLUMN,
  ADD_TILE,
  EDIT_TILE,
  MOVE_TILE,
  REMOVE_COLUMN,
  REMOVE_TILE,
  REORDER_COLUMN,
  REORDER_TILE,
} from 'constants/types'
import { IColumn, ITile } from 'models/newtab'

// Define the types of the grid state structure
export interface IGridState {
  tiles: { [id: string]: ITile }
  columns: { [id: string]: IColumn }
  columnOrder: string[]
}

// Define the initial state of the grid
export const initialState: IGridState = {
  tiles: {},
  columns: {
    'column-0': {
      id: 'column-0',
      tileIds: [],
    },
    'column-1': {
      id: 'column-1',
      tileIds: [],
    },
    'column-2': {
      id: 'column-2',
      tileIds: [],
    },
  },
  columnOrder: ['column-0', 'column-1', 'column-2'],
}

/**
 * Reducer function for the grid state
 * @param {IGridState} state The current state of the grid, initialState if none provided
 * @param {Action} action The action to handle. The possible actions are declared in src/actions/grid.ts
 */
export function reducer(state: IGridState = initialState, action: Action) {
  switch (action.type) {
    case ADD_COLUMN: {
      /**
       * Add a column to the grid. The grid will be empty upon initialisation and will be added as the rightmost column.
       */
      const { id, tileIds } = action.payload.column
      const newColumnOrder = Array.from(state.columnOrder)
      newColumnOrder.push(id)

      return {
        ...state,
        columns: {
          ...state.columns,
          [id]: {
            id,
            tileIds,
          },
        },
        columnOrder: newColumnOrder,
      }
    }
    case REMOVE_COLUMN: {
      /**
       * Removes the column with the specified id from the grid. Should more than one element have the same id,
       * both would be removed, though this shouldn't happen with a human user as more than one column would need
       * to have been created within a millisecond.
       */
      const id = action.payload.id

      const newColumns = Object.assign({}, state.columns)
      delete newColumns[id]

      let newColumnOrder = Array.from(state.columnOrder)
      newColumnOrder = newColumnOrder.filter(key => key !== id)

      return {
        ...state,
        columns: newColumns,
        columnOrder: newColumnOrder,
      }
    }
    case REORDER_COLUMN: {
      /**
       * Rearranges the column order within the grid moving the column from startIndex to endIndex.
       */
      const { columnOrder, startIndex, endIndex } = action.payload
      const newColumnOrder = Array.from(columnOrder)
      const [removed] = newColumnOrder.splice(startIndex, 1)
      newColumnOrder.splice(endIndex, 0, removed)

      return {
        ...state,
        columnOrder: newColumnOrder,
      }
    }
    case ADD_TILE: {
      /**
       * Add a tile to the grid. The tile will have the link and id provided in the payload and it will be added to the
       * column with the least tiles.
       */
      const tile = action.payload.tile
      const columns = Array.from(state.columnOrder)
      const shortestColumn = columns.reduce(
        (min, column) =>
          state.columns[column].tileIds.length <
          state.columns[min].tileIds.length
            ? column
            : min,
        columns[0] // Start index
      )
      const newTileIds = Array.from(state.columns[shortestColumn].tileIds)
      newTileIds.push(tile.id)

      return {
        ...state,
        tiles: {
          ...state.tiles,
          [tile.id]: tile,
        },
        columns: {
          ...state.columns,
          [shortestColumn]: {
            ...state.columns[shortestColumn],
            tileIds: newTileIds,
          },
        },
      }
    }
    case EDIT_TILE: {
      /**
       * Edits the properties of an existing tile.
       */
      const tile = action.payload.tile

      return {
        ...state,
        tiles: {
          ...state.tiles,
          [tile.id]: tile,
        },
      }
    }
    case REMOVE_TILE: {
      /**
       * Removes the tile with the specified id from the grid. Should more than one element have the same id, they would
       * both be removed, though this shouldn't happen with a human user as more than one tile with the same url would
       * need to have been created within a millisecond.
       */
      const id = action.payload.id

      const newTiles = Object.assign({}, state.tiles)
      delete newTiles[id]

      const newColumns = Object.assign({}, state.columns)
      state.columnOrder.forEach(column => {
        let newTileIds = Array.from(state.columns[column].tileIds)
        newTileIds = newTileIds.filter(key => key !== id)
        newColumns[column].tileIds = newTileIds
      })

      return {
        ...state,
        tiles: newTiles,
        columns: newColumns,
      }
    }
    case REORDER_TILE: {
      /**
       * Rearranges the tiles within a single column moving the tile from startIndex to endIndex.
       */
      const { column, startIndex, endIndex } = action.payload
      const newTileOrder = Array.from(column.tileIds)
      const [removed] = newTileOrder.splice(startIndex, 1)
      newTileOrder.splice(endIndex, 0, removed)

      return {
        ...state,
        columns: {
          ...state.columns,
          [column.id]: {
            ...state.columns[column.id],
            tileIds: newTileOrder,
          },
        },
      }
    }
    case MOVE_TILE: {
      /**
       * Moves a tile from one column to another, rearranging the tile order in both. The tile starts in sourceColumn
       * at index droppableSource.index and ends up at destinationColumn at index droppableDestination.index.
       */
      const { droppableSource, droppableDestination } = action.payload

      const newSourceTileOrder = Array.from(
        state.columns[droppableSource.droppableId].tileIds
      )
      const newDestinationTileOrder = Array.from(
        state.columns[droppableDestination.droppableId].tileIds
      )

      const [removed] = newSourceTileOrder.splice(droppableSource.index, 1)
      newDestinationTileOrder.splice(droppableDestination.index, 0, removed)

      return {
        ...state,
        columns: {
          ...state.columns,
          [droppableSource.droppableId]: {
            ...state.columns[droppableSource.droppableId],
            tileIds: newSourceTileOrder,
          },
          [droppableDestination.droppableId]: {
            ...state.columns[droppableDestination.droppableId],
            tileIds: newDestinationTileOrder,
          },
        },
      }
    }
    default:
      return state
  }
}
