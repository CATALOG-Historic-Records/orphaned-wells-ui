let BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

export const getProjects = () => {
    return fetch(BACKEND_URL + '/get_projects', {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const getRecordGroups = (project_id: string) => {
    return fetch(BACKEND_URL + '/get_record_groups/'+project_id, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const getProcessors = (state: string) => {
    return fetch(BACKEND_URL + '/get_processors/'+state, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const getProcessorData = (google_id: string) => {
    return fetch(BACKEND_URL + '/get_processor_data/'+google_id, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
}

export const getColumnData = (location: string, _id: string) => {
    return fetch(BACKEND_URL + '/get_column_data/'+location+'/'+_id, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
}

export const getProjectData = (project_id: string, page: number, records_per_page: number, sort: string, filter: string) => {
    let route = BACKEND_URL + '/get_project/' + project_id + '?page=' + page + '&records_per_page=' + records_per_page;
    let data: { sort: string; filter: string } = {
        sort: sort,
        filter: filter
    };
    return fetch(route, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const getRecordGroup = (rg_id: string) => {
    return fetch(BACKEND_URL + '/get_record_group/' + rg_id, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const getRecords = (get_by: string, data: any, page: number, records_per_page: number) => {
    let route = BACKEND_URL + '/get_records/' + get_by + '?page=' + page + '&records_per_page=' + records_per_page;
    return fetch(route, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const getTeamInfo = () => {
    return fetch(BACKEND_URL + '/get_team_info', {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const addProject = (data: any) => {
    return fetch(BACKEND_URL + '/add_project', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const addRecordGroup = (data: any) => {
    return fetch(BACKEND_URL + '/add_record_group', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const uploadDocument = (data: FormData, project_id: string, user_email: any, reprocessed?: boolean, preventDuplicates?: boolean)  => {
    if (!reprocessed) reprocessed = false
    if (!preventDuplicates) preventDuplicates = false
    return fetch(BACKEND_URL + '/upload_document/' + project_id + '/' + user_email+'?reprocessed='+reprocessed+'&preventDuplicates='+preventDuplicates, {
        method: 'POST',
        mode: 'cors',
        body: data,
    });
};

export const getRecordData = (record_id: string) => {
    return fetch(BACKEND_URL + '/get_record/' + record_id, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const downloadRecordsCSV = (project_id: string) => {
    return fetch(BACKEND_URL + '/download_records/' + project_id, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const downloadRecords = (location: string, _id: string, export_type: string, data: any) => {
    return fetch(BACKEND_URL + '/download_records/' + location + '/' + _id + '/' + export_type, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const updateProject = (project_id: string, data: any) => {
    return fetch(BACKEND_URL + '/update_project/' + project_id, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const updateRecordGroup = (rg_id: string, data: any) => {
    return fetch(BACKEND_URL + '/update_record_group/' + rg_id, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const updateRecord = (record_id: string, data: any) => {
    return fetch(BACKEND_URL + '/update_record/' + record_id, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const deleteProject = (project_id: string) => {
    return fetch(BACKEND_URL + '/delete_project/' + project_id, {
        method: 'POST',
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const deleteRecordGroup = (rg_id: string) => {
    return fetch(BACKEND_URL + '/delete_record_group/' + rg_id, {
        method: 'POST',
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const deleteRecord = (record_id: string) => {
    return fetch(BACKEND_URL + '/delete_record/' + record_id, {
        method: 'POST',
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const authLogin = (code: any) => {
    return fetch(BACKEND_URL + '/auth_login', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(code),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const checkAuth = (idtoken: any) => {
    return fetch(BACKEND_URL + '/check_auth', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(idtoken),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const refreshAuth = () => {
    return fetch(BACKEND_URL + '/auth_refresh', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(localStorage.getItem("refresh_token")),
        headers: { "Authorization": "Bearer " + localStorage.getItem("refresh_token") }
    });
};

export const getUsers = () => {
    return fetch(BACKEND_URL + '/get_users', {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const addUser = (email: string, team_lead?: boolean, sys_admin?: boolean) => {
    if (!team_lead) team_lead = false
    if (!sys_admin) sys_admin = false
    let data = {
        team_lead: team_lead,
        sys_admin: sys_admin
    }
    return fetch(BACKEND_URL + '/add_user/' + email, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const updateUserRoles = (data: any) => {
    return fetch(BACKEND_URL + '/update_user_roles', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const updateDefaultTeam = (data: any) => {
    return fetch(BACKEND_URL + '/update_default_team', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const fetchRoles = (role_category: string) => {
    return fetch(BACKEND_URL + '/fetch_roles/'+role_category, {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const fetchTeams = () => {
    return fetch(BACKEND_URL + '/fetch_teams', {
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const checkForDuplicateRecords = (data: any, rg_id: string) => {
    return fetch(BACKEND_URL + '/check_if_records_exist/'+rg_id, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const deleteUser = (email: string) => {
    return fetch(BACKEND_URL + '/delete_user/' + email, {
        method: 'POST',
        mode: 'cors',
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const revokeToken = () => {
    return fetch(BACKEND_URL + '/logout', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(localStorage.getItem("refresh_token")),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};

export const addContributors = (project_id: string, data: any) => {
    return fetch(BACKEND_URL + '/add_contributors/' + project_id, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: { "Authorization": "Bearer " + localStorage.getItem("id_token") }
    });
};