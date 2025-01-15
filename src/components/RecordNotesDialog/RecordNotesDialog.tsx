import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { IconButton, Tooltip, TextField, Button, Stack, Box, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { updateRecord, getRecordNotes } from '../../services/app.service';
import { callAPI, formatDateTime } from '../../assets/util';
import { RecordNote, RecordNotesDialogProps } from '../../types';
import { useUserContext } from '../../usercontext';
import PopupModal from '../PopupModal/PopupModal';

const RecordNotesDialog = ({ record_id, open, onClose }: RecordNotesDialogProps) => {
    const { userEmail } = useUserContext();
    const [ recordNotes, setRecordNotes ] = useState([] as RecordNote[])
    const [ replyToIdx, setReplyToIdx ] = useState<number>()
    const [ editIdx, setEditIdx ] = useState<number>()
    const [ deleteIdx, setDeleteIdx ] = useState<number>()
    const [ newNoteText, setNewNoteText ] = useState('')
    const [ disableButton, setDisableButton ] = useState(true)
    const [ loading, setLoading ] = useState(true)
    const descriptionElementRef = useRef<HTMLDivElement | null>(null);
    const dialogHeight = '80vh';
    const dialogWidth = '35vw';
    useEffect(() => {
        if (open) {
            setLoading(true)
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
            callAPI(
                getRecordNotes,
                [record_id],
                (recordNotes) => reset(recordNotes),
                handleFailed,
            );
        } else reset()
    }, [open]);

    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
            display: 'flex',
            flexDirection: 'column',
        },
        dialogContent: {
            flex: 1, // Make content area take up available vertical space
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Ensure bottom section stays at the bottom
        },
        boxTop: {
            overflow: 'scroll'
        },
        boxBottom: {
            marginTop: 2
        },
        divider: {
            marginY: 1,
        },
        replyToText: {
            opacity: 0.5,
            fontStyle: 'italic',
            overflow: 'hidden'
        }
    };

    const handleAddNote = () => {
        handleUpdateRecordNotes('add', recordNotes.length, newNoteText)
    }

    const handleEditNote = (idx: number, newValue: string) => {
        handleUpdateRecordNotes('edit', idx, newValue)
    }

    const handleResolveNote = (idx: number) => {
        if (recordNotes[idx].resolved) handleUpdateRecordNotes('unresolve', idx)
        else handleUpdateRecordNotes('resolve', idx)
    }

    const handleDeleteNote = () => {
        if (deleteIdx !== undefined) handleUpdateRecordNotes('delete', deleteIdx)
    }

    const handleClickAction = (idx: number, action: string, newValue?: string) => {
        if (action === 'edit') {
            if (editIdx === idx)  {
                handleEditNote(idx, newValue || '')
            }
            else setEditIdx(idx)
        }
        else if (action === 'reply') {
            if (replyToIdx === idx) setReplyToIdx(undefined)
            else { 
                document.getElementById('new-note-textfield')?.focus();
                setReplyToIdx(idx)
            }
        }
        else if (action === 'resolve') {
            handleResolveNote(idx)
        }
        else if (action === 'delete') {
            setDeleteIdx(idx)
        }
    }

    const handleUpdateRecordNotes = (updateType: string, index: number, text?: string) => {
        const data: {
          [key: string]: string | number | boolean;
        } = {
            update_type: updateType,
            index: index
        }
        if (text) data['text'] = text
        if (replyToIdx !== undefined)  {
            data['isReply'] = true
            data['replyToIndex'] = replyToIdx
        }
        callAPI(
            updateRecord,
            [record_id, { data: data, type: "record_notes" }],
            (newNotes) => handleSuccessfulNoteUpdate(newNotes),
            handleFailed,
        );
    }   

    const reset = (newNotes?: RecordNote[]) => {
        setReplyToIdx(undefined)
        setEditIdx(undefined)
        setDeleteIdx(undefined)
        setNewNoteText('')
        setDisableButton(false)
        setLoading(false)
        if (newNotes === undefined) setRecordNotes([])
        else setRecordNotes(newNotes)
    }

    const handleSuccessfulNoteUpdate = (data: RecordNote[]) => {
        reset(data)
    }

    const handleFailed = (e: any) => {
        console.error('failed: ')
        console.error(e)
    }

    return (
        <Dialog
            open={open}
            onClose={() => onClose(record_id, recordNotes)}
            scroll={"paper"}
            aria-labelledby="new-dg-dialog"
            aria-describedby="new-dg-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
            }}
        >
            <DialogTitle id="new-dg-dialog-title">Notes</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => onClose(record_id, recordNotes)}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent
                sx={styles.dialogContent}
            >
                {/* Top content */}
                <Box sx={styles.boxTop}>
                    {
                        !loading && 
                        recordNotes.map((note, idx) => {
                            if (!note.isReply && !note.deleted)  {
                                return (
                                    <div key={note.timestamp}>
                                        <IndividualNote
                                            note={note}
                                            idx={idx}
                                            highlighted={replyToIdx === idx}
                                            editMode={editIdx === idx}
                                            handleClickAction={handleClickAction}
                                            userEmail={userEmail}
                                        />
                                        {!note.resolved && note.replies && note.replies.map((replyIdx) => {
                                            // if (recordNotes[replyIdx])
                                            return <IndividualNote
                                                key={replyIdx}
                                                note={recordNotes[replyIdx]}
                                                idx={replyIdx}
                                                highlighted={replyToIdx === replyIdx}
                                                editMode={editIdx === replyIdx}
                                                handleClickAction={handleClickAction}
                                                userEmail={userEmail}
                                            />
                                        })}
                                    </div>
                                )
                            }
                        })
                    }

                    <Divider sx={styles.divider}/>
                    
                    {
                        loading ? 
                        <p style={{color: 'grey'}}>
                            loading...
                        </p>
                        :
                        recordNotes.length === 0 && 
                        <p style={{color: 'grey'}}>
                            No notes added yet
                        </p>
                    }
                </Box>

                {/* Bottom section */}
                <Box sx={styles.boxBottom}>
                    <TextField
                        id='new-note-textfield'
                        fullWidth
                        required
                        variant='outlined'
                        placeholder='Type in a new note'
                        // label={}
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        multiline
                        minRows={2}
                        disabled={disableButton}
                    />
                    <Box display="flex" justifyContent='space-between' mt={1}>
                        <Typography noWrap paragraph sx={styles.replyToText}>
                            {replyToIdx !== undefined && 
                                `reply to: ${recordNotes[replyToIdx].text.substring(0, 20)}...` 
                            }
                        </Typography>
                        <Button variant="contained" onClick={handleAddNote} disabled={newNoteText==='' || disableButton}>
                            Add new note
                        </Button>
                    </Box>
                </Box>
                <PopupModal
                    open={deleteIdx !== undefined}
                    handleClose={() => setDeleteIdx(undefined)}
                    text="Are you sure you want to delete this comment?"
                    handleSave={handleDeleteNote}
                    buttonText='Delete'
                    buttonColor='error'
                    buttonVariant='contained'
                    width={400}
                />
            </DialogContent>
            
        </Dialog>
    );
}

