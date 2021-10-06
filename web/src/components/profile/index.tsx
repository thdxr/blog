import { styled } from "~/stitches";

const Root = styled("div", {
  padding: "$8 0",
  position: "fixed",
  width: "210px",
});

const Picture = styled("img", {
  width: "150px",
  height: "150px",
  borderRadius: "10000px",
});

const Name = styled("div", {
  marginTop: "$3",
  fontWeight: 600,
  fontSize: "$6",
  letterSpacing: "-0.04em",
});

const Description = styled("div", {
  marginTop: "$1",
  fontSize: "$4",
  lineHeight: "24px",
  color: "$textSecondary",
});

const Social = styled("div", {
  marginTop: "$3",
  display: "grid",
  gridTemplateRows: "1fr",
  gap: "$2",
});

const Account = styled("a", {
  fontWeight: 600,
  fontSize: "$4",
  color: "$textPrimary",
  textDecoration: "none",
});

export function Profile() {
  return (
    <Root>
      <Picture src="https://miro.medium.com/fit/c/288/288/1*nGvlXPbfMtkli79vT9geaw.jpeg" />
      <Name>Dax Raad</Name>
      <Description>
        I build things then try to remember to write about them
      </Description>
      <Social>
        <Account target="_blank" href="https://twitter.com/thdxr">
          @thdxr
        </Account>
        <Account target="_blank" href="https://github.com/thdxr">
          GitHub
        </Account>
      </Social>
    </Root>
  );
}
