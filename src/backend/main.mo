actor {
  stable var siteContent : ?Text = null;
  stable var adminPassword : ?Text = null;

  public query func getContent() : async ?Text {
    siteContent
  };

  public func setContent(json : Text) : async () {
    siteContent := ?json;
  };

  public query func isAdminClaimed() : async Bool {
    switch (adminPassword) {
      case null false;
      case _ true;
    }
  };

  public func claimAdmin(password : Text) : async Bool {
    switch (adminPassword) {
      case null {
        adminPassword := ?password;
        true
      };
      case _ false;
    }
  };

  public query func verifyPassword(password : Text) : async Bool {
    switch (adminPassword) {
      case null false;
      case (?stored) stored == password;
    }
  };
};