interface IndividualNoteProps {
    note: RecordNote,
    idx: number,
    highlighted?: boolean;
    editMode?: boolean;
    handleClickAction: (idx: number, action: string, newText?: string) => void;
    userEmail: string;
}

const IndividualNote = ({ note, idx, editMode, highlighted, handleClickAction, userEmail }: IndividualNoteProps) => {
    const [ newText, setNewText ] = useState<string>(note.text)
    const [ disableSaveEdit, setDisableSaveEdit ] = useState(false)
    const [ showResolved, setShowResolved ] = useState(false)
    const styles = {
        div: {
            paddingX: 1,
            paddingBottom: (note.resolved && !showResolved) ? 0 : 1,
            marginLeft: note?.isReply ? 4 : 0,
            backgroundColor: highlighted ? "#F5F5F6" : 'inherit',
        },
        metadata: {
            opacity: 0.6,
            fontSize: '13px'
        },
        divider: {
            marginY: 1,
        },
        icon: {
            fontSize: '14px',
            color: 'black'
        },
    }

    const handleUpdateText = (e: any) => {
        let newValue = e.target.value
        setNewText(newValue)
        if (newValue === '') setDisableSaveEdit(true)
        else setDisableSaveEdit(false)
    }

    return (
        <Typography component={'div'} sx={styles.div}>
            {(note.resolved && !showResolved) ? 
                <div>
                    <Divider sx={styles.divider}/>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems='start'>
                        <Typography sx={styles.metadata}>
                            - Resolved, {formatDateTime(note.lastUpdated || -1)}
                        </Typography>
                        <Tooltip title='show resolved comment'>
                            <IconButton onClick={() => setShowResolved((showResolved) => !showResolved)}>
                                <KeyboardArrowUpIcon sx={styles.icon}/>
                            </IconButton> 
                        </Tooltip>
                        
                    </Stack>
                    
                </div>
                
                : 
                <div>
                    <Divider sx={styles.divider}/>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems='start'>
                        <div style={{ maxWidth: '75%'}}>
                        {editMode ? 
                            <TextField
                                fullWidth
                                variant='standard'
                                defaultValue={note.text}
                                multiline
                                onChange={handleUpdateText}
                            />
                        : 
                            <Typography>
                                {note.text}
                            </Typography>
                        }
                        </div>
                        

                        <Stack direction='row'>
                            {
                                note.resolved ? 
                                    <div>
                                        <Tooltip title='reopen'>
                                            <IconButton onClick={() => handleClickAction(idx, 'resolve')}>
                                                <AutorenewIcon sx={styles.icon}/>
                                            </IconButton> 
                                        </Tooltip>
                                        <Tooltip title='hide'>
                                            <IconButton onClick={() => setShowResolved((showResolved) => !showResolved)}>
                                                <KeyboardArrowDownIcon sx={styles.icon}/>
                                            </IconButton> 
                                        </Tooltip>
                                    </div>
                                    
                                : 
                                <div>
                                    {note.creator === userEmail &&
                                        <Tooltip title='edit'>
                                            <IconButton disabled={disableSaveEdit} onClick={() => handleClickAction(idx, 'edit', newText)}>
                                                {editMode ? <DoneAllIcon sx={styles.icon}/> : <EditIcon sx={styles.icon}/>}
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {!note.isReply && 
                                        <Tooltip title='resolve'>
                                            <IconButton disabled={editMode} onClick={() => handleClickAction(idx, 'resolve')}>
                                                <CheckIcon sx={styles.icon}/>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {!note.isReply && 
                                        <Tooltip title='reply'>
                                            <IconButton disabled={editMode} onClick={() => handleClickAction(idx, 'reply')}>
                                                <ReplyIcon sx={styles.icon}/>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {note.creator === userEmail &&
                                        <Tooltip title='delete'>
                                            <IconButton disabled={editMode} onClick={() => handleClickAction(idx, 'delete')}>
                                                <DeleteIcon sx={styles.icon}/>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </div>
                            }
                            
                        </Stack>
                    </Stack>
                    <Tooltip title={`originally created on ${formatDateTime(note.timestamp || -1)}`} enterDelay={1000}>
                        <Typography sx={styles.metadata}>
                            - <i>{note.creator || 'unknown'}</i>, {formatDateTime(note.lastUpdated || -1)}
                        </Typography>
                    </Tooltip>
                    
                </div>
            }
            
        </Typography>            
    );
}

export default RecordNotesDialog;