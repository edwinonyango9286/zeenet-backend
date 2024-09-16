const supertest = require("supertest");
const app = require("../app");

describe("Products", () => {
  describe("get a product route", () => {
    describe("give a product does not exist", () => {
      test("should return a 404 status code", async () => {
        const productId = "66d96a59bfc83e0139250ba8";
        const res = await supertest(app).get(
          `/api/products/getaproduct/${productId}`
        );
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Product not found");
      });
    });
    describe("give a product exist", () => {
      test("should return a 200 status code", async () => {
        const productId = "66d96a59bfc83e0139250ba8";
        const res = await supertest(app).get(
          `/api/products/getaproduct/${productId}`
        );
        expect(res.status).toBe(200);
      });
    });
  });
});


