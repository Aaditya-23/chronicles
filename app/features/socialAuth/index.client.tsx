import { LoginSocialGoogle } from "reactjs-social-login";
import type { IResolveParams } from "reactjs-social-login";

export default function SocialAuth() {
  return (
    <LoginSocialGoogle
      isOnlyGetToken={false}
      client_id={
        "1008701623130-7h1a4u83v6q1oaqkh56kgrvv557upafs.apps.googleusercontent.com"
      }
      onResolve={({ provider, data }: IResolveParams) => {
        console.log(data);
      }}
      onReject={(err) => {
        console.log(err);
      }}
    >
      login
    </LoginSocialGoogle>
  );
}
