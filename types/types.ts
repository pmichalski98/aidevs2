export type GetAuthTokenT = {
  code: number;
  msg: string;
  token: string;
};

export type GetTaskResponseT = {
  code: number;
  msg: string;
  cookie?: string;
  input?: string[];
  blog?: string[];
};

export interface CookieTaskT extends GetTaskResponseT {
  cookie: string;
}

export type SendAnswerReponseT = {
  code: number;
  msg: string;
  note: string;
};
