import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ToastContainer from '../customer_Ui/Toast.jsx';
import Sidebar from '../customer_Layout/Sidebar.jsx';
import './Layout.css'

// Routes under this Layout where the category sidebar should NOT show.
// Everything else (Shop, ProductDetail, Cart, Checkout, /account/*, etc.)
// gets it.
const SIDEBAR_HIDDEN_PATHS = ['/', '/order-confirmation'];

export default function Layout() {
  const location = useLocation();
  const showSidebar = !SIDEBAR_HIDDEN_PATHS.includes(location.pathname);

  // React Router doesn't reset scroll position on navigation like a
  // traditional multi-page site does. This jumps to the top of the page
  // whenever the path OR the query string changes — the query string check
  // is what makes clicking a category in the Sidebar (which navigates to
  // /shop?category=ID, same path, new query) scroll to top too, not just
  // switching between entirely different pages.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <div className="wrap">
      <Header />
      <main className={showSidebar ? 'main main-with-sidebar' : 'main'}>
        {showSidebar && <Sidebar />}
        <div className="main-content">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}