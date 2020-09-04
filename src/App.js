import React from 'react'
import { Route , BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import FloatCart from './components/floatCart/FloatCart'
import Checkout from './pages/Checkout'
import CompletedOrder from './pages/CompletedOrder'
import Categories from './pages/Categories'
import TrackID from './pages/TrackID'
import OrderID from './pages/OrderID'
import InvoiceID from './pages/InvoiceID'
// import WishList from './pages/WishList'
import Sidebar from './components/layout/Sidebar'
import Default from './pages/Default'
import Product from './pages/Product'
import SubCategories from './pages/SubCategories'
import Search from './pages/Search'
import SearchModal from './components/search/SearchModal'
import NewProduct from './pages/NewProduct'
import ProductCategories from './pages/ProductCategories'
import CreateContact from './components/contact/CreateContact'
import EditContact from './components/contact/EditContact'
import Brand from './pages/Brand'
import { auth } from './firebase'
import Spinner from './components/layout/Spinner'
import Register from './pages/user/Register'
import SignIn from './pages/user/SignIn'
import PasswordReset from './pages/user/PasswordReset'
import EditProfile from './pages/user/EditProfile'
import Manage from './pages/user/Manage'
import PersonalProfile from './pages/user/PersonalProfile'
import ChangePassword from './pages/user/ChangePassword'
import AddAddress from './pages/user/AddAddress'
import Addresses from './pages/user/Addresses'
import EditAddress from './pages/user/EditAddress'
import AddProfile from './pages/user/AddProfile'
import Orders from './pages/user/Orders'
import Cancellation from './pages/user/Cancellation'
import Completion from './pages/user/Completion'
import AddContactPopUp from './components/contact/user/AddContactPopUp'
import OrderIds from './pages/user/OrderIds'
import TopBarClick from './components/layout/TopBarClick'
import CancelledOrderId from './pages/user/CancelledOrderId'
import CompletedOrderId from './pages/user/CompletedOrderId'
import FreeUserNoti from './components/notification/FreeUserNoti'
import AuthUserNoti from './components/notification/AuthUserNoti'


function PrivateRoute({ component:Component , authenticated , ...rest }) {
  return(
    <Route
      {...rest}
      render={
        (props) => authenticated === true ? 
          <Component {...props} /> : 
          <Redirect 
            to={{ 
              pathname: '/login', 
              state: { from: props.location } 
            }}
          />
      }
    />
  )
}

function PublicRoute({ component:Component , authenticated , ...rest }) {
  return(
    <Route
      {...rest}
      render={
        (props) => authenticated === false ?
          <Component {...props} /> :
          <Redirect
            to="/"
          />
      }
    />
  )
}

class App extends React.Component 
{
  state = {
    loading: true,
    authenticated: false
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        })
      } else {
        this.setState({
          authenticated: false,
          loading: false
        })
      }
    })
  }

  render() {

    return this.state.loading === true ? <Spinner /> : (
      <React.Fragment>

        <Router>

          <Sidebar />

          <TopBarClick />

          <SearchModal />

          <CreateContact />

          <EditContact />

          <AddContactPopUp />

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/category/:slug" component={SubCategories} />  
            <Route path="/brand/:slug" component={Brand} />       
            <Route path='/product/:slug' component={Product} />
            <Route path="/invoice/:id" component={InvoiceID} />
            <Route path="/order/:uuid" component={OrderID} />
            <Route path="/completed/:uuid" component={CompletedOrder} />  
            <Route path="/search/product=:text" component={Search} />      
            <Route path="/c/:slug" component={Categories} />  

            <PrivateRoute path="/edit-address/:slug" authenticated={this.state.authenticated} component={EditAddress} />

            <PrivateRoute path="/user-order/:uuid" authenticated={this.state.authenticated} component={OrderIds} />
            <PrivateRoute path="/cancelled-order/:uuid" authenticated={this.state.authenticated} component={CancelledOrderId} />
            <PrivateRoute path="/completed-order/:uuid" authenticated={this.state.authenticated} component={CompletedOrderId} />

            <PrivateRoute path="/add-profile" authenticated={this.state.authenticated} component={AddProfile} />
            <PrivateRoute path="/edit-profile" authenticated={this.state.authenticated} component={EditProfile} />            
            <PrivateRoute path="/manage-account" authenticated={this.state.authenticated} component={Manage} />
            <PrivateRoute path="/personal-profile" authenticated={this.state.authenticated} component={PersonalProfile} />
            <PrivateRoute path="/change-password" authenticated={this.state.authenticated} component={ChangePassword} />
            <PrivateRoute path="/add-address" authenticated={this.state.authenticated} component={AddAddress} />
            <PrivateRoute path="/addresses" authenticated={this.state.authenticated} component={Addresses} />
            <PrivateRoute path="/order-lists" authenticated={this.state.authenticated} component={Orders} />
            <PrivateRoute path="/order-cancellations" authenticated={this.state.authenticated} component={Cancellation} />
            <PrivateRoute path="/order-completions" authenticated={this.state.authenticated} component={Completion} />
            
            <Route path="/product-categories" component={ProductCategories} />
            <Route path="/new-products" component={NewProduct} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />     
            <Route path="/track" component={TrackID} />

            <Route path="/login" component={SignIn} />
            <Route path="/password-reset" component={PasswordReset} />
            <PublicRoute path="/register" authenticated={this.state.authenticated} component={Register} />

            <Route component={Default} />

            {/* <Route path="/wishlist" component={WishList} /> */}            

          </Switch>

          <FloatCart />

          <FreeUserNoti />

          <AuthUserNoti />

        </Router>
        
      </React.Fragment>
    )
  }
}

export default App
