import React, { useState } from 'react';
import { Button, Menu, MenuItem, Checkbox, Box, TextField, IconButton } from '@mui/material';
import { Select, FormControl, InputLabel, Grid, OutlinedInput, ListItemText } from '@mui/material';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// const FILTER_OPTIONS = [
//       {
//         key: "review_status",
//         displayName: "Review Status",
//         type: "checkbox",
//         options: [
//           { name: "reviewed", checked: true },
//           { name: "unreviewed", checked: true },
//           { name: "incomplete", checked: true },
//           { name: "defective", checked: true },
//         ],
//         selectedOptions: ["reviewed", "unreviewed", "incomplete", "defective"]
//       },
//       {
//         key: "name",
//         displayName: "Record Name",
//         type: "string",
//       },
//       {
//         key: "dateCreated",
//         displayName: "Date Uploaded",
//         type: "date",
//       },
// ]

const FILTER_OPTIONS = {
    review_status: {
        key: 'review_status',
        displayName: "Review Status",   
        type: "checkbox",
        operator: 'equals',
        options: [
            { name: "reviewed", checked: true },
            { name: "unreviewed", checked: true },
            { name: "incomplete", checked: true },
            { name: "defective", checked: true },
        ],
        selectedOptions: ["reviewed", "unreviewed", "incomplete", "defective"]
    },
    name: {
      key: "name",
      displayName: "Record Name",
      type: "string",
      operator: 'equals',
      value: ''
    },
    dateCreated: {
      key: "dateCreated",
      displayName: "Date Uploaded",
      type: "date",
      operator: 'is',
      value: ''
    }
}

export default function TableFilters(props) {
    const { applyFilters } = props;
    const styles = {
        tableFilter: {
            paddingBottom: 2,
        }
    }
    const [anchorFilterMenu, setAnchorFilterMenu] = useState(null);
    const [ currentFilters, setCurrentFilters ] = useState([])
    const openFilterMenu = Boolean(anchorFilterMenu);

    const handleOpenFilters = (event) => {
        setAnchorFilterMenu(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorFilterMenu(null);
    };

    const updateCurrentFilters = (idx, field, newValue) => {
        let tempFilters = [...currentFilters]
        let tempFilter = {...tempFilters[idx]}
        if (field === 'filter') {
            let updatedValue = structuredClone(FILTER_OPTIONS[newValue])
            tempFilter=updatedValue
            
        } else if (field === 'operator') {
            tempFilter['operator'] = newValue
        } else if (field === 'value') {
            if (tempFilter.type === 'checkbox') {
                let options = tempFilter.options
                let option = options.find((element) => element.name === newValue)
                option.checked = !option.checked
                let selectedOptions = tempFilter.selectedOptions
                let idx = selectedOptions.indexOf(newValue)
                if (idx === -1) selectedOptions.push(newValue)
                else selectedOptions.splice(idx, 1)
            } else {
                tempFilter['value'] = newValue
            }
        }

        tempFilters[idx] = tempFilter
        setCurrentFilters(tempFilters)
    }

    const addNewFilter = () => {
        let tempFilters = [...currentFilters]
        tempFilters.push(structuredClone(FILTER_OPTIONS['review_status']))
        setCurrentFilters(tempFilters)
    }

    const removeFilter = (idx) => {
        let tempFilters = [...currentFilters]
        tempFilters.splice(idx, 1)
        setCurrentFilters(tempFilters)
    }

    const removeAllFilters = () => {
        setCurrentFilters([])
    }

    const handleApplyFilters = () => {
        console.log('applying filters')
        console.log(currentFilters)
    }

    return (
        <div>
        <Button
            id="filter-button"
            aria-controls={openFilterMenu ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openFilterMenu ? 'true' : undefined}
            onClick={handleOpenFilters}
            endIcon={<FilterListIcon/>}
        >
            Filters
        </Button>
        {
                <Menu
                    id="filter-menu"
                    anchorEl={anchorFilterMenu}
                    open={openFilterMenu}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'filter-button',
                    }}
                >
                    <Box p={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button onClick={addNewFilter} startIcon={<AddIcon/>}>New Filter</Button>
                        <Button onClick={removeAllFilters} startIcon={<DeleteIcon/>}>Remove All</Button>
                    </Box>
                    {
                        currentFilters.map((filter, idx) => (
                            <Box key={idx} sx={styles.tableFilter}>
                                <TableFilter
                                    thisFilter={currentFilters[idx]}
                                    updateCurrentFilters={updateCurrentFilters}
                                    filterIndex={filter.filterIndex}
                                    operator={filter.operator}
                                    idx={idx}
                                    removeFilter={removeFilter}
                                />
                            </Box>
                            
                        ))
                    }
                    
                    <Box sx={{display: 'flex', justifyContent: 'space-around', paddingBottom: 2}}>
                        <Button 
                            onClick={handleApplyFilters} 
                            variant='contained'
                            disabled={currentFilters.length === 0}
                        >
                            Apply Filters
                        </Button>
                    </Box>
                </Menu>

        }
        
        </div>
    );
}


