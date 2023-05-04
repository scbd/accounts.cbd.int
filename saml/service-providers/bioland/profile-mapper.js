import { name       , uid, email } from "../../services/saml-constants/claims.js"
import { unspecified }             from "../../services/saml-constants/name-identifer-formats.js"
import   _                         from "lodash"


export default class  {

  constructor(u) {

    if(!u)
      throw new Error("No user provided");

    this.user = u;
  }

  /**
   * Return user claims
   */
  getClaims() {

    const { user } = this;
    const { overrideReason, ...claims }  = user.claims || {};

    for(let key in claims) {
      if(_.isArray(claims[key]) && !claims[key].length)
        claims[key] = null; // force null of empty array
    }

    claims[uid.id]     = user.userID;
    claims[email.id]   = user.email;
    claims[name.id]    = user.name;

    return claims;
  }


  /**
   * get user ID metadata used in the metadata endpoint.
   */
  getNameIdentifier() {
    return { 
      nameIdentifier: this.getClaims()[uid.id],
      nameIdentifierFormat: unspecified
    };
  }

  /**
   * claims metadata used in the metadata endpoint.
   */
  get metadata() { 
    return  [
      uid,
      email,
      name
    ];
  }
}