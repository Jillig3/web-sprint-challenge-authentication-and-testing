const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server.js')

// Write your tests here
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
      const res = await request(server).post('/api/auth/register').send({ username: "Trey"})
      expect(res.body).toMatchObject({message: "username and password required"})
      const dbTotal = await db('users')
      expect(dbTotal.length).toEqual(3)
    })

    it(`adds new user to databse`, async () => {
      const res = await request(server).post('/api/auth/register').send({ username: "Trey", password: "Guitar"})
      expect(res.body).toMatchObject({id: 4, username: "Trey", password: expect.any(String)})
      const dbTotal = await db('users')
      expect(dbTotal.length).toEqual(4)
    })
  

  })

  describe('[POST] /login', () => {
    it('does not login if password does not match', async () => {
      const userLogin = await request(server).post('/api/auth/login').send({ username: "fluffhead", password: "reba"})
      expect(userLogin.body).toMatchObject({ message: "invalid credentials" })
    })
  
    it('logs user in and sends back welcome message', async () => {
      const dbTotal = await db('users')
      expect(dbTotal.length).toEqual(3)
      const userLogin = await request(server).post('/api/auth/login').send({ username: "reba", password: "reba"})
      expect(userLogin.status).toBe(200)
    })
  })
})