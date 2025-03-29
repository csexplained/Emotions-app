import usertypes from "./user.types";

export interface AuthState {
    isAuthenticated: boolean;
    user: usertypes;
    isNewUser: boolean;
}