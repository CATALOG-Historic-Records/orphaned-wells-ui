import { refreshAuth, revokeToken } from "../services/app.service"
import { useEffect, useState, useRef } from 'react';

export const round = (num, scale) => {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

export const formatDate = (timestamp) => {
  if (timestamp !== null) {
    let date = new Date(timestamp*1000)
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    let formattedDate = `${month+1}/${day}/${year}`
    return formattedDate
  } else return timestamp
}

export const median = (numbers) => {
  const sorted = Array.from(numbers).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export const average = array => array.reduce((a, b) => a + b) / array.length;

export const formatConfidence = (value) => {
  // let roundedValue = Math.round((value + Number.EPSILON) * 100)
  if (value === null ) return ""
  let percentageValue = (value * 100).toLocaleString('en-US', {maximumFractionDigits:0})
  return `${percentageValue} %`
}

export const useKeyDown = (key, singleKeyCallback, shiftKeyCallback, controlKeyCallback, shiftAndControlKeyCallback, keepDefaultBehavior) => {
  /*
    hook for adding a callback function on a key down
    has options for:
      1. singleKeyCallback: the key by itself
      2. shiftKeyCallback: shift + the key
      3. controlKeyCallback: ctrl/cmd + the key
      4. shiftAndControlKeyCallback: shift + ctrl/cmd + the key
  */
  const onKeyDown = (event) => {
    // event.metaKey - pressed Command key on Macs
    // event.ctrlKey - pressed Control key on Linux or Windows
    const wasKeyPressed = event.key === key;
    if (wasKeyPressed) {
      if(!keepDefaultBehavior) event.preventDefault();
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && shiftAndControlKeyCallback) {
        shiftAndControlKeyCallback()
      }
      else if ((event.metaKey || event.ctrlKey) && controlKeyCallback) {
        controlKeyCallback()
      }
      else if (event.shiftKey && shiftKeyCallback) {
        shiftKeyCallback()
      }
      else if (singleKeyCallback) {
        singleKeyCallback()
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

export const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      callback();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return ref;
};

export const logout = () => {
  revokeToken()
  console.log("logging out")
  localStorage.clear()
  window.location.replace("/")
}

export const convertFiltersToMongoFormat = (filters) => {
  let filterBy = {}
  for (let filter of filters) {
      let nextFilter;
      if (filter.type === 'checkbox') {
          let allOptionsTrue = true
          nextFilter = { "$in": []}
          for (let each of filter.options) {
              if (each.checked) nextFilter["$in"].push(each.name)
              else allOptionsTrue = false
          }
          if (allOptionsTrue) { // if all options are checked, no need to add the filter
              nextFilter = {}
          }
      }
      else if (filter.type === 'date') {
          let date_value = filter.value
          let date_start = Math.floor(new Date(date_value).getTime() / 1000)
          let date_end = date_start+(24*3600)
          if (filter.operator === 'is') {
              nextFilter = { "$gte": date_start, "$lt": date_end}
          } else if (filter.operator === 'before') {
              nextFilter = { "$lt": date_start}
          } else if (filter.operator === 'after') {
              nextFilter = { "$gt": date_end}
          }
          
      }
      else if (filter.type === 'string') {
          if (filter.operator === 'equals') nextFilter = filter.value
          else if (filter.operator === 'contains') nextFilter = {"$regex": filter.value}
      }

      if (Object.keys(filterBy).includes(filter.key)) { // merge them
          filterBy[filter.key] = {...filterBy[filter.key], ...nextFilter}
      } else { // add key
          filterBy[filter.key] = nextFilter;
      }
  }
  return filterBy
}

/*
  Function for making API calls. reduces redundancy of handling unauthorizations everywhere
  parameters:
  apiFunc: Function
  apiParams: Array<any>
  onSuccess: Function
  onError: Function
*/
export const callAPI = (apiFunc, apiParams, onSuccess, onError) => {
  apiFunc(...apiParams)
  .then(response => {
      response.json()
      .then((data)=> {
          if (response.status === 200) {
              onSuccess(data)
          } else if (response.status === 303) {
              onError(data, response.status)
          } else if (response.status === 403) {
              onError(data, response.status)
          } else if (response.status === 401) {

              // try refresh token
              refreshAuth()
              .then(response => {
                response.json()
                .then((data)=> {

                  if (response.status === 200) {
                    console.log("refreshed tokens:")
                    localStorage.setItem("id_token", data.id_token)
                    localStorage.setItem("access_token", data.access_token)
                    apiFunc(...apiParams)
                    .then(response => {
                        response.json()
                        .then((data)=> {
                            if (response.status === 200) {
                                onSuccess(data)
                            } else {
                              logout()
                            }
                        }).catch((e) => {
                          onError(e)
                        })
                      }).catch((e) => {
                        onError(e)
                      })
                  }

                  else {
                    logout()
                  }
                }).catch((e) => {
                  logout()
                })
              }).catch((e) => {
                logout()
              })
              // end trying refresh token

            } else {
              onError(data)
          }
      }).catch((e) => {
        onError(e)
      })
  }).catch((e) =>{
    onError(e)
  })
}

export const callAPIWithBlobResponse = (apiFunc, apiParams, onSuccess, onError) => {
  apiFunc(...apiParams)
  .then(response => {
      response.blob()
      .then((data)=> {
          if (response.status === 200) {
              onSuccess(data)
          } else if (response.status === 401) {
              
              // try refresh token
              refreshAuth()
              .then(response => {
                response.json()
                .then((data)=> {

                  if (response.status === 200) {
                    console.log("refreshed tokens:")
                    localStorage.setItem("id_token", data.id_token)
                    localStorage.setItem("access_token", data.access_token)
                    apiFunc(...apiParams)
                    .then(response => {
                        response.blob()
                        .then((data)=> {
                            if (response.status === 200) {
                                onSuccess(data)
                            } else {
                              logout()
                            }
                        }).catch((e) => {
                          onError(e)
                        })
                      }).catch((e) => {
                        onError(e)
                      })
                  }

                  else {
                    logout()
                  }
                }).catch((e) => {
                  logout()
                })
              }).catch((e) => {
                logout()
              })
              // end trying refresh token


          } else {
              onError(data)
          }
      }).catch((e) => {
        onError(e)
      })
  }).catch((e) =>{
    onError(e)
  })  
} 