import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Popover, Typography, Box, List, ListItemButton, ListItemText } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bell, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function NotificationBell() {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await api.get('/notifications');
        if (response && response.data) {
          setNotifications(response.data);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    }
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const open = Boolean(anchorEl);

  async function markAllRead(e) {
    e.stopPropagation();
    try {
      const response = await api.post('/notifications/read');
      if (response && response.data) {
        setNotifications(response.data);
      }
    } catch (err) {
      console.error('Failed to mark notifications read', err);
    }
  }

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          border: '1px solid',
          borderColor: alpha(muiTheme.palette.divider, isDark ? 0.85 : 0.72),
          bgcolor: alpha(muiTheme.palette.background.paper, isDark ? 0.76 : 0.96),
          color: 'text.primary',
          width: 38,
          height: 38,
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={9}>
          <Bell size={17} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ width: 320, p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>Notifications</Typography>
            {unreadCount > 0 && (
              <Typography
                onClick={markAllRead}
                sx={{ fontSize: '0.76rem', fontWeight: 700, color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                Mark all read
              </Typography>
            )}
          </Box>
          <List dense sx={{ py: 0.5 }}>
            {notifications.map((n) => (
              <ListItemButton key={n.id} sx={{ opacity: n.read ? 0.6 : 1 }}>
                <ListItemText
                  primary={n.message}
                  secondary={n.time}
                  primaryTypographyProps={{ fontSize: '0.84rem', fontWeight: n.read ? 500 : 700 }}
                  secondaryTypographyProps={{ fontSize: '0.72rem' }}
                />
                {!n.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', ml: 1 }} />}
              </ListItemButton>
            ))}
            {!notifications.length && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircle2 size={24} style={{ color: '#1f9d66', marginBottom: 8 }} />
                <Typography sx={{ fontSize: '0.84rem', color: 'text.secondary' }}>All caught up!</Typography>
              </Box>
            )}
          </List>
        </Box>
      </Popover>
    </>
  );
}
