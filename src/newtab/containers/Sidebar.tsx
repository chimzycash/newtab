import { addColumn, addTile } from 'actions/grid'
import { toggleSidebar } from 'actions/ui'
import { Sidebar } from 'components/ui/Sidebar'
import { ITile } from 'models/newtab'
import { connect } from 'react-redux'
import { IState } from 'reducers/newtab'
import { getSidebarVisibility } from 'selectors/ui'

const mapStateToProps = (state: IState) => ({
  sidebarVisible: getSidebarVisibility(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  handleAddTile: (tile: ITile) => dispatch(addTile(tile)),
  handleAddColumn: (id: string) => dispatch(addColumn(id)),
  handleToggleSidebar: () => dispatch(toggleSidebar()),
})

export default connect<any, any, any>(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
