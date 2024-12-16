import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import TableICreate from './Comp/TableICreate'
import TableDefinitionForm from './Comp/TabelDefinationForm'
import Insert_into_comp from './Comp/Insert_into_comp'
import Delete_tab from './Comp/Delete_tab'
import Read_comp from './Comp/Read_comp'
import ReadComp2 from './Comp/ReadComp2'
// import Read_comp3 from '../../some utils and refrences/ReadComp3'

function render_my_comp(props) {
  const what_to_render = props.where
  if (what_to_render == 0) {
    return <TableDefinitionForm />
  }
  else if (what_to_render == 1) {
    return <Insert_into_comp />
  }
  else if (what_to_render == 2) {
    return <h1>Home</h1>
  }
  else if (what_to_render == 3) {
    return <Delete_tab />
  }
  else if (what_to_render == 4) {
    return <Read_comp/>  }
  else if  (what_to_render == 5) {
    return <ReadComp2/>}
 }

function App() {
  const [where, setWhere] = useState(0)

  return (
    <>
      <div>
        <div >
          <button onClick={() => setWhere(2)}>Home</button>
          <button onClick={() => setWhere(0)}>Create Table</button>
          <button onClick={() => setWhere(3)}>Delete from table </button>
          <button onClick={() => setWhere(4)}>Read</button>
          <button onClick={() => setWhere(5)}>Read2</button>
          <button onClick={() => setWhere(1)}>Insert into table</button>
        </div>
        <div >

          {render_my_comp({ where })}
        </div>
      </div>
    </>
  )
}

export default App
