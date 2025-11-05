// app/(background)/backgroundRegister.ts
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { BACKGROUND_FETCH_TASK } from './background-task';

export async function registerBackgroundTaskAsync() {
  if (!(await TaskManager.isTaskDefined(BACKGROUND_FETCH_TASK))) {
    throw new Error(`Task ${BACKGROUND_FETCH_TASK} is not defined`);
  }
  // Note: minimumInterval is a request, not a guarantee
  // iOS/Android have system restrictions (typically 15-30 min minimum)
  // Setting it too low may cause the OS to throttle or ignore the task
  return BackgroundTask.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15, // 15 minutes (realistic minimum for background tasks)
  });
}

export async function unregisterBackgroundTaskAsync() {
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export async function getBackgroundTaskStatus() {
  const status = await BackgroundTask.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );
  return { status, isRegistered };
}
