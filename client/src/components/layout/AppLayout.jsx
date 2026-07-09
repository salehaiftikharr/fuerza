import Sidebar from './Sidebar'
import RightRail from './RightRail'
import Navbar from '../common/Navbar'
import './AppLayout.css'

// Modern three-column app shell: left sidebar nav, centered content, right
// stats rail. The existing Navbar is reused as a top bar on mobile, where the
// sidebar and rail collapse away.
const AppLayout = ({ children, rail = true }) => {
  return (
    <>
      <div className="app-mobilebar">
        <Navbar />
      </div>
      <div className={`app-shell ${rail ? '' : 'no-rail'}`}>
        <div className="app-col-side">
          <Sidebar />
        </div>
        <main className="app-col-main">{children}</main>
        {rail && (
          <div className="app-col-rail">
            <RightRail />
          </div>
        )}
      </div>
    </>
  )
}

export default AppLayout
