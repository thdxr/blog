import * as sst from "@serverless-stack/resources";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as cf from "@aws-cdk/aws-cloudfront";

export class Stack extends sst.Stack {
  constructor(scope: sst.App) {
    super(scope, "stack");
    const edgeFunc = new cf.Function(this, "EdgeFunction", {
      code: cf.FunctionCode.fromFile({
        filePath: "edge/index.js",
      }),
    });

    const site = new sst.StaticSite(this, "site", {
      customDomain:
        this.stage === "production"
          ? {
              domainName: "thdxr.com",
              domainAlias: "www.thdxr.com",
            }
          : undefined,
      path: "./web",
      buildCommand: "yarn build",
      buildOutput: "./dist",
      cfDistribution: {
        defaultBehavior: {
          functionAssociations: [
            {
              function: edgeFunc,
              eventType: cf.FunctionEventType.VIEWER_REQUEST,
            },
          ],
        },
      },
    });

    this.addOutputs({
      url: site.url,
    });
  }
}
