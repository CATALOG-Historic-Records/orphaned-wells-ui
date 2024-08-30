import React, { FC, useEffect, useState } from 'react';
import PopupModal from '../PopupModal/PopupModal';
import { updateRecord } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

interface NotesProps {
    record_id: string | undefined | null;
    notes: string | null | undefined;
    open: boolean;
    onClose: (recordId?: NotesProps["record_id"], notes?: NotesProps["notes"]) => void;
}

const Notes: FC<NotesProps> = (props) => {
    const { record_id, notes, open, onClose } = props;
    const [recordNotes, setRecordNotes] = useState<string | null | undefined>("");

    useEffect(() => {
        setRecordNotes(notes);
    }, [notes, record_id]);

    const handleChangeRecordNotes = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        setRecordNotes(event.target.value);
    }

    const handleUpdateRecordNotes = (): void => {
        callAPI(
            updateRecord,
            [record_id, { data: { "notes": recordNotes }, type: "notes" }],
            () => onClose(record_id, recordNotes),
            handleFailedUpdate
        );
    }

    const handleFailedUpdate = (data: any): void => {
        console.log("unable to update notes");
        console.error(data);
        onClose();
    }

    return (
        <PopupModal
            input
            open={open}
            handleClose={onClose}
            text={recordNotes}
            textLabel='Notes'
            handleEditText={handleChangeRecordNotes}
            handleSave={handleUpdateRecordNotes}
            buttonText='Save notes'
            buttonColor='primary'
            buttonVariant='contained'
            width={600}
            multiline
            inputrows={4}
        />
    );
}

export default Notes;