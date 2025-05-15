import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle('Planalto Bittar API')
        .setDescription('API do sistema de reservas do Hotel Planalto Bittar')
        .setVersion('1.0')
        .addTag('reservations', 'Endpoints relacionados a reservas')
        .addTag('rooms', 'Endpoints relacionados a quartos')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                description: 'Enter your token in the format: Bearer <token>',
                in: 'header',
            },
            'access-token',
        )
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(process.env.PORT ?? 3333)
}
bootstrap()
