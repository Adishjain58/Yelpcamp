import Noty from "noty";
import "../../node_modules/noty/lib/noty.css";
import "../../node_modules/noty/lib/themes/mint.css";

export default class NotificationService {
  success(message) {
    new Noty({
      text: message,
      type: "success",
      timeout: 1500
    }).show();
  }
  error(message) {
    new Noty({
      text: message,
      type: "error",
      timeout: 1500
    }).show();
  }
}
