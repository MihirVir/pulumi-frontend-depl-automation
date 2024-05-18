import * as pulumi from "@pulumi/pulumi";
import { FrontBucket } from "../resources/bucket";

type FrontendBucketArgs = {
  Name: string;
  Product: string;
};

export class Frontend extends pulumi.ComponentResource {
  constructor(args: FrontendBucketArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;

    super("pkg:index:Frontend", resourceName, {}, opts);

    // frontbucket will be parented by the Frontend
    new FrontBucket(
      {
        name: args.Name,
        product: args.Product,
        public: true, // delibrate decision,
      },
      { parent: this },
    );

    new FrontBucket(
      {
        name: `${args.Name}-repl`,
        product: args.Product,
      },
      { parent: this },
    );
  }
}
