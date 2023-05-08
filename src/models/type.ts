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
    acceptTerms: boolean;
};

export type UserHistoryDataType = {
    roundedTrip: string;
    from: string;
    destination: string;
}

export type RefreshTokenFromDataBaseType ={
    email: string;
    refreshToken: string;
}