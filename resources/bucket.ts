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
    const isPublic = args.public || false;

    const website = {
      indexDocument: "index.html",
      errorDocument: "error.html",
      routingRules: `[{
        "Condition": {
          "KeyPrefixEquals": "docs/"
        },
        "Redirect": {
          "ReplaceKeyPrefixWith": "documents/"
        }
      }]`,
    };

    const bucket = new aws.s3.Bucket(
      bucketName,
      {
        bucket: bucketName,
        tags: {
          Environment: stack,
        },
        ...(isPublic ? {} : { acl: "private" }),
        ...(isPublic ? { website: website } : {}),
      },
      { parent: this },
    );

    new aws.s3.BucketPublicAccessBlock(
      bucketName,
      {
        bucket: bucket.id,
        blockPublicAcls: !isPublic,
        ignorePublicAcls: !isPublic,
        blockPublicPolicy: !isPublic,
        restrictPublicBuckets: !isPublic,
      },
      { parent: this },
    );

    this.registerOutputs();
  }
}
