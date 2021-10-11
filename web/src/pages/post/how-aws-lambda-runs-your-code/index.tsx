import { Component } from "solid-js";
import { Title } from "solid-meta";
import {
  H1,
  Image,
  Subtitle,
  Paragraph,
  H3,
  H2,
  Link,
  Highlight,
  Post,
  Wide,
  MetadataType,
} from "~/components/post";
import { css, styled } from "~/stitches";

import VIZ1 from "./viz1.png";
import VIZ2 from "./viz2.png";
import VIZ3 from "./viz3.png";

const VizRoot = styled("div", {
  width: "100%",
  margin: "$8 0",
  position: "relative",
  display: "flex",
  justifyContent: "center",
});

const VizImage = styled("img", {
  alignSelf: "flex-start",
});

const Visualization: Component = (props) => {
  return (
    <Wide>
      <VizRoot>{props.children}</VizRoot>
    </Wide>
  );
};

export const Metadata: MetadataType = {
  title: "How AWS Lambda Runs Your Code",
  description: "A breakdown of the surprisingly simple Lambda Runtime API",
  slug: "how-aws-lambda-runs-your-code",
  date: "2021-10-06",
  minutes: 3,
};

export default function () {
  return (
    <Post metadata={Metadata}>
      <Paragraph>
        For the past few weeks, I've been working on an update to{" "}
        <Link href="https://serverless-stack.com/" target="_blank">
          Serverless Stack (SST)
        </Link>{" "}
        that contains some major changes to how your Lambda functions are
        executed locally.
      </Paragraph>
      <Paragraph>
        While I generally encourage using real AWS services as much as possible
        during development, SST enables local execution of functions so that
        code changes are reflected instantly without waiting for a full upload
        to AWS.
      </Paragraph>

      <Paragraph>
        To keep this in line with how things work in production, we closely
        mirror how AWS invokes your code. This might seem like a lot of work but
        is actually a fairly simple protocol that we'll learn about in this
        post.
      </Paragraph>
      <H2>The Lambda Runtime API</H2>
      <Paragraph>
        When your code is being run in AWS, it has access to the{" "}
        <Link
          href="https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html"
          target="_blank"
        >
          Lambda Runtime API.
        </Link>{" "}
        This is a fairly simple API that exposes the following endpoints:
      </Paragraph>
      <Paragraph>
        <Highlight color="blue">GET /runtime/invocation/next</Highlight>
      </Paragraph>
      <Paragraph>
        <Highlight color="green">
          POST /runtime/invocation/{"<aws-request-id>"}/response
        </Highlight>
      </Paragraph>
      <Paragraph>
        <Highlight color="red">
          POST /runtime/invocation/{"<aws-request-id>"}/error
        </Highlight>
      </Paragraph>
      <H3>The Flow</H3>
      <Paragraph>
        When your function boots up, it runs an API client specific to the
        language you are using. This client will load your handler into its
        process and then make a request to the{" "}
        <Highlight>/runtime/invocation/next</Highlight> endpoint.{" "}
      </Paragraph>

      <Visualization>
        <VizImage width={672} src={VIZ1} />
      </Visualization>

      <Paragraph>
        This endpoint will block until there is a request that needs to be
        handled by your Lambda. Once this happens, it returns the payload that
        needs to be sent to your lambda.
      </Paragraph>

      <Visualization>
        <VizImage width="100%" src={VIZ2} />
      </Visualization>

      <Paragraph>
        Now that the API client has the payload, it will call your handler
        passing the payload in as an argument.
      </Paragraph>

      <Paragraph>
        If your handler succeeds, it will POST the result to{" "}
        <Highlight color="green">
          /runtime/invocation/{"<aws-request-id>"}
        </Highlight>
      </Paragraph>
      <Paragraph>
        If your handler fails, it will POST the error to{" "}
        <Highlight color="red">
          /runtime/invocation/{"<aws-request-id>"}
        </Highlight>
      </Paragraph>

      <Visualization>
        <VizImage width="100%" src={VIZ3} />
      </Visualization>

      <Paragraph>
        The Lambda Runtime API will take care of forwarding the result to where
        it needs to go. The API Client now starts the cycle over again by making
        a request to <Highlight>/runtime/invocation/next</Highlight>
        Note, this time it doesn't need to import your handler again which is
        why cold starts do not happen with every invocation.
      </Paragraph>
      <Paragraph>
        And that's it! The protocol is that simple and recreating it just means
        implementing those 3 endpoints.
      </Paragraph>

      <H2>How we fake it</H2>
      <Paragraph>
        In SST, your functions are executing locally so they need a local Lambda
        Runtime API available. We provide a fake version that emulates the same
        three endpoints and connects to your AWS account over websocket.
      </Paragraph>
      <Paragraph>
        When a request to invoke a function comes in, it is forwarded to the
        websocket and through the{" "}
        <Highlight>/runtime/invocation/next</Highlight> endpoint to your local
        code. The response is then sent back to AWS.
      </Paragraph>

      <Paragraph>
        This is how we mirror the production environment without requiring your
        code to be uploaded on every change. Your code cannot tell it isn't
        running in AWS because it's able to find the Lambda Runtime API it's
        looking for.
      </Paragraph>

      <H2>Lambda Runtime Clients</H2>
      <Paragraph>
        Since SST supports multiple languages you might think we had to recreate
        the API client for every language. However, AWS actually open sources
        these clients for the various languages they support natively. Some
        examples:{" "}
        <Link
          target="_blank"
          href="https://github.com/aws/aws-lambda-nodejs-runtime-interface-client"
        >
          NodeJS
        </Link>
        ,{" "}
        <Link
          target="_blank"
          href="https://github.com/aws/aws-lambda-go/tree/main/lambda"
        >
          Go
        </Link>
        , and{" "}
        <Link
          target="_blank"
          href="https://github.com/aws/aws-lambda-dotnet/blob/master/Libraries/src/Amazon.Lambda.RuntimeSupport/Client/RuntimeApiClient.cs"
        >
          .NET
        </Link>
      </Paragraph>

      <Paragraph>
        These clients even follow a standard of accepting an{" "}
        <Highlight color="code">AWS_LAMBDA_RUNTIME_API</Highlight> environment
        variable so we can point them to the local instance. It's like AWS
        wanted us to do this.
      </Paragraph>

      <Paragraph>
        If you want to add support for a new language, all it takes is writing
        an API client that can talk to those 3 endpoints and run your code. You
        can even write it in bash if you want{" "}
        <Link
          target="_blank"
          href="https://deno.land/x/lambda@1.14.1/bootstrap"
        >
          which is what this Deno implementation does
        </Link>
      </Paragraph>

      <H2>Well that's unimpressive</H2>
      <Paragraph>
        Hopefully understanding how all this works and how simple it is doesn't
        leave you feeling too unimpressed with the work we're doing on SST.
      </Paragraph>
      <Paragraph>
        We intentionally make sure SST adds as little as possible when running
        things locally to ensure everything keeps behaving the same as
        production. Cloud-first development is the way to go and this is a small
        exception to make that experience smoother.
      </Paragraph>
    </Post>
  );
}
