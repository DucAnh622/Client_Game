import {
  LOGINFAIL,
  LOGINSUCCESS,
  LOGOUTSUCCESS,
  LOGOUTFAILED,
  REFRESHSUCCESS,
  REFRESHFAILED,
  UPDATEFAILED,
  UPDATESUCCESS
} from "../action/userAction";

const INITIAL_STATE = {
  account: {
    username: "",
    id: "",
    jwt: "",
    image: "",
    loading: false,
  },
};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGINSUCCESS:
      return {
        ...state,
        account: {
          username: action.payload.username,
          id: action.payload.id,
          image: action.payload.image,
          jwt: action.payload.access_token ? action.payload.access_token : "",
          loading: true,
        },
      };

    case LOGINFAIL:
      return {
        ...state,
        account: {
          username: "",
          id: "",
          image: "",
          jwt: "",
          loading: false,
        },
      };

    case LOGOUTSUCCESS: {
      return {
        ...state,
        account: {
          username: "",
          id: "",
          jwt: "",
          image: "",
          loading: false,
        },
      };
    }

    case LOGOUTFAILED: {
      return {
        ...state,
        account: {
          username: "",
          id: "",
          jwt: "",
          image: "",
          loading: false,
        },
      };
    }

    case REFRESHSUCCESS: {
      return {
        ...state,
        account: {
          ...account,
          jwt: action.payload,
        },
      };
    }

    case REFRESHFAILED: {
      return {
        ...state,
        account: {
          username: "",
          id: "",
          image: "",
          jwt: "",
          loading: false,
        },
      };
    }

    case UPDATESUCCESS:
      return {
        ...state,
        account: {
          username: action.payload.username,
          id: action.payload.id,
          image: action.payload.image,
          loading: true,
        },
      };

    case UPDATEFAILED:
      return {
        ...state,
        account: {
          username: "",
          id: "",
          image: "",
          jwt: "",
          loading: false,
        },
      };

    default:
      return state;
  }
};

export default UserReducer;
