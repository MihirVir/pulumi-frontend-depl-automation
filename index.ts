import { Frontend } from "./services/frontend";

function main() {
  new Frontend({
    Name: "example",
    Product: "devops-tut"
  });
}

main();
