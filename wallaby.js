module.exports = () => {
    return {
        autoDetect: true,
        workers: {
            initial: 1,
            regular: 1,
            restart: true,
        },
        runMode: 'onsave',
        setup: function() {
            console.log('📐wallaby setup')
        },
        teardown: function (wallaby) {
            console.log('Teardown')
            console.log('Current worker id: ' + wallaby.workerId)
            console.log('Current session id: ' + wallaby.sessionId)
        },
    }
}
