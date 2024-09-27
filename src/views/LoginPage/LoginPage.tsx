import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Modal } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { authLogin } from '../../services/app.service';
import GoogleIcon from '@mui/icons-material/Google';

interface LoginPageProps {
    handleSuccessfulAuthentication: (accessToken: string, refreshToken: string, idToken: string) => void;
    authenticated: boolean;
}

const LoginPage = (props: LoginPageProps) => {
    const { handleSuccessfulAuthentication, authenticated } = props;
    const [showUnauthorizedMessage, setShowUnauthorizedMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated, navigate]);

    const googleLogin = useGoogleLogin({
        onSuccess: async ({ code }: { code: string }) => {
            authLogin(code)
                .then(response => {
                    response.json()
                        .then((data: { access_token?: string; refresh_token?: string; id_token?: string }) => {
                            if (response.status === 200) {
                                if (data.access_token !== undefined) {
                                    const access_token: string = data.access_token;
                                    const refresh_token: any = data.refresh_token;
                                    const id_token: any = data.id_token;
                                    handleSuccessfulAuthentication(access_token, refresh_token, id_token);
                                } else {
                                    console.error("error trying to login");
                                }
                            } else if (response.status === 403) {
                                console.error("403 error: user is pending");
                                setShowUnauthorizedMessage(true);
                            }
                        }).catch((e: Error) => {
                            console.error("error trying to login: " + e);
                        });
                }).catch((e: Error) => {
                    console.error("error trying to login: " + e);
                });
        },
        flow: 'auth-code',
    });

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY: 5,
            paddingX: 5,
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
            "&:focus": {
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
    };

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
                            <Button id='login-button' sx={styles.button} onClick={googleLogin} variant="contained" startIcon={<GoogleIcon />}>
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

export default LoginPage;