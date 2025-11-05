import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';

export const BACKGROUND_FETCH_TASK = 'my-background-task';

// Generate random text for notification
const randomMessages = [
  '🚀 Background task is running!',
  '⏰ Your daily news update is ready!',
  '📰 Check out the latest headlines!',
  '✨ Fresh news articles are waiting!',
  '🔥 Breaking news just arrived!',
  '📱 Stay updated with NewsLy!',
];

const getRandomMessage = () => {
  return randomMessages[Math.floor(Math.random() * randomMessages.length)];
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('⏰ Background task started at:', new Date().toISOString());

    const randomMessage = getRandomMessage();
    console.log('📝 Random message:', randomMessage);

    // Send notification with random text
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📢 NewsLy Background Task',
        body: randomMessage,
        sound: true,
        data: {
          type: 'background_task',
          timestamp: Date.now(),
        },
      },
      trigger: null, // immediate
    });

    console.log('✅ Notification sent successfully');
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (err: any) {
    console.error('❌ Background task failed:', err);
    console.error('Error details:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
    });

    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});
