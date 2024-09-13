import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ErrorBarProps } from '../../types';

const ErrorBar = ({setOpen, duration, margin, severity, errorMessage}: ErrorBarProps) => {

    const handleErrorClose = () => {
        setOpen(false);
    }

    return ( 
      <Snackbar open={true} autoHideDuration={duration || 5000} onClose={handleErrorClose} style={margin ? {marginBottom:'50px'} : undefined}>
        <Alert onClose={handleErrorClose} severity={severity || "error"}>
          {errorMessage}
        </Alert>
      </Snackbar>
    );
}

export default ErrorBar;