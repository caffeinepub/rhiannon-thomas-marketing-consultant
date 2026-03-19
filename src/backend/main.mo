actor {
  stable var siteContent : ?Text = null;
  stable var adminPassword : ?Text = null;

  // Get stored content JSON (null if never set)
  public query func getContent() : async ?Text {
    siteContent
  };

  // Save content JSON (auth enforced on frontend)
  public func setContent(json : Text) : async () {
    siteContent := ?json;
  };

  // Check if admin has been claimed
  public query func isAdminClaimed() : async Bool {
    switch (adminPassword) {
      case null false;
      case _ true;
    }
  };

  // Claim admin with a password (only works if not yet claimed)
  public func claimAdmin(password : Text) : async Bool {
    switch (adminPassword) {
      case null {
        adminPassword := ?password;
        true
      };
      case _ false;
    }
  };

  // Verify admin password
  public query func verifyPassword(password : Text) : async Bool {
    switch (adminPassword) {
      case null false;
      case (?stored) stored == password;
    }
  };
};
