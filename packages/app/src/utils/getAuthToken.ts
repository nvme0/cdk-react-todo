import { Auth } from "aws-amplify";

const getAuthToken = async () => {
  const user = await Auth.currentAuthenticatedUser();
  return user.signInUserSession.idToken.jwtToken;
};

export default getAuthToken;
