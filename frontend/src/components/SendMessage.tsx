// import {
//   isValidAddress,
//   useSendMessage,
//   useStartConversation,
// } from "@xmtp/react-sdk";
// // import type { CachedConversation } from "@xmtp/react-sdk";
// import { ChangeEvent, useCallback, useState } from "react";

// export const SendMessage: React.FC<{
//   conversation: any;
//   newConvoPeerAddress?: string;
// }> = ({ conversation, newConvoPeerAddress }) => {
//   const [peerAddress, setPeerAddress] = useState("");
//   const [message, setMessage] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const { sendMessage } = useSendMessage();
//   const { startConversation } = useStartConversation();

//   const handleAddressChange = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       setPeerAddress(e.target.value);
//     },
//     []
//   );

//   const handleMessageChange = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       setMessage(e.target.value);
//     },
//     []
//   );

//   const handleSendMessage = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (conversation) {
//         if (peerAddress && isValidAddress(peerAddress) && message) {
//           // setIsLoading(true);
//           let existingConvo = await sendMessage(conversation, message);
//           console.log(existingConvo);
//           // setIsLoading(false);
//         }
//       } else {
//         if (peerAddress && isValidAddress(peerAddress) && message) {
//           // setIsLoading(true);
//           const newConvo = await startConversation(
//             newConvoPeerAddress,
//             message
//           );
//           console.log(newConvo);
//           // setIsLoading(false);
//         }
//       }
//     },
//     [message, peerAddress, sendMessage]
//   );

//   return (
//     <form onSubmit={handleSendMessage} className="absolute z-10">
//       <input
//         name="addressInput"
//         type="text"
//         onChange={handleAddressChange}
//         disabled={isSending}
//       />
//       <input
//         name="messageInput"
//         type="text"
//         onChange={handleMessageChange}
//         disabled={isSending}
//       />
//     </form>
//   );
// };
