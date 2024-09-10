import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ErrorBarProps } from '../../types';

const ErrorBar = (props: ErrorBarProps) => {

    const handleErrorClose = () => {
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