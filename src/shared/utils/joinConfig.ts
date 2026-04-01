export interface JoinConfig {
  entity: string;
  alias: string;
  condition: string;
}

export interface JoinConfigData {
  field: string;
  value: JoinConfig;
}

export const joinConfig: JoinConfigData[] = [
  {
    field: "fieldName",
    value: {
      entity: "entity.fieldName",
      alias: "fieldName",
      condition: "entity.fieldJoinId = fieldName.uniqueId",
    },
  },
];