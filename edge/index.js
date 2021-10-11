function handler(event) {
  var uri = event.request.uri;
  if (uri.startsWith("/about")) return redir("/");
  if (uri.startsWith("/followers")) return redir("/");

  if (uri !== "/" && !uri.includes(".")) event.request.uri += ".html";
  return event.request;
}

function redir(location) {
  return {
    statusCode: 302,
    statusDescription: "Found",
    headers: {
      location: { value: location },
    },
  };
}
