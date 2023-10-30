export interface GetAuthTokenT {
  code: number;
  msg: string;
  token: string;
}

export interface GetTaskResponseT {
  code: number;
  msg: string;
}

export interface SendAnswerReponseT {
  code: number;
  msg: string;
  note: string;
}
export interface CookieTaskResponse extends GetTaskResponseT {
  cookie: string;
}
export interface ModerationTaskResponse extends GetTaskResponseT {
  input: string[];
}
export interface BlogTaskResponse extends GetTaskResponseT {
  blog: string[];
}
export interface LiarTaskResponse extends GetTaskResponseT {
  answer: string;
}
export interface ModerationResults {
  id: string;
  model: string;
  results: ModerationResult[];
}

export interface ModerationResult {
  flagged: boolean;
  categories: {
    sexual: boolean;
    hate: boolean;
    harassment: boolean;
    "self-harm": boolean;
    "sexual/minors": boolean;
    "hate/threatening": boolean;
    "violence/graphic": boolean;
    "self-harm/intent": boolean;
    "self-harm/instructions": boolean;
    "harassment/threatening": boolean;
    violence: boolean;
  };
}

export interface gtpAnswer {
  title: string;
  content: string;
}
