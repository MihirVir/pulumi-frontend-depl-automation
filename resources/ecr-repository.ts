import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

type BackendArgs = {
  name: string;
  product: string;
  immutable?: boolean;
};

export class DockerRepo extends pulumi.ComponentResource {
  constructor(args: BackendArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.product}-${args.name}`;
    super("pkg:index:DockerRepo", resourceName, {}, opts);

    new aws.ecr.Repository(
      args.name,
      {
        name: resourceName,
        imageScanningConfiguration: {
          scanOnPush: false,
        },
        imageTagMutability: "MUTABLE",
      },
      { parent: this },
    );
  }
}
