import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { useXmtpProvider } from "@/app/(context)/xmtpContext";
import { IMessageDetails } from "@/app/cars/[id]/page";

// Extend the HTMLDialogElement to include showModal method
interface ExtendedDialogElement extends HTMLDialogElement {
  showModal: () => void;
}

interface MessageResult {
  success: boolean;
  message: string;
}

const MessageSeller = ({ to, conversation }: IMessageDetails) => {
  const [textValue, setTextValue] = useState("");
  const modalRef = useRef<ExtendedDialogElement>(null);
  const { xmtpClient } = useXmtpProvider();

  const messageSellerAction = async (
    message: string,
    to: string,
    conversation: any
  ) => {
    let actionConvo = conversation;
    // if we found no conversation it's a new one... so create it
    if (actionConvo == null) {
      actionConvo = await xmtpClient.conversations.newConversation(to);
    }
    // now we are guarenteed to haev a conversation, prepare the message
    console.log(`preparing the message to send ...`);
    const preparedTextMessage = await actionConvo.prepareMessage(message);

    // now try and send the message
    try {
      console.log(`trying to send message...`);
      preparedTextMessage.send();
      console.log(`message send successfully `);
    } catch (e) {
      // handle error, enable canceling and retries (see below)
      console.error("Error sending message... ");
      console.error(e);
    }
  };

  const showModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  return (
    <div>
      <Button className="btn" onClick={showModal}>
        Message Seller
      </Button>
      <dialog
        ref={modalRef} //TODO: Fix width for desktop
        className="modal rounded-md border-blue-600 p-3 w-[90%] h-[15rem]"
      >
        <div className="modal-box h-full">
          <h3 className="font-bold text-lg">Enter Message:</h3>
          <textarea
            className="w-full h-[9rem] overflow-y-auto border-blue-600 rounded-md border-2 m-y-1"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog" className="flex justify-around w-full">
              <div>
                <Button>Cancel</Button>
              </div>

              <div>
                <Button
                  onClick={async () => {
                    await messageSellerAction(textValue, to, conversation);
                  }}
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MessageSeller;
