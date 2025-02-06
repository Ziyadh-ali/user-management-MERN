import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/user/login/login'
import SignupPage from './components/user/signup/signup'
import { Provider } from 'react-redux'
import store from './redux/store'
import Home from './components/user/home/Home'
import Edit from './components/user/editUser/Edit'
import IsLogin from './middleware/isLogin'
import IsLogout from './middleware/isLogout'
import AdminLoginPage from './components/admin/login/Admin-Login'
import AdminHome from './components/admin/home/Admin-Home'
import IsAdminLogin from './middleware/adminIsLogin'
import IsAdminLogout from './middleware/adminIsLogout'
import AdminEdit from './components/admin/edit/Admin-Edit'
import AdminAdd from './components/admin/addUser/Admin-Add'
import { Bounce, ToastContainer } from 'react-toastify'


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
          <Route element={<IsAdminLogin />}>
            <Route path='/admin/home' element={<AdminHome />} />
            <Route path='/admin/edit-user/:id' element={<AdminEdit />} />
            <Route path='/admin/add-user' element={<AdminAdd />} />
          </Route>
          <Route element={<IsAdminLogout />}>
            <Route path='/admin/login' element={<AdminLoginPage />} />
          </Route>
        </Routes>
      </Provider>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  )
}

export default App
