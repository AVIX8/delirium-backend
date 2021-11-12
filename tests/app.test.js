const { agent } = require("./init");

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    agent
      .get("/")
      .then(res => {
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Hello World!')
        done();
      });
  });
});