export type LoginFormDataType = {
    email: string;
    password: string;
};

export type TokenPayloadType = {
    email: string;
    firstName: string;
    lastName: string;
}

export type RegisterFormDataType = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    bthDate: Date;
    gender: string;
    country: string;
    phoneNumber: string;
    citizenship: string;
};

export type UserHistoryDataType = {
    completed: boolean;
    mainData: object;
    ticketsData: object ;
    passengersData: object ;
}

export type RefreshTokenFromDataBaseType ={
    email: string;
    refreshToken: string;
}