import { refreshAuth, revokeToken } from "../services/app.service"
import { useEffect, useState, useRef } from 'react';

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
  let percentageValue = (value * 100).toLocaleString('en-US', {maximumFractionDigits:0})
  return `${percentageValue} %`
}

export const useKeyDown = (key, singleKeyCallback, shiftKeyCallback, controlKeyCallback, shiftAndControlKeyCallback) => {
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
      event.preventDefault();
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