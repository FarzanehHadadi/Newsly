import * as TaskManager from 'expo-task-manager';

export const BACKGROUND_SYNC_TASK = 'background-sync';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  console.log('Background sync task started');
  //   return BackgroundFetch.Result.NewData;
});
