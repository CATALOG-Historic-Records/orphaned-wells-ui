import { FilterOption } from "../types";

export const FILTER_OPTIONS: {
  [key: string]: FilterOption;
} = {
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