export function mapAuthCodeToMessage(Code, Message) {
  switch (Code) {
    case 200:
      return Message;
    case "ERR_BAD_REQUEST":
      return Message;
    case 422:
      return "The given data was invalid.";
    case "ERR_BAD_RESPONSE":
      return "Something went wrong while processing your request.";
    default:
      return Message ? Message : "Error: Please contact support!";
  }
}
