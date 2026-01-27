import { Form } from './Form'
import { List } from './List'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:py-12">
      <div className="max-w-md mx-auto sm:max-w-2xl space-y-6">
        <Form />
        <List />
      </div>
    </div>
  )
}

export default App
