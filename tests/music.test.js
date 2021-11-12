const { agent } = require('./init')

describe('Music', () => {
    describe('POST /api/music/getSearchSuggestions', () => {
        test('Успешное получение предложений по поиску', async () => {
            await agent
                .post('/api/music/getSearchSuggestions')
                .send({ text: 'chasimg t' })
                .expect(({ body }) => {
                    body // ?
                    expect(Array.isArray(body)).toBe(true)
                    expect(body.length).toBeGreaterThan(0)
                })
                .expect(200)
        })

        test('Нет предложений по поиску', async () => {
            await agent
                .post('/api/music/getSearchSuggestions')
                .send({ text: 'n59yt384ht8345g8yg34ogh40534923450g4' })
                .expect(({ body }) => {
                    expect(Array.isArray(body)).toBe(true)
                    expect(body.length).toBe(0)
                })
                .expect(200)
        })
    })

    describe('POST /api/music/search', () => {
        test('Успешный поиск', async () => {
            await agent
                .post('/api/music/search')
                .send({ text: 'chasing the horizon' })
                .expect(({ body }) => {
                    body // ?
                    expect(Array.isArray(body)).toBe(true)
                    expect(body.length).toBeGreaterThan(0)
                    body.forEach(song => {
                        expect(song).toHaveProperty('type')
                        expect(song).toHaveProperty('name')
                        expect(song).toHaveProperty('videoId')
                        expect(song).toHaveProperty('artist')
                        expect(song).toHaveProperty('duration')
                        expect(song).toHaveProperty('thumbnails')

                        expect(song.type).toBe('song')
                    });
                })
                .expect(200)
        })

        test('Ничего не найдено', async () => {
            await agent
                .post('/api/music/search')
                .send({ text: 'n59yt384ht8345g8yg34ogh40534923450g4' })
                .expect(({ body }) => {
                    body // ?
                    expect(Array.isArray(body)).toBe(true)
                    expect(body.length).toBe(0)
                })
                .expect(200)
        })
    })

    // describe('GET /api/music/download', () => {
    //     const id = 'PVofPOSlf-g'

    // })

    // describe('GET /api/music/get', () => {
        
    // })
})
