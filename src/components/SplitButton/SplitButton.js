import * as React from 'react';
import { Button, ButtonGroup, ClickAwayListener, Grow, Paper } from '@mui/material';
import { Popper, MenuItem, MenuList } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];

export default function SplitButton(props) {
    const { options } = props;
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
        options[selectedIndex].onClick()
    };

    const handleMenuItemClick = (index) => {
        setSelectedIndex(index);
        setOpen(false);
        // onClick()

    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };

    return (
        <React.Fragment>
        <ButtonGroup
            variant="outlined"
            ref={anchorRef}
        >
            <Button startIcon={options[selectedIndex].icon} onClick={handleClick}>{options[selectedIndex].text}</Button>
            <Button
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
            >
            <ArrowDropDownIcon />
            </Button>
        </ButtonGroup>
        <Popper
            sx={{
            zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
        >
            {({ TransitionProps, placement }) => (
            <Grow
                {...TransitionProps}
                style={{
                transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
            >
                <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option, index) => (
                        <MenuItem
                            key={option.text}
                            // selected={option.selected}
                            onClick={() => handleMenuItemClick(index, option.onClick)}
                        >
                            {option.icon}&nbsp;&nbsp;
                            {option.text}
                        </MenuItem>
                    ))}
                    </MenuList>
                </ClickAwayListener>
                </Paper>
            </Grow>
            )}
        </Popper>
        </React.Fragment>
    );
}
