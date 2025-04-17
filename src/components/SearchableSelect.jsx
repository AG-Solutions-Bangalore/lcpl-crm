


import React, { useState, useCallback, useRef } from 'react';
import { TextField, MenuItem, InputAdornment, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchableSelect = ({ 
  manufacturer, 
  value, 
  onChange, 
  name, 
  label, 
  required 
}) => {
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);
  
  const filterManufacturers = useCallback((items) => {
    if (!searchText) return items;
    
    const searchTerms = searchText.toLowerCase().split(' ');
    return items.filter((item) => {
      const manufacturerName = item.manufacturer_name.toLowerCase();
      return searchTerms.every(term => manufacturerName.includes(term));
    });
  }, [searchText]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toUpperCase());
  };

  const handleClick = (e) => {
    // Prevent the select from closing when clicking the search field
    e.preventDefault();
    e.stopPropagation();
    searchInputRef.current?.focus();
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300
      }
    },
    // Keep the menu open while typing
    autoClose: false,
    disableAutoFocusItem: true
  };

  const filteredManufacturers = filterManufacturers(manufacturer);

  return (
    <TextField
      id="select-corrpreffer"
      required={required}
      select
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      SelectProps={{
        MenuProps: {
          ...MenuProps,
          PaperProps: {
            ...MenuProps.PaperProps,
            sx: {
              '& .MuiList-root': {
                padding: 0
              }
            }
          }
        },
      }}
    >
      <MenuItem
        dense
        disableRipple
        disableTouchRipple
        onClick={handleClick}
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          '&:hover': {
            backgroundColor: 'background.paper'
          },
          '&.Mui-selected': {
            backgroundColor: 'background.paper !important'
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'background.paper !important'
          }
        }}
      >
        <TextField
          inputRef={searchInputRef}
          size="small"
          autoFocus
          placeholder="TYPE TO SEARCH..."
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onClick={handleClick}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            style: { textTransform: 'uppercase' }
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'background.paper',
            },
            '& input': {
              textTransform: 'uppercase'
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </MenuItem>

      {filteredManufacturers.length === 0 && (
        <MenuItem 
          disabled
          sx={{
            '&.Mui-disabled': {
              opacity: 1
            }
          }}
        >
          <Box sx={{ py: 1, px: 2 }}>
            <Typography color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              NO MANUFACTURERS FOUND
            </Typography>
          </Box>
        </MenuItem>
      )}

      {filteredManufacturers.map((c_manufacturer, key) => {
        const manufacturerName = c_manufacturer.manufacturer_name.toUpperCase();
        const searchPattern = searchText ? new RegExp(`(${searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi') : null;

        const highlightedText = searchText ? (
          <Box component="span">
            {manufacturerName.split(searchPattern).map((part, index) => 
              part.toUpperCase() === searchText ? (
                <Box component="span" key={index} sx={{ backgroundColor: 'action.hover' }}>
                  {part}
                </Box>
              ) : part
            )}
          </Box>
        ) : manufacturerName;

        return (
          <MenuItem 
            key={key} 
            value={c_manufacturer.id}
            sx={{
              '&.MuiMenuItem-root': {
                textTransform: 'uppercase'
              }
            }}
          >
            {highlightedText}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SearchableSelect;