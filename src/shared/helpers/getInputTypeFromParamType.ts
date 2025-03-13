export const getInputTypeFromParamType = (paramType: string): string => {
  switch (paramType) {
    case "Bool":
      return "checkbox";
    case "Int":
    case "Float":
      return "number";
    case "String":
      return "text";
    default:
      return "text";
  }
}