export interface RegisterUserPayload {
    name : string;
    email : string;
    password : string;
    profileImage?: string;
    role : string;
    phone ?: string;
}