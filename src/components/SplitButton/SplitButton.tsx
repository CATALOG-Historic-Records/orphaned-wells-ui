import * as React from 'react';
import { Button, ButtonGroup, ClickAwayListener, Grow, Paper } from '@mui/material';
import { Popper, MenuItem, MenuList } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Option {
    text: string;
    icon: React.ReactNode;
    onClick: () => void;
}

interface SplitButtonProps {
    options: Option[];
}

const SplitButton: React.FC<SplitButtonProps> = (props) => {
    const { options } = props;
    const [open, setOpen] = React.useState<boolean>(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

    const handleClick = (): void => {
        options[selectedIndex].onClick();
    };

    const handleMenuItemClick = (index: number): void => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = (): void => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent): void => {
        if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
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
                                            onClick={() => handleMenuItemClick(index)}
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

export default SplitButton;