function TableFilter(props) {
    const { thisFilter, updateCurrentFilters, operator, idx, removeFilter } = props;

    const styles = {
        menuContainer: {
            maxWidth: "75vw",
            minWidth: '25vw'
        },
        filterTitle: {
            fontWeight: "bold",
            fontSize: "16px",
            margin: "10px"
        },
    }

    const handleChangeOperator = (e) => {
        let newOperator = e.target.value
        updateCurrentFilters(idx, 'operator', newOperator)
    }

    const handleChangeFilter = (e) => {
        let newFilter = e.target.value;
        updateCurrentFilters(idx, 'filter', newFilter)
    }

    const handleUpdateCheckbox = (name) => {
        updateCurrentFilters(idx, 'value', name)
    }

    const handleUpdateString = (e) => {
        updateCurrentFilters(idx, 'value', e.target.value)
    }

    const handleUpdateDate = (e) => {
        updateCurrentFilters(idx, 'value', e.target.value)
    }

    return (    
        <Grid sx={styles.menuContainer} container px={5} spacing={5}>
            <Grid item xs={0.5} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                <IconButton onClick={() => removeFilter(idx)}>
                    <CloseIcon/>
                </IconButton>
            </Grid>
            <Grid item xs={3.7}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="column-select-label">Column</InputLabel>
                    <Select
                        labelId="column-select-label"
                        id="column-select"
                        value={thisFilter.key}
                        label="Column"
                        onChange={handleChangeFilter}
                    >
                        {Object.entries(FILTER_OPTIONS).map(([key, filter])=> (
                            <MenuItem key={key} value={key}>{filter.displayName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={3.7}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="operator-select-label">Operator</InputLabel>
                    <Select
                        labelId="operator-select-label"
                        id="operator-select"
                        value={operator}
                        label="Operator"
                        onChange={handleChangeOperator}
                    > 
                        {
                            thisFilter.type === 'checkbox' ? 
                            [
                                <MenuItem key={'checkbox1'} value={"equals"}>Equals</MenuItem>
                            ]
                            :
                            thisFilter.type === 'string' ? 
                            [
                                <MenuItem key={'string1'} value={"equals"}>Equals</MenuItem>,
                                <MenuItem key={'string2'} value={"contains"}>Contains</MenuItem>
                            ]
                            : 
                            thisFilter.type === 'date' &&
                            [
                                <MenuItem key={'date1'} value={"is"}>Is</MenuItem>,
                                <MenuItem key={'date2'} value={"before"}>Is Before</MenuItem>,
                                <MenuItem key={'date3'} value={"after"}>Is After</MenuItem>
                            ]
                        }
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={3.7}>
                {
                    thisFilter.type === 'checkbox' ? 
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="values-checkbox-label">Values</InputLabel>
                        <Select
                            labelId="values-checkbox-label"
                            id="values-checkbox"
                            multiple
                            value={[thisFilter.selectedOptions]}
                            // onChange={handleChange}
                            label="Values"
                            renderValue={(selected) => selected.join(', ')}
                        >
                        {thisFilter.options.map((option) => (
                            <MenuItem 
                                key={option.name} 
                                value={option.name}
                                onClick={() => handleUpdateCheckbox(option.name)}
                            >
                                <Checkbox checked={option.checked} />
                                <ListItemText primary={option.name} />
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl> :
                    thisFilter.type === 'string' ?
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <TextField 
                            id="string-value" 
                            label="Value" 
                            variant="standard"
                            onChange={handleUpdateString}
                            value={thisFilter.value}
                        />
                    </Box> :
                    thisFilter.type === 'date' &&
                    <TextField 
                        inputProps={{
                            "step": 1,
                        }}
                        type="date"
                        onChange={handleUpdateDate}
                    />
                }
                
            </Grid>
        </Grid>
    );
}