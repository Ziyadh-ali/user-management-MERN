import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/user/login/login'
import SignupPage from './components/user/signup/signup'
import { Provider } from 'react-redux'
import store from './redux/store'
import Home from './components/user/home/Home'
import Edit from './components/user/editUser/Edit'
import IsLogin from './middleware/isLogin'
import IsLogout from './middleware/isLogout'


function App() {

  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route element={<IsLogout />}>
            <Route path='login' element={<LoginPage />} />
            <Route path='signup' element={<SignupPage />} />
          </Route>
          <Route element={<IsLogin />}>
            <Route path='/' element={<Home />} />
            <Route path='edit-profile' element={<Edit />} />
          </Route>
        </Routes>
      </Provider>
    </>
  )
}

export default App
