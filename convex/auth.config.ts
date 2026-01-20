const clientId = process.env.WORKOS_CLIENT_ID;

export default {
  providers: [
    {
      domain: "https://api.workos.com",
      applicationID: clientId,
    },
  ],
};
