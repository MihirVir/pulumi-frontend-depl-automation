import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

type FrontBucketArgs = {
  name: string;
  product: string;
  public?: boolean;
};

export class FrontBucket extends pulumi.ComponentResource {
  constructor(args: FrontBucketArgs, opts?: pulumi.CustomResourceOptions) {
    const baseResourceName = `${args.product}-${args.name}`;

    super("pkg:index:FrontBucket", baseResourceName, {}, opts);

    const stack = pulumi.getStack();

    const bucketName = `${baseResourceName}-${stack}`;

    if (args.public) {
      const bucket = new aws.s3.Bucket(
        bucketName,
        {
          bucket: bucketName,
          tags: {
            Environment: stack,
          },
        },
        { parent: this },
      );

      const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
        bucketName,
        {
          bucket: bucket.id,
          blockPublicAcls: false,
          ignorePublicAcls: false,
          blockPublicPolicy: false,
          restrictPublicBuckets: false,
        },
        { parent: bucket },
      );
    } else {
    }

    this.registerOutputs();
  }
}
