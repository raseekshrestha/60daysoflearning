import app from "../src/app.js";
import request from 'supertest';

import { expect } from 'chai';


describe('POST /register', () => {
    it('should register a new user', (done) => {
        request(app)
            .post("/register")
            .send({ username: "raseek", password: "raseek" })
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body.message).to.equal("user registered successfully");
                done();
            });
    });

    it("should not let user be registered more than once", (done) => {
        request(app)
            .post("/register")
            .send({ username: "raseek", password: "raseek" })
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body.message).to.equal("user already exists");
                done();
            });
    });
});


describe("POST /login", () => {

    it("should login a valid registered user", (done) => {
        request(app)
            .post("/login")
            .send({ username: "raseek", password: "raseek" })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.message).to.equal("login success");
                done();
            });
    });

    it("should not let user with invalid credentials login", (done) => {
        request(app)
            .post("/login")
            .send({ username: "raseek", password: "123" })
            .end((err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body.message).to.equal("login failed");
                done();
            });
    });
});
