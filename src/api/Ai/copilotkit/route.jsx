const runtime = new CopilotRuntime({
  // ... existing configuration
  actions: ({properties, url}) => {
    // Note that actions returns not an array, but an array **generator**.
    // You can use the input parameters to the actions generator to expose different backend actions to the Copilot at different times: 
    // `url` is the current URL on the frontend application.
    // `properties` contains custom properties you can pass from the frontend application.
    
    return [
      {
        name: "fetchNameForUserId",
        description: "Fetches user name from the database for a given ID.",
        parameters: [
          {
            name: "userId",
            type: "string",
            description: "The ID of the user to fetch data for.",
            required: true,
          },
        ],
        handler: async ({userId}: {userId: string}) => {
          // do something with the userId
          // return the user data
          return {
            name: "Darth Doe",
          };
        },
      },
    ]
  }
});
 
// ... rest of your route definition