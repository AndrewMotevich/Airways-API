const swagger = {
    openapi: '3.0.0',
    info: {
        title: 'Airways API',
        version: '1.0.0',
        description: 'The REST API for Airways application',
    },
    servers: [
        {
            url: 'http://localhost:8081',
            description: 'Development-server',
        },
        {
            url: 'https://airways-api.vercel.app/',
            description: 'Vercel deployed server',
        },
    ],
    tags: [{ name: 'Greetings', description: 'Example that everything work' }],
    paths: {
        '/greetings': {
            get: {
                summary: 'return message: "Everything work fine"',
                tags: ['Greetings'],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Hello World',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default swagger;
