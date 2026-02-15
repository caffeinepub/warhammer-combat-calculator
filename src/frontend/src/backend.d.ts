import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SavedTemplate {
    id: bigint;
    name: string;
    scenario: Scenario;
}
export interface Scenario {
    defenders: Array<string>;
    priority: string;
    attackers: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTemplate(templateId: bigint): Promise<boolean>;
    duplicateTemplate(templateId: bigint, newName: string): Promise<bigint | null>;
    getCallerTemplates(): Promise<Array<SavedTemplate>>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentScenario(): Promise<Scenario | null>;
    getTemplate(templateId: bigint): Promise<SavedTemplate | null>;
    getTemplateNames(): Promise<Array<string>>;
    getTemplatesByUser(user: Principal): Promise<Array<SavedTemplate>>;
    isCallerAdmin(): Promise<boolean>;
    renameTemplate(templateId: bigint, newName: string): Promise<boolean>;
    saveCurrentScenario(scenario: Scenario): Promise<void>;
    saveTemplate(name: string, scenario: Scenario): Promise<bigint>;
    updateTemplate(templateId: bigint, scenario: Scenario): Promise<boolean>;
}
