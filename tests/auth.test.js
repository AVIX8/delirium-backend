const jwt = require('jsonwebtoken')

const { agent } = require('./init')

const correctUserData = {
    email: 'SessionQwe1234@gmail.com',
    password: 'SessionQweasdzxc1234',
}

const incorrectUserData = {
    email: 'SessionQwe1234@gmail.com',
    password: 'qweasdzxc123',
}

describe('Auth', () => {
    describe('POST /api/auth/login', () => {
        test('Пользователь может успешно войти', async () => {
            await agent
                .post('/api/auth/register')
                .send(correctUserData)
                .expect(({ body }) => {
                    body //?
                    expect(body).toHaveProperty('id')
                })
                .expect(200)

            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect(({ body }) => {
                    body //?
                    expect(body).toHaveProperty('accessToken')
                    expect(body).toHaveProperty('refreshToken')
                })
                .expect(200)
        })

        test('Пользователь получает 403 при неверных credentials', async () => {
            await agent
                .post('/api/auth/login')
                .send(incorrectUserData)
                .expect(({ body }) => {
                    body //?
                    expect(body).toHaveProperty('message')
                    expect(body.message).toBe(
                        'Пароль или адрес электронной почты неверны'
                    )
                })
                .expect(403)
        })

        test('Пользователь получает 401 при протухшем токене', async () => {
            const accessToken = jwt.sign(
                correctUserData,
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1ms' }
            )
            await agent
                .set('Authorization', `Bearer ${accessToken}`)
                .get('/api/auth/user')
                .expect(({ body }) => {
                    body //?
                    expect(body).toHaveProperty('message')
                    expect(body.message).toBe('Пользователь не авторизован')
                })
                .expect(401)
        })
    })

    describe('POST /api/auth/refresh', () => {
        test('Пользователь может получить новый accessToken, используя refreshToken', async () => {
            await agent.post('/api/auth/register').send(correctUserData)
            const accessToken = jwt.sign(
                correctUserData,
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1ms' }
            )

            let refreshToken
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect(({ body }) => {
                    body //?
                    refreshToken = body.refreshToken
                })
                .expect(200)

            await agent // accessToken expired
                .set('Authorization', `Bearer ${accessToken}`)
                .get('/api/auth/user')
                .expect(401)

            let newAccessToken
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect(({ body }) => {
                    body //?
                    expect(body).toHaveProperty('accessToken')
                    expect(body).toHaveProperty('refreshToken')
                    newAccessToken = body.accessToken
                })
                .expect(200)

            await agent
                .set('Authorization', `Bearer ${newAccessToken}`)
                .get('/api/auth/user')
                .expect(200)
        })

        test('Пользователь получает 400 при неверном refreshToken', async () => {
            const invalidResfreshToken = 'invalidResfreshToken'
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken: invalidResfreshToken })
                .expect((res) => {
                    res.body //?
                })
                .expect(400)
        })

        test('Пользователь может использовать refreshToken только один раз', async () => {
            await agent.post('/api/auth/register').send(correctUserData)

            let refreshToken
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect((res) => {
                    res.body //?
                    refreshToken = res.body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect(200)

            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect(404)
        })

        test('Несколько рефреш токенов действительны', async () => {
            let refreshToken1, refreshToken2
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect(({ body }) => {
                    body //?
                    refreshToken1 = body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect(({ body }) => {
                    body //?
                    refreshToken2 = body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken: refreshToken1 })
                .expect(200)

            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken: refreshToken2 })
                .expect(200)
        })
    })

    describe('POST /api/auth/logout', () => {
        test('Рефреш токен становится недействительным после выхода', async () => {
            let refreshToken
            await agent
                .post('/api/auth/login')
                .send(correctUserData)
                .expect(({ body }) => {
                    body //?
                    refreshToken = body.refreshToken
                })
                .expect(200)

            await agent
                .post('/api/auth/logout')
                .send({ refreshToken })
                .expect(200)
            await agent
                .post('/api/auth/refresh')
                .send({ refreshToken })
                .expect(404)
        })
    })
})
