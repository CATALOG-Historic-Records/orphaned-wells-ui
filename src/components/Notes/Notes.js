import React, {useEffect, useState} from 'react';
import PopupModal from '../PopupModal/PopupModal';
import { updateRecord } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';


export default function Notes(props) {
    const { record_id, notes, open, onClose } = props;
    const [ recordNotes, setRecordNotes ] = useState("")
    useEffect(() => {
        setRecordNotes(notes)
    },[notes, record_id])

    const handleChangeRecordNotes = (event) => {
        setRecordNotes(event.target.value)
    }

    const handleUpdateRecordNotes = () => {
        callAPI(
            updateRecord,
            [record_id, {data: {"notes": recordNotes}, type: "notes"}],
            () => onClose(record_id, recordNotes),
            handleFailedUpdate
        )
    }

    const handleFailedUpdate = (data) => {
        console.log("unable to update notes")
        console.error(data)
        onClose()
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


