import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Select, MenuItem, FormControl, IconButton, Tooltip, FormHelperText, InputLabel } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import PopupModal from '../../components/PopupModal/PopupModal';
import ErrorBar from '../../components/ErrorBar/ErrorBar';
import { getUsers, approveUser, addUser, deleteUser } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ROLES = {
    "-1": "pending",
    1: "base user",
    10: "admin"
}

export default function AdminPage() {
    const [ users, setUsers ] = useState([])
    const [ unableToConnect, setUnableToConnect ]  = useState(false)
    const [ showNewUserModal, setShowNewUserModal ] = useState(false)
    const [ showApproveUserModal, setShowApproveUserModal ] = useState(false)
    const [ showDeleteUserModal, setShowDeleteUserModal ] = useState(false)
    const [ selectedUser, setSelectedUser ] = useState(null)
    const [ newUser, setNewUser ] = useState("")
    const [ disableSubmitNewUserButton, setDisableSubmitNewUserButton ] = useState(true)
    const [ showError, setShowError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY:5,
            paddingX:5,
        },
    }

    useEffect(()=> {
        callAPI(getUsers, ["base_user", {}], handleAuthSuccess, handleAuthError)
    },[])

    useEffect(()=> {
        // check if text is a valid email address
        setDisableSubmitNewUserButton(!emailIsValid(newUser))
    },[newUser])

    const emailIsValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleAuthSuccess = (data) => {
        setUsers(data)
    }

    const handleAuthError = (e) => {
        console.error(e)
        setUnableToConnect(true)
    }

    const handleApproveUser = () => {
        callAPI(approveUser, [selectedUser], handleSuccess, (e) => handleUserError("unable to approve user", e))
    }

    const handleAddUser = () => {
        callAPI(addUser, [newUser], handleSuccess, (e) => handleUserError("unable to add user", e))
    }

    const handleDeleteUser = () => {
        callAPI(deleteUser, [selectedUser], handleSuccess, (e) => handleUserError("unable to delete user", e))
    }

    const handleSuccess = () => {
        setTimeout(function() {
            window.location.reload()
          }, 500)
    }

    const handleClose = () => {
        setShowApproveUserModal(false)
        setSelectedUser(null)
        setShowNewUserModal(false)
        setNewUser("")
        setShowDeleteUserModal(false)
    }

    const handleUserError = (message, e) => {
        console.error(e.detail)
        setShowError(true)
        setErrorMessage(e.detail)
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="Admin"
                buttonName="+ Add user"
                handleClickButton={() => setShowNewUserModal(true)}
                // topLevel
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <UsersTable 
                        users={users}
                        setSelectedUser={setSelectedUser}
                        setShowApproveUserModal= {setShowApproveUserModal}
                        setShowDeleteUserModal={setShowDeleteUserModal}
                    />
                :
                    <h1>You are not authorized to view this page.</h1>
                }
            </Box>
            <PopupModal
                open={showApproveUserModal}
                handleClose={handleClose}
                text="Would you like to approve this user for use of the application?"
                handleSave={handleApproveUser}
                buttonText='Approve'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={showNewUserModal}
                handleClose={handleClose}
                text={newUser}
                textLabel='Enter email address of new user.'
                handleEditText={(e) => setNewUser(e.target.value)}
                handleSave={handleAddUser}
                buttonText='Submit'
                buttonColor='primary'
                buttonVariant='contained'
                width={600}
                disableSubmit={disableSubmitNewUserButton}
            />
            <PopupModal
                open={showDeleteUserModal}
                handleClose={handleClose}
                text="Are you sure you would like to remove this user?"
                handleSave={handleDeleteUser}
                buttonText='Remove'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            {
                showError && <ErrorBar duration={10000} setOpen={setShowError} severity="error" errorMessage={errorMessage} />
            }
            
        </Box>
        
    );

}

function UsersTable(props) {

    const [ tableRole, setTableRole ] = useState(-1)
    const { users, setSelectedUser, setShowApproveUserModal, setShowDeleteUserModal } = props;

    const styles = {
        headerRow: {
          fontWeight: "bold"
        },
        userRow: {
        //   cursor: "pointer",
          "&:hover": {
            background: "#efefef"
          },
        }
      }

      const handleSelectUser = (user) => {
        setShowApproveUserModal(true)
        setSelectedUser(user.email)
      }

      const handleDeleteUser = (user) => {
        setShowDeleteUserModal(true)
        setSelectedUser(user.email)
      }

    return (
        <TableContainer component={Paper}>
            <h1>Users</h1> 
            <RoleDropdown role={tableRole} handleSelectRole={setTableRole}/>
            
            
        <Table sx={{ minWidth: 650, borderTop: "5px solid #F5F5F6" }} aria-label="pending users table">
            <TableHead>
            <TableRow>
                {[["Name", "20%"], ["Email", "25%"], ["Organization", "15%"], ["Role", "20%"], ["Actions", "20%"]].map((value)=>(
                    <TableCell width={value[1]} sx={styles.headerRow} key={value[0]}>{value[0]}</TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {users.map((row, rowIdx) => {
                if (row.role === tableRole) return (
                <TableRow
                    key={row.email}
                    sx={styles.userRow}
                    // onClick={() => handleSelectUser(row)}
                >
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.hd}</TableCell>
                <TableCell>{ROLES[row.role]}</TableCell>
                <TableCell>
                    {row.role===-1 && 
                        <Tooltip title="Approve User">
                            <IconButton color="success" disabled={row.role!=-1} onClick={() => handleSelectUser(row)}><CheckCircleIcon/></IconButton>
                        </Tooltip>
                    }
                    
                    <Tooltip title="Remove User">
                        <IconButton color="error" onClick={() => handleDeleteUser(row)}><CancelIcon/></IconButton>
                    </Tooltip>
                </TableCell>
                </TableRow>
            )})}
            </TableBody>
        </Table>
        </TableContainer>
    )
}

function RoleDropdown(props) {

    const { role, handleSelectRole } = props;

    return (
        <FormControl sx={{ width: 200, pb: 3 }}>
            <InputLabel id="role-dropdown-label">Role</InputLabel>
            <Select
                labelId="role-dropdown-label"
                id="role-dropdown"
                label="Role"
                value={role}
                onChange={(event) => handleSelectRole(event.target.value)}
                size="small"
            >
            {[-1, 1].map((roleIdx) => (
                <MenuItem
                    key={roleIdx}
                    value={roleIdx}
                >
                    {ROLES[roleIdx]}
                </MenuItem>
            ))}
            </Select>
            {/* <FormHelperText>Select role</FormHelperText> */}
        </FormControl>
    )
}