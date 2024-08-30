import { Fragment, FC } from 'react';
import { Grid, Button, Modal, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PopupModalProps {
    width?: number;
    open: boolean;
    handleClose: () => void;
    input?: boolean;
    textLabel: string;
    text: string;
    handleEditText: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    buttonVariant: 'text' | 'outlined' | 'contained';
    buttonColor: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
    buttonText: string;
    showError: boolean;
    errorText: string;
    iconOne?: React.ReactNode;
    iconTwo?: React.ReactNode;
    hasTwoButtons: boolean;
    handleButtonTwoClick?: () => void;
    buttonTwoVariant: 'text' | 'outlined' | 'contained';
    buttonTwoColor: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
    buttonTwoText: string;
    inputText?: string;
    disableSubmit: boolean;
    multiline?: boolean;
    inputrows?: number;
}

const PopupModal: FC<PopupModalProps> = (props) => {
    const { 
        width,
        open,
        handleClose,
        input,
        textLabel,
        text,
        handleEditText,
        handleSave,
        buttonVariant,
        buttonColor,
        buttonText,
        showError,
        errorText,
        iconOne,
        iconTwo,
        hasTwoButtons,
        handleButtonTwoClick,
        buttonTwoVariant,
        buttonTwoColor,
        buttonTwoText,
        inputText,
        disableSubmit,
        multiline,
        inputrows,
    } = props;

    const styles = {
        modalStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: width !== undefined ? width : 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        },
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowLeft") {
            e.stopPropagation();
        }
        else if (e.key === "ArrowRight") {
            e.stopPropagation();
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            {input ? 
            <Grid container sx={styles.modalStyle} spacing={1}>
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
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="standard"
                        id="margin-none"
                        label={textLabel}
                        value={text || ""}
                        onChange={handleEditText}
                        fullWidth
                        onKeyDown={handleKeyDown}
                        multiline={multiline}
                        rows={inputrows || 1}
                    />
                </Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                    <Button onClick={handleSave} variant={buttonVariant} color={buttonColor} disabled={disableSubmit}>{buttonText}</Button>
                </Grid>
            </Grid>
            :
            <Grid container sx={styles.modalStyle} spacing={1}>
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
                <Grid item xs={12}>
                    <p>{text}{showError && <span style={{color: "red"}}>{errorText}</span>}</p>
                </Grid>
                {hasTwoButtons ? 
                <>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={4.5}>
                        <Button fullWidth onClick={handleButtonTwoClick} variant={buttonTwoVariant} color={buttonTwoColor} endIcon={iconTwo && iconTwo}>{buttonTwoText}</Button>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={4.5}>
                        <Button fullWidth onClick={handleSave} variant={buttonVariant} color={buttonColor} endIcon={iconOne && iconOne}>{buttonText}</Button>
                    </Grid>
                    <Grid item xs={1}></Grid>
                </> 
                : 
                <>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                        <Button fullWidth onClick={handleSave} variant={buttonVariant} color={buttonColor} endIcon={iconOne && iconOne}>{buttonText}</Button>
                    </Grid>
                    <Grid item xs={3}></Grid>
                </>}
            </Grid>
            }
        </Modal>
    );
}

export default PopupModal;