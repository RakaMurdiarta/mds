export type MetaData = {
  timestamp: string;
};
export interface ApiResponse<Data> {
  message?: string;
  data: Data;
  metaData?: MetaData;
  statusCode?: number;
}
