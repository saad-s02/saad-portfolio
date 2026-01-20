export default {
  providers: [
    {
      domain: `https://api.workos.com/${process.env.WORKOS_CLIENT_ID!}`,
      applicationID: "convex",
    },
  ],
};
