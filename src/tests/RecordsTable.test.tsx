import { render, screen } from '@testing-library/react';
import RecordsTable from "../components/RecordsTable/RecordsTable"
import { HashRouter } from "react-router-dom";

const mockProjects = [
    {
        "id_": "65a1682caf3fee6e0acd211f",
        "name": "Test Project",
        "description": "This is a Colorado project",
        "state": "CO",
        "creator": {
            "name": "test"
        },
        "history": [
            ""
        ],
        "attributes": [
            "attribute 1"
        ]
    },
    {
        "id_": "65a168bcaf3fee6e0acd2120",
        "name": "Test Project 2",
        "description": "This is a California project",
        "state": "CA",
        "creator": {
            "name": "test"
        },
        "history": [
            ""
        ],
        "attributes": [
            "attribute 1",
            "attribute 2"
        ]
    }
]

const mockFunction = (): void => {}

test('test records table', (): void => {

    render( 
        <HashRouter> 
            <RecordsTable 
                projectData={mockProjects[0]}
                records={[]}
                pageSize={25}
                currentPage={0}
                recordCount={10}
                appliedFilters={[]}
                sortBy={"dateAscending"}
                sortAscending={1}
                setRecords={mockFunction}
                setSortBy={mockFunction}
                setPageSize={mockFunction}
                setCurrentPage={mockFunction}
                setAppliedFilters={mockFunction}
                setSortAscending={mockFunction}
            /> 
        </HashRouter> )

    //test for component elements
    screen.getByRole('table', {  name: /records table/i});
    screen.getByRole('columnheader', {  name: /date uploaded/i});
    screen.getByRole('columnheader', {  name: /digitization status/i});
    screen.getByRole('columnheader', {  name: /review status/i});
})