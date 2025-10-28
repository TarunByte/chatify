import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

function NotificationListener() {
  const { socket, authUser } = useAuthStore();
  const { isSoundEnabled } = useChatStore();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessageNotification = ({ senderName, messageText }) => {
      toast(`New message from ${senderName}\n "${messageText}"`, {
        icon: "📨",
        duration: 3000,
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
        },
      });

      // Optional: Play sound
      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed", e));
      }
    };
    socket.on("newMessageNotification", handleNewMessageNotification);

    return () => {
      socket.off("newMessageNotification", handleNewMessageNotification);
    };
  }, [socket, authUser]);
  return null;
}

export default NotificationListener;
