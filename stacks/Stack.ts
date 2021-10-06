import * as sst from "@serverless-stack/resources";
import * as cf from "@aws-cdk/aws-cloudfront";
import { StaticSiteErrorOptions } from "@serverless-stack/resources";

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
      errorPage: StaticSiteErrorOptions.REDIRECT_TO_INDEX_PAGE,
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
