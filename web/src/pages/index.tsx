import { styled } from "~/stitches";
import { For } from "solid-js";
import { Details, Link, MetadataType, Paragraph } from "~/components/post";
import { Link as RouterLink } from "solid-app-router";
import { Title, Meta } from "solid-meta";

const posts = import.meta.globEager("./post/**/index.tsx");
const metadata = Object.values(posts)
  .map((item) => item.Metadata as MetadataType)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const Root = styled("div", {
  width: "100%",
  maxWidth: "670px",
  margin: "$8 auto",
});

const List = styled("div", {
  display: "grid",
  marginTop: "$8",
  gridTemplateRows: "1fr",
  gridGap: "$0",
});

const H2 = styled("h2", {
  margin: 0,
  color: "$textPrimary",
  fontWeight: "600",
  fontSize: "$7",
  letterSpacing: "-0.031em",
});

const H3 = styled("h3", {
  margin: "$1 0 0 0",
  fontSize: "$5",
  fontWeight: 500,
  marginBottom: "-$1",
  letterSpacing: "-0.016em",
  color: "$textSecondary",
  lineHeight: "27px",
});

const Header = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const HeaderPicture = styled("img", {
  borderRadius: "1000px",
  width: "150px",
  height: "auto",
});

const HeaderText = styled("div", {
  maxWidth: "450px",
});

const HeaderName = styled("h1", {
  fontSize: "$9",
  fontWeight: 700,
  margin: 0,
});

const HeaderAccounts = styled("div", {
  marginTop: "$4",
  fontSize: "$5",
  "& a": {
    color: "$textPrimary",
    fontWeight: 600,
    marginRight: "$4",
  },
});

const META_DESCRIPTION =
  "I build things then try to remember to write about them";

export default function () {
  return (
    <Root>
      <Title>Dax Raad</Title>
      <Meta name="title" content="Dax Raad" />
      <Meta name="description" content={META_DESCRIPTION} />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content="https://thdxr.com" />
      <Meta property="og:title" content="Dax Raad" />
      <Meta property="og:description" content={META_DESCRIPTION} />
      <Meta
        property="og:image"
        content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
      />

      <Meta property="twitter:card" content="summary_large_image" />
      <Meta property="twitter:url" content="https://thdxr.com" />
      <Meta property="twitter:title" content="Dax Raad" />
      <Meta property="twitter:description" content={META_DESCRIPTION} />
      <Meta
        property="twitter:image"
        content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
      />

      <Header>
        <HeaderText>
          <HeaderName>Dax Raad</HeaderName>
          <H3>
            I build things then try to remember to write about them. Currently
            building{" "}
            <Link href="https://serverless-stack.com">Serverless Stack</Link>{" "}
            and <Link href="https://withbumi.com">Bumi</Link>
          </H3>
          <HeaderAccounts>
            <a href="https://twitter.com/thdxr">@thdxr</a>
            <a href="https://github.com/thdxr">GitHub</a>
          </HeaderAccounts>
        </HeaderText>
        <HeaderPicture src="https://miro.medium.com/fit/c/288/288/1*nGvlXPbfMtkli79vT9geaw.jpeg" />
      </Header>
      <List>
        <For each={metadata}>
          {(item) => (
            <RouterLink href={`/post/${item.slug}`}>
              <H2>{item.title}</H2>
              <H3>{item.description}</H3>
              <Details metadata={item} />
            </RouterLink>
          )}
        </For>
      </List>
    </Root>
  );
}
