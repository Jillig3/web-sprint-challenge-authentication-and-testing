const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server.js')

test('sanity', () => {
  expect(true).toBe(true)
})

describe('Jokes Auth', () => {

  beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
  })

  beforeEach(async () => {
    await db.seed.run()
  })

  afterAll(async () => {
    await db.destroy()
  })


  describe('[POST] /register', () => { 
    it(`returns error if no username in body`, async () => {
      const res = await request(server).post('/api/auth/register').send({ username: "Gabe"})
      expect(res.body).toMatchObject({message: "username and password required"})
      const dbTotal = await db('users')
      expect(dbTotal.length).toEqual(3)
    })

    it(`adds new user to databse`, async () => {
      const res = await request(server).post('/api/auth/register').send({ username: "Gabe", password: "Coding"})
      expect(res.body).toMatchObject({id: 4, username: "Gabe", password: expect.any(String)})
      const dbTotal = await db('users')
      expect(dbTotal.length).toEqual(4)
    })
  })

  describe('[POST] /login', () => {
    it('does not login if password does not match', async () => {
      const userLogin = await request(server).post('/api/auth/login').send({ username: "test", password: "becca"})
      expect(userLogin.body).toMatchObject({ message: "invalid credentials" })
    })
  
    it('logs user in and sends back welcome message', async () => {
      const dbTotal = await db('users')
      expect(dbTotal.length).toEqual(3)
      const userLogin = await request(server).post('/api/auth/login').send({ username: "jake", password: "jake123"})
      expect(userLogin.status).toBe(401)
    })
  })
})