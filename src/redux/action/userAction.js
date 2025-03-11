export const LOGINSUCCESS = "LOGINSUCCESS";

export const LOGINFAIL = "LOGINFAIL";

export const LOGOUTSUCCESS = "LOGOUTSUCCESS";

export const LOGOUTFAILED = "LOGOUTFAILED";

export const REFRESHSUCCESS = "REFRESHSUCCESS";

export const REFRESHFAILED = "REFRESHFAILED";

export const UPDATESUCCESS = "UPDATESUCCESS";

export const UPDATEFAILED = "UPDATEFAILED";

export const loginSuccess = (data) => {
  return {
    type: LOGINSUCCESS,
    payload: data,
  };
};

export const loginFail = () => {
  return {
    type: LOGINFAIL,
  };
};

export const logoutSuccess = () => {
  return {
    type: LOGOUTSUCCESS,
  };
};

export const logoutFailed = () => {
  return {
    type: LOGOUTFAILED,
  };
};

export const refreshSuccess = (data) => {
  return {
    type: REFRESHSUCCESS,
    payload: data,
  };
};

export const refreshFailed = () => {
  return {
    type: REFRESHFAILED,
  };
};

export const updateSuccess = (data) => {
  return {
    type: UPDATESUCCESS,
    payload: data,
  };
};

export const updateFailed = () => {
  return {
    type: UPDATEFAILED,
  };
};
