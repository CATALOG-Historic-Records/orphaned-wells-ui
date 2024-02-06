import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Typography, Modal } from '@mui/material';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { authLogin } from '../../services/app.service';
import GoogleIcon from '@mui/icons-material/Google';


export default function LoginPage(props) {
    const { handleSuccessfulAuthentication, authenticated } = props;
    let navigate = useNavigate()

    useEffect(() => {
        if (authenticated) {
            navigate("/")
        }
    },[authenticated])

    const googleLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            console.log("code " + code);
            authLogin(code)
            .then(response => response.json())
            .then((data) => {
                if (data.access_token !== undefined) {
                    let access_token = data.access_token
                    let refresh_token = data.refresh_token
                    let id_token = data.id_token
                    handleSuccessfulAuthentication(access_token, refresh_token, id_token)
                } else {
                    // unable to authenticate
                }
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
            // bgcolor: 'background.paper',
            backgroundColor: "#FAFAFA",
            // border: '2px solid #000',
            boxShadow: 24,
            px: 4,
            py: 8,
            borderRadius: 4,
            "&:focus":{
                outline: "none"
            },
            // minHeight: "20vh"
        },
        modalTitle: {
            display: "flex", 
            justifyContent: "center",
        },
        modalBody: {
            display: "flex",
            justifyContent: "center",
            mt: 2
        },
        button: {
            backgroundColor: "#4285F4",
        }
    }

    return (
        <Box sx={styles.outerBox}>
            <Box sx={styles.innerBox}>
            <Modal
                open={true}
                // onClose={handleClose}
            >
            <Box sx={styles.modalBox}>
                <Typography sx={styles.modalTitle} variant="h6" component="h2">
                    Undocumented Orphan Wells UI
                </Typography>
                <Typography sx={styles.modalBody} component="span">
                    <Button sx={styles.button} onClick={googleLogin} variant="contained" startIcon={<GoogleIcon/>}>
                        Login with Google
                    </Button>
                    {/* {() => googleLogin()} */}
                </Typography>
            </Box>
            </Modal>
            </Box>
        </Box>
    );
}