import ProjectExportUrl from '@site/static/screenshots/project-export.png';
import ProjectListUrl from '@site/static/screenshots/project-list.png';
import ProjectReportsUrl from '@site/static/screenshots/project-reports.png';
import ProjectReviewUrl from '@site/static/screenshots/project-review.png';
import ProjectViewUrl from '@site/static/screenshots/project-view.png';
import AddNewUserUrl from '@site/static/screenshots/add-new-user.png';
import UsersPageUrl from '@site/static/screenshots/users-page.png';
import UpdateUserRoleButtonUrl from '@site/static/screenshots/update-user-button.png';

const imageStyle = {
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    padding: 20,
    marginTop: 10
};

export function ProjectExportImg() {
    return <img src={ProjectExportUrl} />;
}
export function ProjectListImg() {
    return <img src={ProjectListUrl} />;
}
export function ProjectReportsImg() {
    return <img src={ProjectReportsUrl} />;
}
export function ProjectReviewImg() {
    return <img src={ProjectReviewUrl} />;
}
export function ProjectViewImg() {
    return <img src={ProjectViewUrl} />;
}
export function AddNewUser() {
    return <img src={AddNewUserUrl} style={imageStyle}/>;
}
export function UsersPage() {
    return <img src={UsersPageUrl} style={imageStyle}/>;
}
export function UpdateUserRoleButton() {
    return <img src={UpdateUserRoleButtonUrl} style={imageStyle}/>;
}
