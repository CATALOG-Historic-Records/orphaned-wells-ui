/*
objects
*/
export interface RecordData {
    _id: string;
    name: string;
    project_id: string;
    project_name: string;
    attributesList: Array<any>;
    img_urls: Array<string>;
    recordIndex?: number;
    review_status?: string;
    notes?: string | null;
    dateCreated: number;
    status: string;
}

export interface ProjectData {
    id_: string;
    attributes: any[];
    name: string;
    settings?: any;
    description?: string;
    documentType?: string;
    state?: string;
    creator?: {
      name?: string;
      email?: string;
    };
    dateCreated?: number;
}

export interface Attribute {
    key: string;
    value: string;
    confidence: number | null;
    edited?: boolean;
    normalized_vertices: number[][] | null;
    subattributes?: Attribute[];
}

export interface Processor {
    id: string;
    displayName: string;
    img: string;
    documentType: string;
    state: string;
    attributes: any;
    processor_id: string;
    name: string;
}

export interface FilterOption {
    key: string;
    displayName: string;
    type: string;
    operator: string;
    options?: { name: string; checked: boolean }[];
    selectedOptions?: string[];
    value?: string;
}

export interface User {
    email: string,
    name: string,
    picture: string,
    hd: string,
    role: number
  }

/*
props interfaces
*/
export interface RecordAttributesTableProps {
    handleClickField: handleClickFieldSignature;
    handleChangeValue: handleChangeValueSignature;
    fullscreen: string | null;
    displayKeyIndex: number;
    displayKeySubattributeIndex: number | null;
    handleUpdateRecord: () => void;
}

export interface RecordsTableProps {
    projectData: ProjectData;
    records: RecordData[];
    setRecords: (records: RecordData[]) => void;
    pageSize: number;
    currentPage: number;
    sortBy: string;
    sortAscending: number;
    recordCount: number;
    setPageSize: (size: number) => void;
    setCurrentPage: (page: number) => void;
    appliedFilters: any;
    setAppliedFilters: (filters: any) => void;
    setSortBy: (sortBy: string) => void;
    setSortAscending: (ascending: number) => void;
}

export interface PopupModalProps {
    width?: number;
    open: boolean;
    handleClose: () => void;
    textLabel?: string;
    text: string | null | undefined;
    handleEditText?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    buttonVariant: 'text' | 'outlined' | 'contained';
    buttonColor: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
    buttonText: string;
    input?: boolean;
    showError?: boolean;
    errorText?: string;
    iconOne?: React.ReactNode;
    iconTwo?: React.ReactNode;
    hasTwoButtons?: boolean;
    handleButtonTwoClick?: () => void;
    buttonTwoVariant?: 'text' | 'outlined' | 'contained';
    buttonTwoColor?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
    buttonTwoText?: string;
    disableSubmit?: boolean;
    multiline?: boolean;
    inputrows?: number;
}

export interface SubheaderProps {
    currentPage: string;
    buttonName?: string;
    status?: string;
    subtext?: string;
    handleClickButton?: () => void;
    disableButton?: boolean;
    previousPages?: Record<string, () => void>;
    actions?: Record<string, () => void>;
}

export interface TableFiltersProps {
    applyFilters: (filters: FilterOption[]) => void;
    appliedFilters: FilterOption[];
}

export interface UploadDocumentsModalProps {
    setShowModal: (show: boolean) => void;
    handleUploadDocument: (file: File) => void;
}

export interface BottombarProps {
    recordData: RecordData;
    onPreviousButtonClick: () => void;
    onNextButtonClick: () => void;
    onReviewButtonClick: () => void;
    handleUpdateReviewStatus: (status: string) => void;
    promptResetRecord: () => void;
}

export interface DocumentContainerProps {
    imageFiles: string[];
    attributesList: any[];
    handleChangeValue: handleChangeValueSignature;
    handleUpdateRecord: () => void;
}

export interface ColumnSelectDialogProps {
    open: boolean;
    onClose: () => void;
    columns: string[];
    project_id: string;
    project_name: string;
    project_settings?: {
        exportColumns?: string[];
    };
}

export interface CheckboxesGroupProps {
    columns: string[];
    selected: string[];
    setSelected: (selected: string[]) => void;
    exportType: string;
    setExportType: (exportType: string) => void;
}

export interface ErrorBarProps {
    setOpen: (open: boolean) => void;
    duration?: number;
    margin?: boolean;
    severity?: "error" | "warning" | "info" | "success";
    errorMessage: string;
  }


/*
functions
*/
export interface handleChangeValueSignature {
    (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
        index: number, 
        isSubattribute?: boolean, 
        subIndex?: number
    ): void;
}

export interface handleClickFieldSignature {
    (
        key: string, 
        vertices: number[][] | null, 
        index: number, 
        isSubattribute: boolean, 
        subattributeIdx: number | null
    ): void;
}