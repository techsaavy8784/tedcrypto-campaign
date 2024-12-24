import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GraphIcon from '@mui/icons-material/GraphicEq';
import LogoutIcon from '@mui/icons-material/Logout';

const NavbarItem = ({ name, icon: Icon, path }: { name: string, icon: any, path: string }) => (
    <Link to={path}>
      <ListItem button>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </Link>
);

export const navbarItems = [
  {
    name: 'Dashboard',
    icon: GraphIcon,
    path: '/',
    component: NavbarItem,
    security: () => true
  },
  {
    name: 'Logout',
    icon: LogoutIcon,
    path: '/logout',
    component: NavbarItem,
    security: () => true
  },
];