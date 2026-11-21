import { RiFlowerFill, RiInfoCardFill } from "react-icons/ri";
import { BiCategoryAlt, BiHome } from 'react-icons/bi';
import { FaCartArrowDown, FaChartLine } from 'react-icons/fa';
import { IoTabletLandscape } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { VscFeedback } from "react-icons/vsc";

const links = [
  { to: '/', label: 'Home', icon: <BiHome /> },
  { to: '/dashboard', label: 'Overview', end: true, icon: <FaChartLine /> },
  { to: '/dashboard/hero', label: 'Hero', icon: <IoTabletLandscape /> },
  { to: '/dashboard/categories', label: 'Categories', icon: <BiCategoryAlt /> },
  { to: '/dashboard/products', label: 'Products', icon: <RiFlowerFill /> },
  { to: '/dashboard/about', label: 'About', icon: <RiInfoCardFill /> },
  { to: '/dashboard/feedback', label: 'Feedback', icon: <VscFeedback /> },
  { to: '/dashboard/orders', label: 'Orders', icon: <FaCartArrowDown /> },
];

const DashboardSidebar = () => {
  return (
    <aside className="w-60 min-h-screen bg-purple-300 border-r border-gray-200 px-4">
      <h2 className="text-lg font-bold px-2 mt-10 mb-20">Dashboard</h2>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-md font-medium transition ${isActive
                ? 'bg-green-100 text-blue-800'
                : 'text-pink-900 hover:bg-pink-100'
              }`
            }
          >
            <div className="flex flex-col mt-3">
              <div className="text-2xl mb-1">
                {link.icon}
              </div>
              {link.label}
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;