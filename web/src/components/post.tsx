import { styled } from "~/stitches";
import { PropsWithChildren } from "solid-js";
import { Profile } from "./profile";
import { Meta, Title } from "solid-meta";
import { Link as RouteLink } from "solid-app-router";

export type MetadataType = {
  title: string;
  description: string;
  date: string;
  minutes: number;
  slug: string;
};

export const Indent = styled("div", {
  paddingLeft: "$3",
});

export const Quote = styled("div", {
  paddingLeft: "$4",
  borderLeft: "4px solid $textPrimary",
  fontStyle: "italic",
  margin: "$5 0",
});

export const H1 = styled("h1", {
  fontWeight: "600",
  fontSize: "$8",
  letterSpacing: "-0.034em",
  margin: 0,
});

export const H2 = styled("h2", {
  marginTop: "$7",
  marginBottom: "$2",
  fontWeight: "600",
  fontSize: "$7",
  letterSpacing: "-0.031em",
});

export const H3 = styled("h3", {
  marginTop: "$7",
  marginBottom: "$1",
  fontWeight: "600",
  fontSize: "$5",
  letterSpacing: "-0.015em",
});

export const Subtitle = styled("p", {
  marginTop: "$2",
  marginBottom: "$0",
  fontSize: "$6",
  letterSpacing: "-0.016em",
  color: "$textSecondary",
});

export const Paragraph = styled("p", {
  marginTop: "0",
  marginBottom: "$3",
  lineHeight: "30px",
  letterSpacing: "-0.016em",
  fontSize: "$5",
});

export const Link = styled("a", {
  color: "$blue10",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

export const Image = styled("img", {
  width: "100%",
  height: "auto",
  alignSelf: "flex-start",
  margin: "$6 0",
});

export const Wide = styled("div", {
  display: "none",
  "@md": {
    display: "block",
  },
  "@2xl": {
    marginLeft: "-133px",
    marginRight: "-133px",
  },
});

export const Code = styled("div", {
  fontFamily: "monospace",
  padding: "$3",
  borderRadius: "8px",
  border: "1px solid $slate6",
  whiteSpace: "pre-wrap",
  fontSize: "$3",
  lineHeight: "22px",
  margin: "$5 0",
});

export const Strong = styled("span", {
  fontWeight: 600,
});

export const Highlight = styled("span", {
  variants: {
    color: {
      code: {
        fontFamily: "monospace",
        fontSize: "$4",
        backgroundColor: "$slate3",
        color: "$slate11",
      },
      blue: {
        backgroundColor: "$blue3",
        color: "$blue11",
      },
      green: {
        backgroundColor: "$green3",
        color: "$green11",
      },
      red: {
        backgroundColor: "$red3",
        color: "$red11",
      },
    },
  },
  defaultVariants: {
    color: "blue",
  },
  padding: "0 5px 2px",
});

const Root = styled("div", {
  display: "flex",
  minHeight: "100vh",
});

const Content = styled("div", {
  width: "100%",
  maxWidth: "750px",
  padding: "$6 0",
  "@sm": {
    padding: "$8 0",
  },
});

const Left = styled("div", {
  padding: "0 $7",
  flexGrow: 1,
  display: "flex",
  justifyContent: "center",
});

const Right = styled("div", {
  flex: "0 0 300px",
  padding: "0 $7",
  borderLeft: "1px solid $gray6",
  position: "sticky",
  top: "0px",
  display: "none",
  "@xl": {
    display: "block",
  },
});

const Back = styled(RouteLink, {
  display: "inline-block",
  marginBottom: "$2",
  fontSize: "$5",
  color: "$slate11",
  fontWeight: 500,
});

const DetailsRoot = styled("div", {
  display: "flex",
  fontSize: "$3",
  color: "$textSecondary",
  marginTop: "$3",
  marginBottom: "$7",
});

const DetailsItem = styled("div", {});
const DetailsSpacer = styled("div", {
  width: "1px",
  background: "$slate8",
  margin: "0 $3",
});

export function Details(props: { metadata: MetadataType }) {
  const d = new Date(props.metadata.date);
  let ye = new Intl.DateTimeFormat("en", {
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
  let mo = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
  }).format(d);
  let da = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    timeZone: "UTC",
  }).format(d);
  const date = `${mo} ${da}, ${ye}`;
  return (
    <DetailsRoot>
      <DetailsItem>{date}</DetailsItem>
      <DetailsSpacer />
      <DetailsItem>{props.metadata.minutes} min read</DetailsItem>
    </DetailsRoot>
  );
}

export function Post(
  props: PropsWithChildren<{
    metadata: MetadataType;
  }>
) {
  const url = `https://thdxr.com/${props.metadata.slug}`;
  const img = `https://banners.beyondco.de/${encodeURIComponent(
    props.metadata.title
  )}.png?theme=dark&packageManager=&packageName=&pattern=architect&style=style_1&description=Dax+Raad&md=0&showWatermark=0&fontSize=100px&images=lightning-bolt`;
  return (
    <Root>
      <Meta name="title" content={props.metadata.title} />
      <Meta name="description" content={props.metadata.description} />

      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={url} />
      <Meta property="og:title" content={props.metadata.title} />
      <Meta property="og:description" content={props.metadata.description} />
      <Meta property="og:image" content={img} />

      <Meta property="twitter:card" content="summary_large_image" />
      <Meta property="twitter:url" content={url} />
      <Meta property="twitter:title" content={props.metadata.title} />
      <Meta
        property="twitter:description"
        content={props.metadata.description}
      />
      <Meta property="twitter:image" content={img} />
      <Title>{props.metadata.title}</Title>
      <Left>
        <Content>
          <Back href="/">← Blog</Back>
          <H1>{props.metadata.title}</H1>
          <Subtitle>{props.metadata.description}</Subtitle>
          <Details metadata={props.metadata} />
          {props.children}
        </Content>
      </Left>
      <Right>
        <Profile />
      </Right>
    </Root>
  );
}
