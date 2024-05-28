import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Modal } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { authLogin } from '../../services/app.service';
import GoogleIcon from '@mui/icons-material/Google';


export default function LoginPage(props) {
    const { handleSuccessfulAuthentication, authenticated } = props;
    const [ showUnauthorizedMessage, setShowUnauthorizedMessage ] = useState(false)
    let navigate = useNavigate()

    useEffect(() => {
        if (authenticated) {
            navigate("/")
        }
    },[authenticated])

    const googleLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            authLogin(code)
            .then(response => {
                response.json()
                .then((data)=> {
                    if (response.status === 200) {
                        if (data.access_token !== undefined) {
                            let access_token = data.access_token
                            let refresh_token = data.refresh_token
                            let id_token = data.id_token
                            handleSuccessfulAuthentication(access_token, refresh_token, id_token)
                        } else {
                            // unable to authenticate
                            console.error("error trying to login")
                        }
                    } else if (response.status === 403) {
                        console.error("403 error: user is pending")
                        // TODO: display message to user saying that they are awaiting approval
                        setShowUnauthorizedMessage(true)
                    }
                }).catch((e) => {
                    console.error("error trying to login: "+e)
                })
            }).catch((e) =>{
                console.error("error trying to login: "+e)
            })
        },
        flow: 'auth-code',
      });

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY:5,
            paddingX:5,
        },
        modalBox: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: "#FAFAFA",
            boxShadow: 24,
            px: 4,
            py: 8,
            borderRadius: 4,
            "&:focus":{
                outline: "none"
            },
        },
        modalTitle: {
            display: "flex", 
            justifyContent: "center",
            fontWeight: "bold"
        },
        modalBody: {
            display: "flex",
            justifyContent: "center",
            mt: 4
        },
        button: {
            backgroundColor: "#4285F4",
        },
        unauthorized: {
            pt: 5,
            color: "red"
        }
    }

    return (
        <Box sx={styles.outerBox}>
            <Box sx={styles.innerBox}>
            <Modal
                open={true}
            >
            <Box sx={styles.modalBox}>
                <Typography sx={styles.modalTitle} variant="h6" component="h2">
                    Undocumented Orphan Wells UI
                </Typography>
                <Typography sx={styles.modalBody} component="span">
                    <Button sx={styles.button} onClick={googleLogin} variant="contained" startIcon={<GoogleIcon/>}>
                        Login with Google
                    </Button>
                </Typography>
                <Typography sx={styles.unauthorized}>
                    {
                        showUnauthorizedMessage && "*You are not authorized to access this application. Please login with a different account or contact the development team to gain access."
                    }
                </Typography>
            </Box>
            </Modal>
            </Box>
        </Box>
    );
}