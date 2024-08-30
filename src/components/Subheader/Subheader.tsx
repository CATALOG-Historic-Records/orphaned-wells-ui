import React, { FC, useState, Fragment, MouseEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Grid, IconButton, Box, Menu, MenuItem, Chip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface SubheaderProps {
    currentPage: string;
    buttonName?: string;
    status?: string;
    subtext?: string;
    handleClickButton: () => void;
    disableButton?: boolean;
    previousPages?: Record<string, () => void>;
    actions?: Record<string, () => void>;
}

const Subheader: FC<SubheaderProps> = (props) => {
    const navigate = useNavigate();
    const { currentPage, buttonName, status, subtext, handleClickButton, disableButton, previousPages, actions } = props;
    const [showActions, setShowActions] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const styles = {
        iconButton: {
            top: -5,
            color: "black",
        },
        icon: {
            fontSize: "15px"
        },
        box: {
            paddingTop: 1,
            paddingBottom: 1,
            backgroundColor: "white",
            width: "100%",
            boxShadow: 1
        },
        gridContainer: {
            margin: 0,
            padding: 0,
        },
        directoryDisplay: {
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 40,
            overflow: "auto",
            width: "80vw"
        },
        pageName: {
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 50,
            fontSize: "25px"
        },
        newProjectColumn: {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 5,
            marginTop: 3
        },
        subtext: {
            marginTop: 2,
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 50,
            fontSize: "15px"
        }
    }

    const handleNavigate = (path: string): void => {
        navigate(path, { replace: true });
    }

    const handleShowActions = (event: MouseEvent<HTMLElement>): void => {
        setShowActions(!showActions);
        setAnchorEl(event.currentTarget);
    }

    const handleSelectAction = (action_func: () => void): void => {
        setShowActions(false);
        action_func();
    }

    return (
        <Box sx={styles.box}>
            <Grid container sx={styles.gridContainer}>
                <Grid item xs={9} >
                    <div style={styles.directoryDisplay}>
                        <IconButton sx={styles.iconButton} onClick={() => handleNavigate("/")}><HomeIcon sx={styles.icon} /></IconButton>
                        /
                        {
                            previousPages &&
                            Object.entries(previousPages).map(([page, pageAction]) => (
                                <Fragment key={page}>
                                    <Button sx={styles.iconButton} size="small" onClick={pageAction}>{page}</Button>
                                    /
                                </Fragment>
                            ))
                        }

                        <Button sx={styles.iconButton} size="small">{currentPage}</Button>
                    </div>
                    <div style={styles.pageName}>
                        {currentPage}&nbsp;
                        {actions &&
                            <>
                                <IconButton onClick={handleShowActions}><MoreHorizIcon sx={styles.icon} /></IconButton>
                                <Menu
                                    id="actions"
                                    anchorEl={anchorEl}
                                    open={showActions}
                                    onClose={() => setShowActions(false)}
                                >
                                    {Object.entries(actions).map(([action_text, action_func]) => (
                                        <MenuItem key={action_text} onClick={() => handleSelectAction(action_func)}>{action_text}</MenuItem>
                                    ))}
                                </Menu>
                            </>
                        }

                    </div>
                    <div style={styles.subtext}>
                        {subtext}
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={styles.newProjectColumn}>
                        {buttonName && localStorage.getItem("role") && localStorage.getItem("role") === "10" &&
                            <Button variant="contained" onClick={handleClickButton} disabled={disableButton}>
                                {buttonName}
                            </Button>
                        }
                        {!buttonName && status &&
                            <Chip
                                sx={{
                                    fontSize: "16px",
                                    textTransform: "capitalize",
                                    backgroundColor:
                                        status === "unreviewed" ? "default" :
                                        status === "incomplete" ? "#FFECB3" :
                                        status === "defective" ? "#FDCDD2" :
                                        status === "reviewed" ? "#C8E6C9" :
                                        undefined
                                }}
                                label={status}
                            />
                        }
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Subheader;