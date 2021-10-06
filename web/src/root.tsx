// @refresh reload
const _pages = import.meta.globEager("./pages/**/index.tsx");

import { getCssText, styled } from "./stitches";
import { Links, Meta, Outlet, Scripts } from "solid-start/components";
import { Assets } from "solid-js/web";

const Body = styled("body", {
  position: "relative",
  fontFamily: "$primary",
  color: "$textPrimary",
  margin: 0,
  background: "#f9fafb",
  width: "100%",
  overflowX: "hidden",
  "& *": {
    boxSizing: "border-box",
  },
  "& a": {
    textDecoration: "none",
  },
});

export default function Root(props: any) {
  const { Start } = props;
  return (
    <Start>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <Meta />
          <Links />
          <Assets>
            <style id="stitches">{getCssText()}</style>
          </Assets>
          <script
            defer
            data-domain="thdxr.com"
            src="https://plausible.io/js/plausible.js"
          ></script>
        </head>
        <Body>
          <Outlet />
          <Scripts />
        </Body>
      </html>
    </Start>
  );
}
