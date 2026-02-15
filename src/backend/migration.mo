import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type SavedTemplate = {
    id : Nat;
    name : Text;
    scenario : {
      attackers : [Text];
      defenders : [Text];
      priority : Text;
    };
  };

  type OldActor = {
    // No persistent state in old actor
  };

  type NewActor = {
    userTemplates : Map.Map<Principal, Map.Map<Nat, SavedTemplate>>;
    userCurrentScenarios : Map.Map<Principal, {
      attackers : [Text];
      defenders : [Text];
      priority : Text;
    }>;
    nextTemplateId : Nat;
  };

  public func run(_ : OldActor) : NewActor {
    {
      userTemplates = Map.empty<Principal, Map.Map<Nat, SavedTemplate>>();
      userCurrentScenarios = Map.empty<Principal, {
        attackers : [Text];
        defenders : [Text];
        priority : Text;
      }>();
      nextTemplateId = 1;
    };
  };
};
