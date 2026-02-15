import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SavedTemplate = {
    id : Nat;
    name : Text;
    scenario : Scenario;
  };

  type Scenario = {
    attackers : [Text];
    defenders : [Text];
    priority : Text;
  };

  let userTemplates = Map.empty<Principal, Map.Map<Nat, SavedTemplate>>();
  let userCurrentScenarios = Map.empty<Principal, Scenario>();

  var nextTemplateId = 1;

  public shared ({ caller }) func saveTemplate(name : Text, scenario : Scenario) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save templates");
    };

    let templateId = nextTemplateId;
    nextTemplateId += 1;

    let template = {
      id = templateId;
      name;
      scenario;
    };

    let existingTemplates = switch (userTemplates.get(caller)) {
      case (?templates) { templates };
      case (null) { Map.empty<Nat, SavedTemplate>() };
    };

    existingTemplates.add(templateId, template);
    userTemplates.add(caller, existingTemplates);

    templateId;
  };

  public query ({ caller }) func getCallerTemplates() : async [SavedTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view templates");
    };

    switch (userTemplates.get(caller)) {
      case (?templates) {
        templates.values().toArray();
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getTemplate(templateId : Nat) : async ?SavedTemplate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view templates");
    };

    switch (userTemplates.get(caller)) {
      case (?templates) { templates.get(templateId) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteTemplate(templateId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete templates");
    };

    switch (userTemplates.get(caller)) {
      case (?templates) {
        if (templates.containsKey(templateId)) {
          templates.remove(templateId);
          userTemplates.add(caller, templates);
          true;
        } else {
          false;
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func saveCurrentScenario(scenario : Scenario) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save scenarios");
    };

    userCurrentScenarios.add(caller, scenario);
  };

  public query ({ caller }) func getCurrentScenario() : async ?Scenario {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view current scenario");
    };

    userCurrentScenarios.get(caller);
  };

  public query ({ caller }) func getTemplateNames() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view template names");
    };

    switch (userTemplates.get(caller)) {
      case (?templates) {
        templates.values().toArray().map(func(template) { template.name });
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func duplicateTemplate(templateId : Nat, newName : Text) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can duplicate templates");
    };

    switch (userTemplates.get(caller)) {
      case (?templates) {
        switch (templates.get(templateId)) {
          case (?originalTemplate) {
            let newTemplateId = nextTemplateId;
            nextTemplateId += 1;

            let newTemplate = {
              id = newTemplateId;
              name = newName;
              scenario = originalTemplate.scenario;
            };

            templates.add(newTemplateId, newTemplate);
            userTemplates.add(caller, templates);

            ?newTemplateId;
          };
          case (null) { null };
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateTemplate(templateId : Nat, scenario : Scenario) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update templates");
    };

    switch (userTemplates.get(caller)) {
      case (?templates) {
        switch (templates.get(templateId)) {
          case (?existingTemplate) {
            let updatedTemplate = {
              existingTemplate with scenario
            };

            templates.add(templateId, updatedTemplate);
            userTemplates.add(caller, templates);

            true;
          };
          case (null) { false };
        };
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getTemplatesByUser(user : Principal) : async [SavedTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view templates");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own templates");
    };

    switch (userTemplates.get(user)) {
      case (?template) {
        template.values().toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func renameTemplate(templateId : Nat, newName : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can rename templates");
    };

    switch (userTemplates.get(caller)) {
      case (?templates) {
        switch (templates.get(templateId)) {
          case (?existingTemplate) {
            let renamedTemplate = {
              existingTemplate with name = newName;
            };

            templates.add(templateId, renamedTemplate);
            userTemplates.add(caller, templates);

            true;
          };
          case (null) { false };
        };
      };
      case (null) { false };
    };
  };
};
