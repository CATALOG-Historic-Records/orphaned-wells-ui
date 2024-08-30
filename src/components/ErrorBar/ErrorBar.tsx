import React, { FC } from 'react'; 
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface ErrorBarProps {
  setOpen: (open: boolean) => void;
  duration?: number;
  margin?: boolean;
  severity?: "error" | "warning" | "info" | "success";
  errorMessage: string;
}

const ErrorBar: FC<ErrorBarProps> = (props) => {

    const handleErrorClose = (): void => {
        props.setOpen(false);
    }

    return ( 
      <Snackbar open={true} autoHideDuration={props.duration || 5000} onClose={handleErrorClose} style={props.margin ? {marginBottom:'50px'} : undefined}>
        <Alert onClose={handleErrorClose} severity={props.severity || "error"}>
          {props.errorMessage}
        </Alert>
      </Snackbar>
    );
}

export default ErrorBar;