import React from "react";
import { googleAuthUrl } from "./config/o-auth-url";
import "./App.css";

interface IUserData {
  status: "success" | "failure";
  message: string;
  access_token: string | undefined;
  project_id: string | undefined;
  asset_id: string | undefined;
  created_data: string | undefined;
}

const App = () => {
  const [userData, setUserData] = React.useState<IUserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [checkPopupClosedIntervalID,setCheckPopupClosedIntervalID] = React.useState<number | null>(null)

  const onClickAddNewConnection = () => {
    if (!googleAuthUrl) return;

    setIsLoading(true);

    const stateJson = {
      project_id: "myProjectID123",
      asset_id: "myAssetId123",
    };

    const oauth2Endpoint = `${googleAuthUrl}&state=${JSON.stringify(
      stateJson
    )}`;

    const popupWindow = window.open(
      oauth2Endpoint,
      "Testing",
      "width=1200,height=800,top=0,left=0"
    );

    popupWindow?.postMessage("message","http://localhost:3000")

    //approach tow detecting every 1000milliseconds whether window is closed or not
    const checkPopupClosedInterval = setInterval(() => {
      if (!popupWindow || !popupWindow?.window) {
       
        clearInterval(checkPopupClosedInterval);

        if (userData) return;

        setUserData({
          status: "failure",
          message:
            "Failed to verify connection 'My Google Restricted connection'. Status Code Error: 400",
          access_token: undefined,
          project_id: undefined,
          asset_id: undefined,
          created_data: undefined,
        });

        setIsLoading(false);
      }
    }, 3000);

    setCheckPopupClosedIntervalID(checkPopupClosedInterval)
  };

  React.useEffect(() => {
    // Listen for messages from the popup window
    const receiveMessage = (event: MessageEvent<unknown>) => {
      // Ensure that the message is coming from the opened window
      if (event.origin !== "http://localhost:3000") return;

      // Handle the received message
      setUserData(event.data as IUserData);
      setIsLoading(false);
      if(checkPopupClosedIntervalID){
        setCheckPopupClosedIntervalID(null)
      }
      console.log("Received message:", event.data);
    };

    window.addEventListener("message", receiveMessage);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <button onClick={onClickAddNewConnection} disabled={isLoading}>
        {isLoading ? "Loading..." : "Add New Connection"}
      </button>
      {userData?.message && <p>{userData.message}</p>}
      {userData?.access_token && <p>Access Token: {userData.access_token}</p>}
    </div>
  );
};

export default App;
