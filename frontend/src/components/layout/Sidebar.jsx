import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 240;

const ADMIN_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/employees', label: 'Employees', icon: <PeopleIcon /> },
  { to: '/departments', label: 'Departments', icon: <ApartmentIcon /> },
  { to: '/leaves', label: 'Leave Requests', icon: <EventNoteIcon /> },
  { to: '/reports', label: 'Reports', icon: <AssessmentIcon /> },
  { to: '/audit-logs', label: 'Audit Logs', icon: <HistoryIcon /> },
];

const EMPLOYEE_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/my-profile', label: 'My Profile', icon: <PeopleIcon /> },
  { to: '/my-leaves', label: 'My Leave Requests', icon: <EventNoteIcon /> },
];

export function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === 'ADMIN' ? ADMIN_LINKS : EMPLOYEE_LINKS;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {links.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            sx={{
              '&.active': {
                backgroundColor: 'action.selected',
                borderRight: '3px solid',
                borderColor: 'primary.main',
              },
            }}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
