import { refreshAuth, revokeToken } from "../services/app.service"
import { useEffect, useRef } from 'react';
import { FilterOption, TableColumns } from "../types";

export const DEFAULT_FILTER_OPTIONS: {
  [key: string]: FilterOption;
} = {
  review_status: {
      key: 'review_status',
      displayName: "Review Status",   
      type: "checkbox",
      operator: 'equals',
      options: [
          { name: "reviewed", checked: true, value: "reviewed" },
          { name: "unreviewed", checked: true, value: "unreviewed" },
          { name: "incomplete", checked: true, value: "incomplete" },
          { name: "defective", checked: true, value: "defective" },
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

export const TABLE_ATTRIBUTES: {
  [key: string]: TableColumns;
} = {
  record_group: {
      displayNames: ["Record Name", "Date Uploaded", "API Number", "Mean Confidence", "Lowest Confidence", "Notes", "Digitization Status", "Review Status"],
      keyNames: ["name", "dateCreated", "api_number", "confidence_median", "confidence_lowest", "notes", "status", "review_status"],
  },
  project: {
    displayNames: ["Record Name", "Record Group", "Date Uploaded", "API Number", "Notes", "Digitization Status", "Review Status"],
    keyNames: ["name", "record_group", "dateCreated", "api_number", "notes", "status", "review_status"],
  },
  team: {
    displayNames: ["Record Name", "Date Uploaded", "API Number", "Notes", "Digitization Status", "Review Status"],
    keyNames: ["name", "dateCreated", "api_number", "notes", "status", "review_status"],
  }
}

export const round = (num: number, scale: number): number => {
  if(!("" + num).includes("e")) {
    return +(Math.round(parseFloat(num + "e+" + scale))  + "e-" + scale);
  } else {
    const arr: string[] = ("" + num).split("e");
    let sig: string = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(parseFloat(+arr[0] + "e" + sig + (+arr[1] + scale))) + "e-" + scale);
  }
}

export const formatDate = (timestamp: number | null): string | null => {
  if (timestamp !== null) {
    const date: Date = new Date(timestamp * 1000);
    const day: number = date.getDate();
    const month: number = date.getMonth();
    const year: number = date.getFullYear();
    const formattedDate: string = `${month + 1}/${day}/${year}`;
    return formattedDate;
  } else return String(timestamp);
}

export const median = (numbers: number[]): number => {
  const sorted: number[] = Array.from(numbers).sort((a, b) => a - b);
  const middle: number = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export const average = (array: number[]): number => array.reduce((a, b) => a + b) / array.length;

export const formatConfidence = (value: number | null): string => {
  if (value === null) return "";
  const percentageValue: string = (value * 100).toLocaleString('en-US', { maximumFractionDigits: 0 });
  return `${percentageValue} %`;
}

export const useKeyDown = (
  key: string, 
  singleKeyCallback?: () => void, 
  shiftKeyCallback?: () => void, 
  controlKeyCallback?: () => void, 
  shiftAndControlKeyCallback?: () => void, 
  keepDefaultBehavior?: boolean
): void => {
  const onKeyDown = (event: KeyboardEvent): void => {
    const wasKeyPressed: boolean = event.key === key;
    if (wasKeyPressed) {
      if(!keepDefaultBehavior) event.preventDefault();
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && shiftAndControlKeyCallback) {
        shiftAndControlKeyCallback();
      }
      else if ((event.metaKey || event.ctrlKey) && controlKeyCallback) {
        controlKeyCallback();
      }
      else if (event.shiftKey && shiftKeyCallback) {
        shiftKeyCallback();
      }
      else if (singleKeyCallback) {
        singleKeyCallback();
      }
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};

export const useOutsideClick = (callback: () => void): React.RefObject<HTMLTableSectionElement> => {
  const ref = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      callback();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return ref;
};

export const logout = (): void => {
  revokeToken();
  console.log("logging out");
  localStorage.clear();
  window.location.replace("/");
}

export const convertFiltersToMongoFormat = (filters: FilterOption[]): object => {
  let filterBy: { [key: string]: any } = {};
  for (let filter of filters) {
      let nextFilter: any;
      if (filter.type === 'checkbox') {
          nextFilter = { "$in": [] };
          for (let each of filter.options || []) {
              if (each.checked) nextFilter["$in"].push(each.value);
          }
      }
      else if (filter.type === 'date') {
          let date_value: string = filter.value || '';
          let date_start: number = Math.floor(new Date(date_value).getTime() / 1000);
          let date_end: number = date_start + (24 * 3600);
          if (filter.operator === 'is') {
              nextFilter = { "$gte": date_start, "$lt": date_end };
          } else if (filter.operator === 'before') {
              nextFilter = { "$lt": date_start };
          } else if (filter.operator === 'after') {
              nextFilter = { "$gt": date_end };
          }
      }
      else if (filter.type === 'string') {
          if (filter.operator === 'equals') nextFilter = filter.value;
          else if (filter.operator === 'contains') nextFilter = { "$regex": filter.value };
      }

      if (Object.keys(filterBy).includes(filter.key)) {
          filterBy[filter.key] = { ...filterBy[filter.key], ...nextFilter };
      } else {
          filterBy[filter.key] = nextFilter;
      }
  }
  return filterBy;
}

export const callAPI = (
  apiFunc: (...args: any[]) => Promise<Response>, 
  apiParams: any[], 
  onSuccess: (data: any) => void, 
  onError: (error: any, status?: number) => void
): void => {
  apiFunc(...apiParams)
  .then(response => {
      response.json()
      .then((data) => {
          if (response.status === 200) {
              onSuccess(data);
          } else if (response.status === 303 || response.status === 403) {
              onError(data, response.status);
          } else if (response.status === 401) {
              refreshAuth()
              .then(response => {
                response.json()
                .then((data) => {
                  if (response.status === 200) {
                    console.log("refreshed tokens:");
                    localStorage.setItem("id_token", data.id_token);
                    localStorage.setItem("access_token", data.access_token);
                    apiFunc(...apiParams)
                    .then(response => {
                        response.json()
                        .then((data) => {
                            if (response.status === 200) {
                                onSuccess(data);
                            } else if (response.status === 303 || response.status === 403) {
                              onError(data, response.status);
                            } else {
                              logout();
                            }
                        }).catch((e) => {
                          onError(e);
                        });
                      }).catch((e) => {
                        onError(e);
                      });
                  } else {
                    logout();
                  }
                }).catch((e) => {
                  logout();
                });
              }).catch((e) => {
                logout();
              });
            } else {
              onError(data);
          }
      }).catch((e) => {
        onError(e);
      });
  }).catch((e) => {
    onError(e);
  });
}

export const callAPIWithBlobResponse = (
  apiFunc: (...args: any[]) => Promise<Response>, 
  apiParams: any[], 
  onSuccess: (data: Blob) => void, 
  onError: (error: any) => void
): void => {
  apiFunc(...apiParams)
  .then(response => {
      response.blob()
      .then((data) => {
          if (response.status === 200) {
              onSuccess(data);
          } else if (response.status === 401) {
              refreshAuth()
              .then(response => {
                response.json()
                .then((data) => {
                  if (response.status === 200) {
                    console.log("refreshed tokens:");
                    localStorage.setItem("id_token", data.id_token);
                    localStorage.setItem("access_token", data.access_token);
                    apiFunc(...apiParams)
                    .then(response => {
                        response.blob()
                        .then((data) => {
                            if (response.status === 200) {
                                onSuccess(data);
                            } else {
                              logout();
                            }
                        }).catch((e) => {
                          onError(e);
                        });
                      }).catch((e) => {
                        onError(e);
                      });
                  } else {
                    logout();
                  }
                }).catch((e) => {
                  logout();
                });
              }).catch((e) => {
                logout();
              });
          } else {
              onError(data);
          }
      }).catch((e) => {
        onError(e);
      });
  }).catch((e) => {
    onError(e);
  });  
}