export function handler(event, _context, callback) {
  const request = event.Records[0].cf.request;
  console.log(request);
  callback(null, request);
}
