export type TokenRequestModel = {
  client_id: string;
  client_secret: string;
};

export type TokenResponseModel = {
  access_token: string;
  expires_in: number;
  token_type: string;
};
