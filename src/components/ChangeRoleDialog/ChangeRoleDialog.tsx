import React, { useEffect, useState, useRef } from 'react';
import { callAPI } from '../../util';
import { fetchRoles, updateUserRoles } from '../../services/app.service';
import { IconButton, Grid, Button, Chip } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorBar from '../ErrorBar/ErrorBar';
import CheckIcon from '@mui/icons-material/Check'

interface ChangeRoleDialogProps {
    open: boolean;
    selectedUser: any;
    onClose: () => void;
    team: string;
}

const ChangeRoleDialog = ({ open, selectedUser, onClose, team }: ChangeRoleDialogProps) => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [availableRoles, setAvailableRoles] = useState<any[]>([])
    const [roles, setRoles] = useState<string[]>([])
    const dialogHeight = '25vh';
    const dialogWidth = '30vw';

    const descriptionElementRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }

            callAPI(fetchRoles, ['team'], handleFetchedAvailableRoles, (e)=> console.error('unable to fetch roles '+e));
        }
    }, [open]);

    useEffect(() => {
        let initialRoles = selectedUser?.roles;
        if (initialRoles && initialRoles.team && initialRoles.team[team])
            setRoles(initialRoles.team[team])
    }, [selectedUser])


    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            minWidth: dialogWidth,
        },
        chip: {
            filled: {
                m: 1,
                cursor: 'pointer',
            },
            unfilled: {
                m: 1,
                cursor: 'pointer',
                border: '1px dashed'
            }
        },
        dialogTitle: {
            mx: 2
        }
    };

    const handleFetchedAvailableRoles = (data: any) => {
        setAvailableRoles(data)
    }

    const handleClose = () => {
        onClose();
    };

    const handleUpdateRoles = () => {
        let data = {
            role_category: 'team',
            new_roles: roles,
            email: selectedUser?.email
        }
        callAPI(updateUserRoles, [data], (data: any) => window.location.reload(), failedAuthorization);
    }

    const handleSelect = (role: string) => {
        let tempSelected = [...roles]
        const index = tempSelected.indexOf(role);
        if (index > -1) {
            tempSelected.splice(index, 1);
        } else {
            tempSelected.push(role)
        }

        setRoles(tempSelected)
    }

    const failedAuthorization = (e: string) => {
        setErrorMsg(e)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="new-dg-dialog"
            aria-describedby="new-dg-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
            }}
        >
            <DialogTitle sx={styles.dialogTitle} id="new-dg-dialog-title">Assign roles for {selectedUser?.name || selectedUser?.email || ''}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers={true}>
                <DialogContentText
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    aria-labelledby="new-dg-dialog-content-text"
                    component={'span'}
                >
                    <Grid container>

                        <Grid item xs={12}>
                            {availableRoles.map((role) => (
                                
                                <Chip 
                                    key={role.id}
                                    color={'primary'}
                                    sx={roles.includes(role.id) ? styles.chip.filled : styles.chip.unfilled}
                                    label={role.name}
                                    variant={roles.includes(role.id) ? 'filled' : 'outlined'}
                                    icon={roles.includes(role.id) ? <CheckIcon /> : undefined}
                                    onClick={() => handleSelect(role.id)}
                                />
                            ))}
                        </Grid>
                        
                    </Grid>
                </DialogContentText>
                <Button
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        right: 10,
                        bottom: 10,
                    }}
                    onClick={handleUpdateRoles}
                >
                    Update Roles
                </Button>
            </DialogContent>
            <ErrorBar
                errorMessage={errorMsg}
                setErrorMessage={setErrorMsg}
            />
        </Dialog>
    );
}

export default ChangeRoleDialog;