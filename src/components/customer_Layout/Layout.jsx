import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ToastContainer from '../customer_Ui/Toast.jsx';
import './Layout.css'

export default function Layout() {
  return (
    <div className="wrap">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}