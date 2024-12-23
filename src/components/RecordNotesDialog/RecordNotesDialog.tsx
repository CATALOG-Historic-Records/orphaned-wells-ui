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
import { updateRecord } from '../../services/app.service';
import { callAPI, formatDateTime } from '../../assets/util';
import { RecordNote, RecordNotesDialogProps } from '../../types';
import { useUserContext } from '../../usercontext';

const RecordNotesDialog = ({ record_id, notes, open, onClose }: RecordNotesDialogProps) => {
    const { userEmail } = useUserContext();
    const [ recordNotes, setRecordNotes ] = useState([...notes])
    const [ replyToIdx, setReplyToIdx ] = useState<number>()
    const [ editIdx, setEditIdx ] = useState<number>()
    const [ deleteIdx, setDeleteIdx ] = useState<number>()
    const [ newNoteText, setNewNoteText ] = useState('')
    const [ disableButton, setDisableButton ] = useState(false)
    const descriptionElementRef = useRef<HTMLDivElement | null>(null);
    const dialogHeight = '80vh';
    const dialogWidth = '35vw';
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    useEffect(() => {
        reset(notes)
    }, [notes]);

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
        let tempNotes = structuredClone(recordNotes)
        let newNote = {
            text: newNoteText,
            record_id: record_id,
            timestamp: Date.now(),
            creator: userEmail,
            resolved: false,
            lastUpdated: Date.now(),
            replies: [] as number[],
            isReply: false,
        } as RecordNote
        if (replyToIdx !== undefined) {
            newNote.isReply = true
            newNote.repliesTo = replyToIdx
            if (tempNotes[replyToIdx].replies) tempNotes[replyToIdx].replies?.push(tempNotes.length)
            else tempNotes[replyToIdx].replies = [tempNotes.length]
        } else newNote.isReply = false
        
        setDisableButton(true)
        let newNotes = [...tempNotes, newNote]
        callAPI(
            updateRecord,
            [record_id, { data: { "record_notes": newNotes }, type: "record_notes" }],
            () => handleSuccessfulNoteUpdate(newNotes),
            handleFailedNoteCreation,
        );
    }

    const handleEditNote = (idx: number, newValue: string) => {
        let tempNotes = structuredClone(recordNotes)
        let currentNote = tempNotes[idx]
        currentNote.text = newValue
        currentNote.lastUpdated = Date.now()
        setDisableButton(true)
        let newNotes = [...tempNotes]
        callAPI(
            updateRecord,
            [record_id, { data: { "record_notes": newNotes }, type: "record_notes" }],
            () => handleSuccessfulNoteUpdate(newNotes),
            handleFailedNoteCreation,
        );
    }

    const handleResolveNote = (idx: number) => {
        let tempNotes = structuredClone(recordNotes)
        let currentNote = tempNotes[idx]
        currentNote.lastUpdated = Date.now()
        currentNote.resolved = !currentNote.resolved
        setDisableButton(true)
        let newNotes = [...tempNotes]
        callAPI(
            updateRecord,
            [record_id, { data: { "record_notes": newNotes }, type: "record_notes" }],
            () => handleSuccessfulNoteUpdate(newNotes),
            handleFailedNoteCreation,
        );
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
            console.log('resolve: '+recordNotes[idx].text)
            handleResolveNote(idx)
        }
        else if (action === 'delete') {
            console.log('delete: '+recordNotes[idx].text)
            // show confirmation before deleting
        }
    }

    const reset = (newNotes?: RecordNote[]) => {
        setReplyToIdx(undefined)
        setEditIdx(undefined)
        setDeleteIdx(undefined)
        setNewNoteText('')
        setDisableButton(false)
        if (newNotes === undefined) setRecordNotes(notes)
        else setRecordNotes(newNotes)
    }

    const handleSuccessfulNoteUpdate = (data: RecordNote[]) => {
        reset(data)
    }

    const handleFailedNoteCreation = (e: any) => {
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
                        recordNotes.map((note, idx) => {
                            if (!note.isReply)  {
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
                                        {note.replies && note.replies.map((replyIdx) => {
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
    const [ newText, setNewText ] = useState<string>()
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

                        {editMode ? 
                            <TextField
                                fullWidth
                                variant='standard'
                                defaultValue={note.text}
                                onChange={handleUpdateText}
                            />
                        : 
                            <Typography>
                                {note.text}
                            </Typography>
                        }

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
                                    <Tooltip title='edit'>
                                        <IconButton disabled={disableSaveEdit} onClick={() => handleClickAction(idx, 'edit', newText)}>
                                            {editMode ? <DoneAllIcon sx={styles.icon}/> : <EditIcon sx={styles.icon}/>}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='resolve'>
                                        <IconButton disabled={editMode} onClick={() => handleClickAction(idx, 'resolve')}>
                                            <CheckIcon sx={styles.icon}/>
                                        </IconButton>
                                    </Tooltip>
                                    
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