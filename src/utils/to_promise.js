export default async function to(promise) {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
}
