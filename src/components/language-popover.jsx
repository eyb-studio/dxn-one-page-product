import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import Iconify from './iconify';
import { useLocales } from '../locales/use-locales';

export default function LanguagePopover() {
  const { allLangs, currentLang, onChangeLang } = useLocales();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => setAnchorEl(null);
  const handleSelect = (value) => {
    onChangeLang(value);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 40,
          height: 40,
          ...(anchorEl && { bgcolor: 'action.selected' }),
        }}
      >
        <Iconify icon={currentLang.icon} width={26} sx={{ borderRadius: 0.5 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 160 } } }}
      >
        {allLangs.map((lang) => (
          <MenuItem
            key={lang.value}
            selected={lang.value === currentLang.value}
            onClick={() => handleSelect(lang.value)}
          >
            <Iconify icon={lang.icon} width={22} sx={{ mr: 1.5, borderRadius: 0.5 }} />
            <ListItemText primaryTypographyProps={{ typography: 'body2' }}>{lang.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
