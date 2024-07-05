
import { expect } from 'chai';
import mongoose from 'mongoose';
import server from '../src/index.js'
import request from 'supertest'




const testVars = {}

describe('Register and login functionality', () => {
    before(async () => {
        await mongoose.connection.dropDatabase();
    });
    describe('register functionality', () => {
        it('should register user if username is unique', (done) => {
            request(server)
                .post("/users/register")
                .send({ username: "raseek", password: "raseek" })
                .end((err, res) => {
                    expect(res.body.message).to.equal("User Registered Successfully")
                    done()
                })
        });

        it("should not register same user twice or more", (done) => {
            request(server)
                .post("/users/register")
                .send({ username: "raseek", password: "raseek" })
                .end((err, res) => {
                    expect(res.body.message).to.equal("username already registered")
                    done()
                })
        })

    });

    describe("Login Function", () => {
        it('should login if the credential are valid', (done) => {
            request(server)
                .post("/users/login")
                .send({ username: "raseek", password: "raseek" })
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.message).to.equal("Login Success")
                    expect(res.body).to.have.property('token')
                    testVars.loginToken = res.body.token;
                    done()
                })
        });

        it('should throw error if the credential are invalid', (done) => {
            request(server)
                .post("/users/login")
                .send({ username: "admin", password: "raseek" })
                .end((err, res) => {
                    expect(res.status).to.equal(401)
                    expect(res.body.message).to.equal("username or password invalid")
                    done()
                })
        });
    })
});


describe('Change password', () => {
    it('should change passwor if old password is the correct one', (done) => {
        request(server)
            .put("/users/changepassword")
            .set('Authorization', `Bearer ${testVars.loginToken}`)

            .send({ oldPassword: "raseek", newPassword: "shrestha" })
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.message).to.equal("Password Changed!")
                done()
            })
    });

    it('should result err if old and new password are same', (done) => {
        request(server)
            .put("/users/changepassword")
            .set('Authorization', `Bearer ${testVars.loginToken}`)
            .send({ oldPassword: "shrestha", newPassword: "shrestha" })
            .end((err, res) => {
                expect(res.status).to.equal(400)
                expect(res.body.message).to.equal("old and new password cannot be same")
                done()
            })
    });
    it('should result err if old password is invalid', (done) => {
        request(server)
            .put("/users/changepassword")
            .set('Authorization', `Bearer ${testVars.loginToken}`)
            .send({ oldPassword: "123", newPassword: "shrestha" })
            .end((err, res) => {
                expect(res.status).to.equal(401)
                expect(res.body.message).to.equal("old password invalid")
                done()
            })
    });
});

describe('blogs test', () => {

    it("should create a new blog", (done) => {
        request(server)
            .post("/blogs/")
            .set("Authorization", `Bearer ${testVars.loginToken}`)
            .send({ title: "testtitle", content: "testcontent" })
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("title")
                expect(res.body.data).to.have.property("content")
                expect(res.body.data).to.have.property("author")
                expect(res.body.data).to.have.property("_id")
                testVars.blogId = res.body.data._id
                done()
            })
    })


    it('should return all the available blogs', (done) => {
        request(server)
            .get("/blogs/")
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.message).to.equal("All blog available are here")
                expect(res.body).to.have.property("data")
                done()
            })

    });

    it('should return total number of blogs', (done) => {
        request(server)
            .get("/blogs/countblogs")
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body).to.have.property("totalBlogs")
                done()
            })

    });

    it('should return individual blog by id', (done) => {
        request(server)
            .get(`/blogs/${testVars.blogId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.message).to.equal("Blog fetched successfully")
                expect(res.body).to.have.property("data")
                expect(res.body.data).to.have.property("title")
                done()
            })

    });


    it('should edit individual blog by id', (done) => {
        request(server)
            .put(`/blogs/${testVars.blogId}`)
            .set("Authorization", `Bearer ${testVars.loginToken}`)
            .send({ title: "edited", content: "edited" })
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.message).to.equal("blog updated successfully")
                expect(res.body).to.have.property("data")
                expect(res.body.data.title).to.equal("edited")
                expect(res.body.data.content).to.equal("edited")
                done()
            })

    });

    it('should delete blog by id', (done) => {
        request(server)
            .delete(`/blogs/${testVars.blogId}`)
            .set("Authorization", `Bearer ${testVars.loginToken}`)
            .end((err, res) => {
                expect(res.status).to.equal(204)
                done()
            })

    });

});

describe("Comment test", () => {
    it("should post a new comment", (done) => {
        request(server)
            .post(`/comments/${testVars.blogId}`)
            .set("Authorization", `Bearer ${testVars.loginToken}`)
            .send({ content: "testcomment" })
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.message).to.equal("comment added")
                done()

            })
    })

    it("should fetch the comment on a blog", (done) => {
        request(server)
            .get(`/comments/${testVars.blogId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.data).to.be.an("array")
                expect(res.body.data[0]).to.have.property("commentor")
                expect(res.body.data[0]).to.have.property("content")
                done()

            })
    })
})



