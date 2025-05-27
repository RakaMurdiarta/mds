export const PROJECT_SYNC_QUEUE_NAME = '__project_sync_queue';
const PROJECT_SYNC_JOB_NAME = '__project_sync_job';
type PROJECT_SYNC_JOB_NAME = '__project_sync_job';

export const CREATE_PROJECT_SYNC_JOB_NAME = `create_${PROJECT_SYNC_JOB_NAME}`;
export type CREATE_PROJECT_SYNC_JOB_NAME = `create_${PROJECT_SYNC_JOB_NAME}`;

export const UPDATE_PROJECT_SYNC_JOB_NAME = `update_${PROJECT_SYNC_JOB_NAME}`;
export type UPDATE_PROJECT_SYNC_JOB_NAME = `update_${PROJECT_SYNC_JOB_NAME}`;

export type PROJECT_TYPE_JOB_KEY =
  | CREATE_PROJECT_SYNC_JOB_NAME
  | UPDATE_PROJECT_SYNC_JOB_NAME;
