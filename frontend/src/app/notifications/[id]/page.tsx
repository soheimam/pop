import { NotificationItem, chainNameType } from "@pushprotocol/uiweb";
import * as PushAPI from "@pushprotocol/restapi";
import { useWeb3React } from "@web3-react/core";

const { account, library, chainId } = useWeb3React();
const _signer = library.getSigner(account);

const notifications = await PushAPI.user.getFeeds({
  user: "eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681", // user address in CAIP
  env: "staging",
});

function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "notifications");

  return (
    <main>
      {notifications.map((oneNotification, i) => {
        const {
          cta,
          title,
          message,
          app,
          icon,
          image,
          url,
          blockchain,
          notification,
        } = oneNotification;

        return (
          <NotificationItem
            key={id} // any unique id
            notificationTitle={title}
            notificationBody={message}
            cta={cta}
            app={app}
            icon={icon}
            image={image}
            url={url}
            theme={theme}
            chainName={blockchain}
            // chainName={blockchain as chainNameType} // if using Typescript
          />
        );
      })}
    </main>
  );
}

export default Page;
