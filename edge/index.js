function handler(event) {
  if (event.request.uri !== "/" && !event.request.uri.includes("."))
    event.request.uri += ".html";
  return event.request;
}
