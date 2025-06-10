export interface ValidateTokenRequest{
    access_token?: string;
    refresh_token?: string;
}

export interface ValidateTokenResponse{
    id: number;
    jti?: string;
}