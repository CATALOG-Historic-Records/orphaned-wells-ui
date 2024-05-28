let BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export const getProjects = () => {
    return fetch(BACKEND_URL+'/get_projects', {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}; 

export const getProjectData = (project_id) => {
    return fetch(BACKEND_URL+'/get_project/'+project_id, {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}; 

export const getTeamRecords = () => {
    return fetch(BACKEND_URL+'/get_team_records', {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}; 

export const addProject = (data) => {
    return fetch(BACKEND_URL+'/add_project', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}; 

export const uploadDocument = (data, project_id) => {
    return fetch(BACKEND_URL+'/upload_document/'+project_id+'/'+localStorage.getItem("user_email"), {
        method: 'POST', 
        mode: 'cors',
        body: data,
        // headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const getRecordData = (record_id) => {
    return fetch(BACKEND_URL+'/get_record/'+record_id, {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const downloadRecordsCSV = (project_id) => {
    return fetch(BACKEND_URL+'/download_records/'+project_id, {
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const downloadRecords = (project_id, data) => {
    return fetch(BACKEND_URL+'/download_records/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const updateProject = (project_id, data) => {
    return fetch(BACKEND_URL+'/update_project/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const updateRecord = (record_id, data) => {
    return fetch(BACKEND_URL+'/update_record/'+record_id, {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const deleteProject = (project_id) => {
    return fetch(BACKEND_URL+'/delete_project/'+project_id, {
        method: 'POST', 
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const deleteRecord = (record_id) => {
    return fetch(BACKEND_URL+'/delete_record/'+record_id, {
        method: 'POST', 
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const authLogin = (code) => {
    return fetch(BACKEND_URL+'/auth_login', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(code),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const checkAuth = (idtoken) => {
    return fetch(BACKEND_URL+'/check_auth', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(idtoken),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const refreshAuth = () => {
    return fetch(BACKEND_URL+'/auth_refresh', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(localStorage.getItem("refresh_token")),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("refresh_token")}
    });
}

export const getUsers = (role, data) => {
    return fetch(BACKEND_URL+'/get_users/'+role, {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const approveUser = (email) => {
    return fetch(BACKEND_URL+'/approve_user/'+email, {
        method: 'POST', 
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const addUser = (email) => {
    return fetch(BACKEND_URL+'/add_user/'+email, {
        method: 'POST', 
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const deleteUser = (email) => {
    return fetch(BACKEND_URL+'/delete_user/'+email, {
        method: 'POST', 
        mode: 'cors',
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const revokeToken = () => {
    return fetch(BACKEND_URL+'/logout', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(localStorage.getItem("refresh_token")),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const getNextRecord = (data) => {
    return fetch(BACKEND_URL+'/get_next_record', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const getPreviousRecord = (data) => {
    return fetch(BACKEND_URL+'/get_previous_record', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}

export const addContributors = (project_id, data) => {
    return fetch(BACKEND_URL+'/add_contributors/'+project_id, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Authorization": "Bearer "+ localStorage.getItem("id_token")}
    });
}